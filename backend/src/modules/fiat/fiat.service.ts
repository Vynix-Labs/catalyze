import { randomUUID, createHmac, timingSafeEqual } from "crypto";
import { eq, and, desc, gt } from "drizzle-orm";
import { depositIntents, balances, transactions, withdrawRequests, priceFeeds, reserves, userWallets } from "../../db/schema";
import env from "../../config/env";
import { Buffer } from "buffer";
import type { InitiateFiatDepositInput, InitiateFiatTransferInput } from "./fiat.schema";
import { mapMonnifyStatus } from "../../utils/monnify";
import { toChainToken, type CryptoCurrency, TRADING_FEES } from "../../config";
import { getSystemTokenBalance, transferFromSystem } from "../../utils/wallet/system";
import { validateSufficientBalance } from "../../utils/wallet/tokens";
import { transferWithChipi } from "../../utils/wallet/chipi";
import type { WalletData } from "@chipi-pay/chipi-sdk";
import type { FastifyInstance } from "fastify/types/instance";
import type { FastifyRequest } from "fastify";
import { validatePinToken } from "../../utils/pinToken";

const { MONNIFY_BASE_URL, MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_CONTRACT_CODE } = env;

// Monnify API response types (partial, only what's needed here)
type MonnifyAuthResponse = {
  requestSuccessful: boolean;
  responseMessage?: string;
  responseBody: {
    accessToken: string;
    expiresIn: number; // seconds
  };
};

type MonnifyGenericResponse = {
  requestSuccessful: boolean;
  responseMessage?: string;
  responseCode?: string;
  responseBody: unknown;
};

type MonnifyInitTxResponse = {
  requestSuccessful: boolean;
  responseMessage?: string;
  responseBody: { transactionReference: string };
};

type MonnifyBankInitResponse = {
  requestSuccessful: boolean;
  responseMessage?: string;
  responseBody: Record<string, unknown>;
};

type PriceFeedRow = typeof priceFeeds.$inferSelect;

type MonnifyDisbursementBody = {
  status: string;
  transactionReference?: string;
};

export class MonnifyClient {
  private cachedToken: string | null = null;
  private tokenExpiry = 0;

