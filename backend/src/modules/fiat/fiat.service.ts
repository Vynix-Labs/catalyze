import { randomUUID, createHash } from "crypto";
import { eq, and } from "drizzle-orm";
import { depositIntents, balances, transactions } from "../../db/schema";
import env from "../../config/env";
import { Buffer } from "buffer";
import type { InitiateFiatDepositInput } from "./fiat.schema";

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
}



/**
 * handleMonnifyWebhook
 * - Verifies signature
 * - Processes only SUCCESSFUL_TRANSACTION events
 * - Updates deposit_intents, credits user balance, creates transactions record
 */
export async function handleMonnifyWebhook(fastify: any, request: any) {
  const rawBodyStr: string =
    request.rawBody?.toString("utf8") ??
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
  } catch (err) {
    await fastify.db
      .update(depositIntents)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(depositIntents.id, deposit.id));

    fastify.log.error(err, "Error processing Monnify webhook");
    throw new Error("processing error");
  }
}