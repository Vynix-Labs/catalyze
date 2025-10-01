import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import env from "../../config/env";

const { TELEGRAM_TOKEN, ADMIN_CHAT_ID, MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_BASE_URL } = env;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Send message helper
export function notifyAdminOfWithdrawal(reference: string, amount: number, bank: string) {
  bot.sendMessage(
    ADMIN_CHAT_ID,
    `New withdrawal request:\n\nRef: ${reference}\nAmount: ₦${amount}\nBank: ${bank}\n\nReply with OTP using:\n/otp ${reference} 123456`
  )
  .then(() => console.log("Telegram message sent"))
  .catch((err) => console.error("Telegram sendMessage failed:", err));
}

bot.on("polling_error", (err) => console.error("Polling error:", err));
bot.on("webhook_error", (err) => console.error("Webhook error:", err));

console.log("Telegram bot initialized");

// Function to get a fresh access token
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

  const json = await resp.json();
  if (!resp.ok) throw new Error(json.responseMessage || "Failed to get token");
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

    const json = await resp.json();

    if (resp.ok) {
      bot.sendMessage(chatId, `Transfer confirmed for reference ${reference}`);
    } else {
      bot.sendMessage(chatId, `Failed: ${json.responseMessage || json.error}`);
    }
  } catch (err: any) {
    bot.sendMessage(chatId, `Error: ${err.message}`);
  }
});