  private async getToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && now < this.tokenExpiry) {
      return this.cachedToken;
    }

    const authString = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`).toString("base64");
    const res = await fetch(`${MONNIFY_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { Authorization: `Basic ${authString}` },
    });

    if (!res.ok) {
      throw new Error(`Monnify auth failed: ${res.status} ${await res.text()}`);
    }

    const json = (await res.json()) as MonnifyAuthResponse;
    if (!json.requestSuccessful) {
      throw new Error(json.responseMessage || "Failed to authenticate with Monnify");
    }

    this.cachedToken = json.responseBody.accessToken;
    this.tokenExpiry = now + json.responseBody.expiresIn - 30;
    return this.cachedToken!;
  }

  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const token = await this.getToken();
    const res = await fetch(`${MONNIFY_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Monnify request failed: ${res.status} ${await res.text()}`);
    }

    return res.json() as Promise<T>;
  }

  async initTransaction(payload: unknown): Promise<MonnifyInitTxResponse> {
    return this.post<MonnifyInitTxResponse>("/api/v1/merchant/transactions/init-transaction", payload);
  }

  async initBankTransfer(transactionReference: string): Promise<MonnifyBankInitResponse> {
    return this.post<MonnifyBankInitResponse>("/api/v1/merchant/bank-transfer/init-payment", {
      transactionReference,
    });
  }

  async createDepositIntent(
    fastify: FastifyInstance,
    userId: string,
    input: InitiateFiatDepositInput
  ) {
    const { amountFiat, tokenSymbol } = input;
    const providerRef = `MNFY-${Date.now()}-${randomUUID()}`;
    const symbol = tokenSymbol.toLowerCase() as CryptoCurrency;

    // compute token amount using BUY price; priceFeeds stored in lowercase
    const buyFeeMultiplier = 1 + (TRADING_FEES.buyPercent ?? 0) / 100;

    const amountToken = await fastify.db
      .select()
      .from(priceFeeds)
      .where(eq(priceFeeds.tokenSymbol, symbol))
      .orderBy(desc(priceFeeds.updatedAt))
      .limit(1)
      .then((rows: PriceFeedRow[]) => {
        if (rows.length === 0) throw new Error(`No price feed available for ${symbol}`);
        const row = rows[0]!;
        const priceInNGN = Number(row.priceNgnBuy);
        if (!priceInNGN || priceInNGN <= 0) throw new Error(`Invalid price feed for ${symbol}`);
        const adjustedPrice = priceInNGN * buyFeeMultiplier;
        if (!adjustedPrice || adjustedPrice <= 0) throw new Error(`Invalid adjusted price for ${symbol}`);
        return (amountFiat / adjustedPrice).toFixed(8);
      });

    // Liquidity check: system balance - sum(active reserves) >= requested
    const systemBal = await getSystemTokenBalance(symbol);
    const now = new Date();
    const activeRes = await fastify.db
      .select()
      .from(reserves)
      .where(and(eq(reserves.tokenSymbol, symbol), eq(reserves.status, "pending"), gt(reserves.expiresAt, now)));
    const sumActive = activeRes.reduce((acc, r: typeof reserves.$inferSelect) => acc + Number(r.amountToken ?? 0), 0);
    if (systemBal - sumActive < Number(amountToken)) {
      throw new Error("Insufficient liquidity, please try again later");
    }

    // Create reserve then deposit intent
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const [reserveRow] = await fastify.db
      .insert(reserves)
      .values({
        id: randomUUID(),
        userId,
        tokenSymbol: symbol,
        amountToken: amountToken,
        status: "pending",
        txHash: null,
        notes: null,
        expiresAt,
      })
      .returning();
    if (!reserveRow) throw new Error("Failed to create reserve");

    const [intent] = await fastify.db
      .insert(depositIntents)
      .values({
        id: randomUUID(),
        userId,
        tokenSymbol: symbol,
        amountFiat: amountFiat.toFixed(2),
        amountToken,
        status: "awaiting_payment",
        provider: "MONNIFY",
        providerRef,
        reserveId: reserveRow.id,
      })
      .returning();
    if (!intent) throw new Error("Failed to create deposit intent");

    // backfill reserve.intentId uniqueness link
    await fastify.db
      .update(reserves)
      .set({ intentId: intent.id })
      .where(eq(reserves.id, reserveRow.id));

    let initResp;
    try {
      initResp = await this.initTransaction({
        amount: amountFiat,
        currencyCode: "NGN",
        paymentReference: providerRef,
        contractCode: MONNIFY_CONTRACT_CODE,
        customerName: userId,
        customerEmail: `${userId}@catalyze.finance`,
        paymentDescription: "Wallet deposit",
      });
    } catch (err) {
      await fastify.db.update(depositIntents).set({ status: "failed" }).where(eq(depositIntents.id, intent!.id));
      await fastify.db.update(reserves).set({ status: "cancelled" }).where(eq(reserves.id, reserveRow.id));
      throw err;
    }

    if (!initResp?.requestSuccessful) {
      await fastify.db.update(depositIntents).set({ status: "failed" }).where(eq(depositIntents.id, intent!.id));
      await fastify.db.update(reserves).set({ status: "cancelled" }).where(eq(reserves.id, reserveRow.id));
      throw new Error(initResp?.responseMessage || "Monnify init failed");
    }

    const txRef = initResp.responseBody.transactionReference;

    let bankResp;
    try {
      bankResp = await this.initBankTransfer(txRef);
    } catch (err) {
      await fastify.db.update(depositIntents).set({ status: "failed" }).where(eq(depositIntents.id, intent!.id));
      await fastify.db.update(reserves).set({ status: "cancelled" }).where(eq(reserves.id, reserveRow.id));
      throw err;
    }

    if (!bankResp?.requestSuccessful) {
      await fastify.db.update(depositIntents).set({ status: "failed" }).where(eq(depositIntents.id, intent!.id));
      await fastify.db.update(reserves).set({ status: "cancelled" }).where(eq(reserves.id, reserveRow.id));
      throw new Error(bankResp?.responseMessage || "Bank transfer init failed");
    }

    return { ...intent, paymentInstructions: bankResp.responseBody };
  }

  async initiateDisbursement(payload: Record<string, unknown>): Promise<MonnifyGenericResponse> {
    return this.post<MonnifyGenericResponse>("/api/v2/disbursements/single", payload);
  }

  async authorizeDisbursement(reference: string, authorizationCode: string): Promise<MonnifyGenericResponse> {
    return this.post<MonnifyGenericResponse>("/api/v2/disbursements/single/validate-otp", {
      reference,
      authorizationCode,
    });
  }

  async getDisbursementStatus(reference: string): Promise<MonnifyGenericResponse> {
    const token = await this.getToken();
    const res = await fetch(
      `${MONNIFY_BASE_URL}/api/v2/disbursements/single/summary?reference=${reference}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<MonnifyGenericResponse>;
  }

  private async get<T>(endpoint: string): Promise<T> {
    const token = await this.getToken();
    const res = await fetch(`${MONNIFY_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
  }

  async getBanks(): Promise<MonnifyGenericResponse> {
    // Monnify banks endpoint
    return this.get<MonnifyGenericResponse>(`/api/v1/banks`);
  }

  async validateAccount(bankCode: string, accountNumber: string): Promise<MonnifyGenericResponse> {
    return this.get<MonnifyGenericResponse>(`/api/v1/disbursements/account/validate?bankCode=${bankCode}&accountNumber=${accountNumber}`);
  }

  async resendOtp(reference: string): Promise<MonnifyGenericResponse> {
    return this.post<MonnifyGenericResponse>(`/api/v2/disbursements/single/resend-otp`, {
      reference,
    });
  }

  /**
   * Create a fiat transfer intent (withdraw)
   */
  async createTransferIntent(fastify: FastifyInstance, userId: string, input: InitiateFiatTransferInput) {
    const { amountFiat, tokenSymbol, bankName, accountNumber, bankCode, narration, pinToken } = input;

    const pinValid = await validatePinToken(fastify, userId, pinToken, "fiat_transfer");
    if (!pinValid) throw new Error("Invalid or expired PIN token");

    const reference = `MNFY-WDR-${Date.now()}-${randomUUID()}`;
    const symbol = tokenSymbol.toLowerCase() as CryptoCurrency;

    const sellFeeMultiplier = 1 - (TRADING_FEES.sellPercent ?? 0) / 100;
    if (sellFeeMultiplier <= 0) {
      throw new Error("Invalid sell fee configuration");
    }

    const amountToken = await fastify.db
    .select()
    .from(priceFeeds)
    .where(eq(priceFeeds.tokenSymbol, symbol))
    .orderBy(desc(priceFeeds.updatedAt))
    .limit(1)
    .then((rows) => {
      if (rows.length === 0) {
        throw new Error(`No price feed available for ${symbol}`);
      }
      const row = rows[0]!;
      const priceInNGN = Number(row.priceNgnSell);
      if (priceInNGN <= 0) {
        throw new Error(`Invalid price feed for ${symbol}`);
      }
      const adjustedPrice = priceInNGN * sellFeeMultiplier;
      if (adjustedPrice <= 0) {
        throw new Error(`Invalid adjusted price for ${symbol}`);
      }
      return (amountFiat / adjustedPrice).toFixed(8);
    });

    // Lookup user DB balance and on-chain balance
    const [balance] = await fastify.db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.tokenSymbol, symbol)));
    if (!balance || Number(balance.balance) < Number(amountToken)) {
      throw new Error("Insufficient balance");
    }

    // Ensure user wallet exists for on-chain transfer (do not auto-create here)
    const [wallet] = await fastify.db.select().from(userWallets).where(eq(userWallets.userId, userId));
    if (!wallet) throw new Error("User wallet not found");
    const { isValid, message } = await validateSufficientBalance(wallet.publicKey, Number(amountToken), symbol);
    if (!isValid) throw new Error(message);
    

    type WithdrawRow = typeof withdrawRequests.$inferSelect;
    let withdraw: WithdrawRow | null = null;

    // Transaction block: deduct token balance, insert withdraw and ledger (pending)
    await fastify.db.transaction(async (tx) => {
      const newBalance = (Number(balance.balance) - Number(amountToken)).toString();
      await tx
        .update(balances)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(balances.id, balance.id));

      const [wr] = await tx
        .insert(withdrawRequests)
        .values({
          id: randomUUID(),
          userId,
          tokenSymbol: symbol,
          amountFiat: amountFiat.toFixed(2),
          amountToken: amountToken,
          bankName,
          accountNumber,
          status: "pending",
          reference,
        })
        .returning();
      withdraw = wr ?? null;

      await tx.insert(transactions).values({
        id: randomUUID(),
        userId,
        type: "withdraw",
        subtype: "fiat",
        tokenSymbol: symbol,
        amountToken: amountToken,
        amountFiat: amountFiat.toFixed(2),
        status: "pending",
        reference,
        txHash: null,
        metadata: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Perform on-chain user -> system transfer via Chipi
    try {
      const tx = await transferWithChipi(
        wallet as unknown as WalletData,
        env.SYSTEM_WALLET_ADDRESS,
        Number(amountToken),
        toChainToken(symbol)
      );
      const txHash = typeof tx === "string"
        ? tx
        : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";


      await fastify.db
        .update(transactions)
        .set({ txHash })
        .where(eq(transactions.reference, reference));
    } catch (err) {
      // If on-chain transfer fails, refund immediately
      if (!withdraw) throw new Error("Withdraw row missing");
      await fastify.db.transaction(async (tx) => {
        await tx
          .update(withdrawRequests)
          .set({ status: "failed" })
          .where(eq(withdrawRequests.id, withdraw!.id));

        await tx
          .update(transactions)
          .set({ status: "failed" })
          .where(eq(transactions.reference, reference));

        await tx
          .update(balances)
          .set({ balance: balance.balance, updatedAt: new Date() })
          .where(eq(balances.id, balance.id));
      });
      throw err;
    }

    // Call Monnify after DB commit
    const resp = await this.initiateDisbursement({
      amount: amountFiat,
      reference,
      narration: (narration ?? "Wallet Transfer").slice(0, 80),
      destinationBankCode: bankCode,
      destinationAccountNumber: accountNumber,
      currency: "NGN",
      sourceAccountNumber: env.MONNIFY_WALLET_ACCOUNT_NUMBER,
    });

    if (!resp.requestSuccessful) {
      if (resp.responseCode === "D07") {
        // Duplicate request -> fetch status instead of failing
        const statusResp = await this.getDisbursementStatus(reference);
        if (statusResp.requestSuccessful) {
          const body = statusResp.responseBody as MonnifyDisbursementBody;
          const mappedStatus = mapMonnifyStatus(body.status);

          // Update DB with actual status
          await fastify.db
            .update(withdrawRequests)
            .set({ status: mappedStatus, updatedAt: new Date() })
            .where(eq(withdrawRequests.reference, reference));

          await fastify.db
            .update(transactions)
            .set({
              status: mappedStatus,
              txHash: body.transactionReference ?? null,
              updatedAt: new Date(),
            })
            .where(eq(transactions.reference, reference));

          if (!withdraw) throw new Error("Withdraw row missing");
          const wr: WithdrawRow = withdraw as WithdrawRow;
          return {
            id: wr.id,
            amountFiat: String(wr.amountFiat),
            amountToken: String(wr.amountToken),
            status: mappedStatus,
            provider: "MONNIFY",
            reference,
            monnifyResponse: body,
          };
        }
      }

      // Rollback effect: mark failed and refund
      await fastify.db.transaction(async (tx) => {
        await tx
          .update(withdrawRequests)
          .set({ status: "failed" })
          .where(eq(withdrawRequests.id, withdraw!.id));
        await tx
          .update(transactions)
          .set({ status: "failed" })
          .where(eq(transactions.reference, reference));

        await tx
          .update(balances)
          .set({ balance: balance.balance, updatedAt: new Date() })
          .where(eq(balances.id, balance.id));
      });

      throw new Error(resp.responseMessage || "Disbursement failed");
    }

    await fastify.db
      .update(withdrawRequests)
      .set({ status: "processing" })
      .where(eq(withdrawRequests.id, withdraw!.id));

    await fastify.queues.withdraw.add(
      "initiate_withdrawal",
      {
        reference,
        amount: amountFiat,
        bank: bankName,
      }
    );

    if (!withdraw) throw new Error("Withdraw row missing");
    const wr: WithdrawRow = withdraw as WithdrawRow;
    return {
      id: wr.id,
      amountFiat: String(wr.amountFiat),
      amountToken: String(wr.amountToken),
      status: "processing",
      provider: "MONNIFY",
      reference,
      monnifyResponse: resp,
    };
  }

}

export const monnify = new MonnifyClient();

export async function syncTransferStatus(fastify: FastifyInstance, reference: string) {
  const resp = await monnify.getDisbursementStatus(reference);

  if (!resp.requestSuccessful) {
    throw new Error(resp.responseMessage || "Monnify status check failed");
  }

  const body = resp.responseBody as MonnifyDisbursementBody;
  const status = body.status;
  const mappedStatus = mapMonnifyStatus(body.status);

  // Transaction block for consistency
  await fastify.db.transaction(async (tx) => {
    // Update withdraw_requests
    await tx
      .update(withdrawRequests)
      .set({ status: mappedStatus, updatedAt: new Date() })
      .where(eq(withdrawRequests.reference, reference));

    // Update transactions
    await tx
      .update(transactions)
      .set({
        status: mappedStatus,
        txHash: body.transactionReference ?? null,
        updatedAt: new Date(),
      })
      .where(eq(transactions.reference, reference));

    // Refund balance if failed
    if (status === "FAILED") {
      const [wr] = await tx
        .select()
        .from(withdrawRequests)
        .where(eq(withdrawRequests.reference, reference));

      if (wr) {
        const [bal] = await tx
          .select()
          .from(balances)
          .where(
            and(eq(balances.userId, wr.userId), eq(balances.tokenSymbol, wr.tokenSymbol))
          );

        if (bal) {
          await tx
            .update(balances)
            .set({
              balance: (Number(bal.balance) + Number(wr.amountToken)).toString(),
              updatedAt: new Date(),
            })
            .where(eq(balances.id, bal.id));
        }
      }
    }
  });

  return { reference, status: mappedStatus, monnifyResponse: body };
}


/**
 * handleMonnifyWebhook
 * - Verifies signature
 * - Processes only SUCCESSFUL_TRANSACTION events
 * - Updates deposit_intents, credits user balance, creates transactions record
 */
export async function handleMonnifyWebhook(
  fastify: FastifyInstance,
  request: FastifyRequest
) {
  const rawBodyStr: string = JSON.stringify(request.body);

  fastify.log.info({ rawBodyStr }, "Raw body used for signature");

  const signatureHeader =
    (request.headers["monnify-signature"] as string) ||
    (request.headers["x-monnify-signature"] as string);

  if (!signatureHeader) {
    throw new Error("Missing signature header");
  }

  const secret = MONNIFY_SECRET_KEY;
  const computed = createHmac("sha512", secret)
    .update(rawBodyStr)
    .digest("hex");

  const sigHeader = signatureHeader.trim().toLowerCase();
  const comp = computed.toLowerCase();
  const valid =
    sigHeader.length === comp.length &&
    timingSafeEqual(Buffer.from(sigHeader, "utf8"), Buffer.from(comp, "utf8"));
  
  if (!valid) {
    fastify.log.warn({ computed, signatureHeader }, "Invalid Monnify webhook signature");
    throw new Error("Invalid signature");
  }

  const { eventType, eventData } = (request.body as { eventType?: string; eventData?: unknown }) ?? {};

  fastify.log.info(`Valid Webhook: ${eventType}`)

  if (eventType !== "SUCCESSFUL_TRANSACTION" || !eventData) {
    return { success: true, ignored: true };
  }

  const data = eventData as { paymentReference?: string; amountPaid?: number | string; transactionReference?: string };
  const paymentReference = data.paymentReference;
  const amountPaid = Number(data.amountPaid ?? 0);
  const transactionReference = data.transactionReference ?? null;

  if (!paymentReference) {
    throw new Error("Missing paymentReference");
  }

  // Lookup deposit intent
  const [deposit] = await fastify.db
    .select()
    .from(depositIntents)
    .where(eq(depositIntents.providerRef, paymentReference));

  if (!deposit) {
    throw new Error("Deposit intent not found");
  }

  if (deposit.status === "completed") {
    return { success: true, alreadyCompleted: true };
  }

  // Verify amounts
  if (Number(deposit.amountFiat) !== amountPaid) {
    fastify.log.warn(
      { depositId: deposit.id, expected: deposit.amountFiat, got: amountPaid },
      "Amount mismatch"
    );
  }

  // Mark processing
  await fastify.db
    .update(depositIntents)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(depositIntents.id, deposit.id));

  try {
    // Reserve-first fulfillment
    const reserveId = deposit.reserveId;
    const [reserve] = reserveId
      ? await fastify.db.select().from(reserves).where(eq(reserves.id, reserveId))
      : [];

    // Check liquidity (in case reserve expired or we bypassed)
    const symbol = deposit.tokenSymbol as CryptoCurrency;
    const systemBal = await getSystemTokenBalance(symbol);
    const now = new Date();
    const activeRes = await fastify.db
      .select()
      .from(reserves)
      .where(and(eq(reserves.tokenSymbol, symbol), eq(reserves.status, "pending"), gt(reserves.expiresAt, now)));
    const sumActive = activeRes.reduce((acc, r: typeof reserves.$inferSelect) => acc + Number(r.amountToken ?? 0), 0);

    if (systemBal - sumActive < Number(deposit.amountToken)) {
      // Not enough liquidity; flag for admin
      if (reserve) {
        await fastify.db.update(reserves).set({ status: "needs_admin", updatedAt: new Date() }).where(eq(reserves.id, reserve.id));
      }
      return { success: true, needsAdmin: true };
    }

    // Ensure user wallet exists (webhook cannot create wallets without auth token); if missing, mark needs_admin
    const [wallet] = await fastify.db.select().from(userWallets).where(eq(userWallets.userId, deposit.userId));
    if (!wallet) {
      if (reserve) {
        await fastify.db.update(reserves).set({ status: "needs_admin", updatedAt: new Date() }).where(eq(reserves.id, reserve.id));
      }
      return { success: true, needsAdmin: true };
    }

    // Transfer from system wallet to user on-chain
    const tx = await transferFromSystem(symbol, wallet.publicKey, Number(deposit.amountToken));
    const txHash = tx.transactionHash;

    // Credit off-chain balance for platform accounting
    const [existingBalance] = await fastify.db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, deposit.userId), eq(balances.tokenSymbol, deposit.tokenSymbol)));

    if (existingBalance) {
      const newBalance = (Number(existingBalance.balance) + Number(deposit.amountToken)).toString();
      await fastify.db.update(balances).set({ balance: newBalance, updatedAt: new Date() }).where(eq(balances.id, existingBalance.id));
    } else {
      await fastify.db.insert(balances).values({
        id: randomUUID(),
        userId: deposit.userId,
        tokenSymbol: deposit.tokenSymbol,
        balance: deposit.amountToken,
        updatedAt: new Date(),
      });
    }

    // Insert into transactions ledger with on-chain txHash
    await fastify.db.insert(transactions).values({
      id: randomUUID(),
      userId: deposit.userId,
      type: "deposit",
      subtype: "fiat",
      tokenSymbol: deposit.tokenSymbol,
      amountToken: deposit.amountToken,
      amountFiat: deposit.amountFiat,
      status: "completed",
      reference: transactionReference ?? paymentReference,
      txHash: txHash,
      metadata: JSON.stringify({ monnify: eventData }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mark reserve and deposit intent completed
    if (reserve) {
      await fastify.db.update(reserves).set({ status: "succeeded", txHash, updatedAt: new Date() }).where(eq(reserves.id, reserve.id));
    }
    await fastify.db
      .update(depositIntents)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(depositIntents.id, deposit.id));

    return { success: true };
  } catch (err) {
    await fastify.db
      .update(depositIntents)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(depositIntents.id, deposit.id));

    fastify.log.error(err, "Error processing Monnify webhook");
    throw new Error("processing error");
  }
}