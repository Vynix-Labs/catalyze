import { randomUUID, createHash } from "crypto";
import { eq, and } from "drizzle-orm";
import { depositIntents, balances, transactions, withdrawRequests } from "../../db/schema";
import env from "../../config/env";
import { Buffer } from "buffer";
import { InitiateFiatDepositInput, InitiateFiatTransferInput } from "./fiat.schema";
import crypto from "crypto";
import { mapMonnifyStatus } from "../../utils/monnify";

const { MONNIFY_BASE_URL, MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_CONTRACT_CODE } = env;

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

    const json = await res.json();
    if (!json.requestSuccessful) {
      throw new Error(json.responseMessage || "Failed to authenticate with Monnify");
    }

    this.cachedToken = json.responseBody.accessToken;
    this.tokenExpiry = now + json.responseBody.expiresIn - 30;
    return this.cachedToken;
  }

  private async post<T = any>(endpoint: string, body: any): Promise<T> {
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

  async initTransaction(payload: any) {
    return this.post("/api/v1/merchant/transactions/init-transaction", payload);
  }

  async initBankTransfer(transactionReference: string) {
    return this.post("/api/v1/merchant/bank-transfer/init-payment", {
      transactionReference,
    });
  }

  async createDepositIntent(
    fastify: any,
    userId: string,
    input: InitiateFiatDepositInput
  ) {
    const { amountFiat, tokenSymbol } = input;
    const providerRef = `MNFY-${Date.now()}-${randomUUID()}`;

    const [intent] = await fastify.db
      .insert(depositIntents)
      .values({
        id: randomUUID(),
        userId,
        tokenSymbol,
        amountFiat: amountFiat.toFixed(2),
        amountToken: amountFiat.toString(),
        status: "awaiting_payment",
        provider: "MONNIFY",
        providerRef,
      })
      .returning();

    let initResp;
    try {
      initResp = await this.initTransaction({
        amount: amountFiat,
        currencyCode: "NGN",
        paymentReference: providerRef,
        contractCode: MONNIFY_CONTRACT_CODE,
        customerName: userId,
        customerEmail: `${userId}@example.com`,
        paymentDescription: "Wallet deposit",
      });
    } catch (err) {
      await fastify.db
        .update(depositIntents)
        .set({ status: "failed" })
        .where(eq(depositIntents.id, intent.id));
      throw err;
    }

    if (!initResp?.requestSuccessful) {
      await fastify.db
        .update(depositIntents)
        .set({ status: "failed" })
        .where(eq(depositIntents.id, intent.id));
      throw new Error(initResp?.responseMessage || "Monnify init failed");
    }

    const txRef = initResp.responseBody.transactionReference;

    let bankResp;
    try {
      bankResp = await this.initBankTransfer(txRef);
    } catch (err) {
      await fastify.db
        .update(depositIntents)
        .set({ status: "failed" })
        .where(eq(depositIntents.id, intent.id));
      throw err;
    }

    if (!bankResp?.requestSuccessful) {
      await fastify.db
        .update(depositIntents)
        .set({ status: "failed" })
        .where(eq(depositIntents.id, intent.id));
      throw new Error(bankResp?.responseMessage || "Bank transfer init failed");
    }

    return {
      ...intent,
      paymentInstructions: bankResp.responseBody,
    };
  }

  async initiateDisbursement(payload: any) {
    return this.post("/api/v2/disbursements/single", payload);
  }

  async getDisbursementStatus(reference: string) {
    const token = await this.getToken();
    const res = await fetch(
      `${MONNIFY_BASE_URL}/api/v2/disbursements/single/summary?reference=${reference}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  /**
   * Create a fiat transfer intent (withdraw)
   */
  async createTransferIntent(
    fastify: any,
    userId: string,
    input: InitiateFiatTransferInput
  ) {
    const { amountFiat, tokenSymbol, bankName, bankCode, accountNumber, narration } = input;
    const reference = `MNFY-WDR-${Date.now()}-${randomUUID()}`;

    // Lookup user balance
    const [balance] = await fastify.db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.tokenSymbol, tokenSymbol)));

    if (!balance || Number(balance.balance) < Number(amountFiat)) {
      throw new Error("Insufficient balance");
    }

    let withdraw: any;

    // Transaction block: deduct balance, insert withdraw and ledger
    await fastify.db.transaction(async (tx) => {
      const newBalance = (Number(balance.balance) - Number(amountFiat)).toString();
      await tx
        .update(balances)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(balances.id, balance.id));

      const [wr] = await tx
        .insert(withdrawRequests)
        .values({
          id: randomUUID(),
          userId,
          tokenSymbol,
          amountFiat: amountFiat.toFixed(2),
          amountToken: amountFiat.toString(), // conversion logic can go here
          bankName,
          accountNumber,
          status: "pending",
          reference,
        })
        .returning();
      withdraw = wr;

      await tx.insert(transactions).values({
        id: randomUUID(),
        userId,
        type: "withdraw",
        subtype: "fiat",
        tokenSymbol,
        amountToken: amountFiat.toString(),
        amountFiat: amountFiat.toFixed(2),
        status: "pending",
        reference,
        txHash: null,
        metadata: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 🔹 Call Monnify after DB commit
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
          const body = statusResp.responseBody;
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

          return { ...withdraw, provider: "MONNIFY", monnifyResponse: body };
        }
      }

      // Rollback effect: mark failed  and refund
      await fastify.db.transaction(async (tx) => {
        await tx
          .update(withdrawRequests)
          .set({ status: "failed" })
          .where(eq(withdrawRequests.id, withdraw.id));

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
      .where(eq(withdrawRequests.id, withdraw.id));

    await fastify.queues.withdraw.add(
      "check-withdraw-status",
      { reference },
      { delay: 60000 }
    );

    return { ...withdraw, provider: "MONNIFY", monnifyResponse: resp };
  }

}

export const monnify = new MonnifyClient();

export async function syncTransferStatus(fastify: any, reference: string) {
  const resp = await monnify.getDisbursementStatus(reference);

  if (!resp.requestSuccessful) {
    throw new Error(resp.responseMessage || "Monnify status check failed");
  }

  const body = resp.responseBody;
  const status = body.status; // e.g. SUCCESS, FAILED, PROCESSING
  const mappedStatus = mapMonnifyStatus(body.status);

  // 🔹 Transaction block for consistency
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
export async function handleMonnifyWebhook(fastify: any, request: any) {
  const rawBodyStr: string =
    (request as any).rawBody?.toString("utf8") ??
    (typeof request.body === "string" ? request.body : JSON.stringify(request.body));

  fastify.log.info({ rawBodyStr }, "Raw body used for signature");

  const signatureHeader =
    (request.headers["monnify-signature"] as string) ||
    (request.headers["x-monnify-signature"] as string);

  if (!signatureHeader) {
    throw new Error("Missing signature header");
  }

  const computed = createHash("sha512")
    .update(rawBodyStr + (MONNIFY_SECRET_KEY ?? ""))
    .digest("hex");

  if (computed !== signatureHeader) {
    fastify.log.warn({ computed, signatureHeader }, "Invalid Monnify webhook signature");
    throw new Error("Invalid signature");
  }

  const { eventType, eventData } = request.body;

  if (eventType !== "SUCCESSFUL_TRANSACTION" || !eventData) {
    return { success: true, ignored: true };
  }

  const paymentReference = eventData.paymentReference;
  const amountPaid = Number(eventData.amountPaid ?? 0);
  const transactionReference = eventData.transactionReference ?? null;

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
    // Update balance
    const [existingBalance] = await fastify.db
      .select()
      .from(balances)
      .where(
        and(
          eq(balances.userId, deposit.userId),
          eq(balances.tokenSymbol, deposit.tokenSymbol)
        )
      );

    if (existingBalance) {
      const newBalance = (
        Number(existingBalance.balance) + Number(deposit.amountToken)
      ).toString();
      await fastify.db
        .update(balances)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(balances.id, existingBalance.id));
    } else {
      await fastify.db.insert(balances).values({
        id: randomUUID(),
        userId: deposit.userId,
        tokenSymbol: deposit.tokenSymbol,
        balance: deposit.amountToken,
        updatedAt: new Date(),
      });
    }

    // Insert into transactions ledger
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
      txHash: null,
      metadata: JSON.stringify({ monnify: eventData }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mark deposit intent completed
    await fastify.db
      .update(depositIntents)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(depositIntents.id, deposit.id));

    return { success: true };
  } catch (err: any) {
    await fastify.db
      .update(depositIntents)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(depositIntents.id, deposit.id));

    fastify.log.error(err, "Error processing Monnify webhook");
    throw new Error("processing error");
  }
}