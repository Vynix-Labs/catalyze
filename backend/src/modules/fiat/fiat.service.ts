import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { depositIntents } from "../../db/schema";
import env from "../../config/env";
import { Buffer } from "buffer";
import { InitiateFiatDepositInput } from "./fiat.schema";

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
