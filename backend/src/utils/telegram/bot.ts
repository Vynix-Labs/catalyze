import TelegramBot from "node-telegram-bot-api";
import env from "../../config/env";

const { TELEGRAM_TOKEN, ADMIN_CHAT_ID, MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_BASE_URL } = env;
const { APP_URL, ADMIN_API_TOKEN } = env;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Approve withdrawal (manual)
bot.onText(/\/approve (\S+)(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_CHAT_ID) {
    return bot.sendMessage(chatId, "You are not authorized.");
  }
  const reference = match?.[1];
  const proofUrl = match?.[2];
  if (!reference) return bot.sendMessage(chatId, "Usage: /approve <reference> [proofUrl]");

  try {
    const resp = await fetch(`${APP_URL}/fiat/admin/withdraw/${reference}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_API_TOKEN || "",
      },
      body: JSON.stringify({ proofUrl }),
    });
    if (resp.ok) {
      bot.sendMessage(chatId, `Approved ${reference}`);
    } else {
      const txt = await resp.text();
      bot.sendMessage(chatId, `Approve failed: ${txt}`);
    }
  } catch (err: unknown) {
    const msgText = err instanceof Error ? err.message : String(err);
    bot.sendMessage(chatId, `Error: ${msgText}`);
  }
});

// Reject withdrawal (manual)
bot.onText(/\/reject (\S+)(?:\s+([\s\S]+))?/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_CHAT_ID) {
    return bot.sendMessage(chatId, "You are not authorized.");
  }
  const reference = match?.[1];
  const reason = match?.[2];
  if (!reference) return bot.sendMessage(chatId, "Usage: /reject <reference> [reason]");

  try {
    const resp = await fetch(`${APP_URL}/fiat/admin/withdraw/${reference}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_API_TOKEN || "",
      },
      body: JSON.stringify({ reason }),
    });
    if (resp.ok) {
      bot.sendMessage(chatId, `Rejected ${reference}`);
    } else {
      const txt = await resp.text();
      bot.sendMessage(chatId, `Reject failed: ${txt}`);
    }
  } catch (err: unknown) {
    const msgText = err instanceof Error ? err.message : String(err);
    bot.sendMessage(chatId, `Error: ${msgText}`);
  }
});
let botStopped = false;

// Send message helper
export function notifyAdminOfWithdrawal(details: {
  reference: string;
  amountFiat: number;
  tokenSymbol: string;
  amountToken: string | number;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  narration?: string;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const {
    reference,
    amountFiat,
    tokenSymbol,
    amountToken,
    bankName,
    bankCode,
    accountNumber,
    narration,
    userId,
    userName,
    userEmail,
  } = details;

  const lines = [
    `New withdrawal request`,
    `Ref: ${reference}`,
    `User: ${userName ?? "N/A"} (${userEmail ?? "N/A"})`,
    `UserId: ${userId}`,
    `Fiat: ₦${amountFiat}`,
    `Token: ${amountToken} ${tokenSymbol}`,
    `Bank: ${bankName} ${bankCode ? `(${bankCode})` : ""}`.trim(),
    `Account: ${accountNumber}`,
    narration ? `Narration: ${narration}` : undefined,
    `\nMonnify flow: /otp ${reference} 123456`,
  ].filter(Boolean);

  bot
    .sendMessage(ADMIN_CHAT_ID, lines.join("\n"))
    .then(() => console.log("Telegram message sent"))
    .catch((err) => console.error("Telegram sendMessage failed:", err));
}

export async function shutdownTelegramBot() {
  if (botStopped) return;
  botStopped = true;
  try {
    if (bot.isPolling()) {
      await bot.stopPolling();
      console.log("Telegram bot polling stopped");
    }
    await bot.close();
    console.log("Telegram bot connection closed");
  } catch (err) {
    console.error("Telegram bot shutdown failed:", err);
  }
}

bot.on("polling_error", (err) => console.error("Polling error:", err));
bot.on("webhook_error", (err) => console.error("Webhook error:", err));

console.log("Telegram bot initialized");

// Function to get a fresh access token
type MonnifyAuthJson = {
  requestSuccessful?: boolean;
  responseMessage?: string;
  responseBody?: { accessToken?: string };
};

async function getMonnifyToken() {
  const authString = Buffer.from(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`).toString("base64");
  const resp = await fetch(`${MONNIFY_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({}),
  });

  const json = (await resp.json()) as unknown as MonnifyAuthJson;
  if (!resp.ok || !json?.responseBody?.accessToken) {
    throw new Error(json?.responseMessage || "Failed to get token");
  }
  return json.responseBody.accessToken;
}

// Listen for OTP command
bot.onText(/\/otp (\S+) (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_CHAT_ID) {
    return bot.sendMessage(chatId, "You are not authorized.");
  }

  const reference = match?.[1];
  const otp = match?.[2];

  try {
    const token = await getMonnifyToken();

    const resp = await fetch(`${MONNIFY_BASE_URL}/api/v2/disbursements/single/validate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reference, authorizationCode: otp }),
    });

    const json = (await resp.json()) as unknown as { responseMessage?: string };
    if (resp.ok) {
      bot.sendMessage(chatId, `Transfer confirmed for reference ${reference}`);
    } else {
      bot.sendMessage(chatId, `Failed: ${json?.responseMessage || 'Unknown error'}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    bot.sendMessage(chatId, `Error: ${msg}`);
  }
});

// Listen for resend OTP command
bot.onText(/\/resend (\S+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_CHAT_ID) {
    return bot.sendMessage(chatId, "You are not authorized.");
  }

  const reference = match?.[1];
  if (!reference) return bot.sendMessage(chatId, "Usage: /resend <reference>");

  try {
    const token = await getMonnifyToken();
    const resp = await fetch(`${MONNIFY_BASE_URL}/api/v2/disbursements/single/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reference }),
    });
    const json = (await resp.json()) as unknown as { responseMessage?: string };
    if (resp.ok) {
      bot.sendMessage(chatId, `OTP resent for ${reference}`);
    } else {
      bot.sendMessage(chatId, `Failed: ${json?.responseMessage || 'Unknown error'}`);
    }
  } catch (err: unknown) {
    const msgText = err instanceof Error ? err.message : String(err);
    bot.sendMessage(chatId, `Error: ${msgText}`);
  }
});

// Listen for status command
bot.onText(/\/status (\S+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_CHAT_ID) {
    return bot.sendMessage(chatId, "You are not authorized.");
  }

  const reference = match?.[1];
  if (!reference) return bot.sendMessage(chatId, "Usage: /status <reference>");

  try {
    const token = await getMonnifyToken();
    const resp = await fetch(`${MONNIFY_BASE_URL}/api/v2/disbursements/single/summary?reference=${reference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await resp.json()) as unknown as { responseBody?: { status?: string; transactionStatus?: string } };
    if (resp.ok) {
      const status = json?.responseBody?.status || json?.responseBody?.transactionStatus || "UNKNOWN";
      bot.sendMessage(chatId, `Status for ${reference}: ${status}`);
    } else {
      bot.sendMessage(chatId, `Failed to fetch status`);
    }
  } catch (err: unknown) {
    const msgText = err instanceof Error ? err.message : String(err);
    bot.sendMessage(chatId, `Error: ${msgText}`);
  }
});
