import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!;
const API_BASE_URL = "http://localhost:3000/api";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Send message helper
export function notifyAdminOfWithdrawal(reference: string, amount: number, bank: string) {
  bot.sendMessage(
    ADMIN_CHAT_ID,
    `New withdrawal request:\n\nRef: ${reference}\nAmount: ₦${amount}\nBank: ${bank}\n\nReply with OTP using:\n/otp ${reference} 123456`
  );
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
    const resp = await fetch(`${API_BASE_URL}/fiat/transfer/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer <admin-api-token>", // You can use a service token here
      },
      body: JSON.stringify({ reference, authorizationCode: otp }),
    });

    const json = await resp.json();
    if (resp.ok) {
      bot.sendMessage(chatId, `Transfer confirmed for reference ${reference}`);
    } else {
      bot.sendMessage(chatId, `Failed: ${json.error}`);
    }
  } catch (err: any) {
    bot.sendMessage(chatId, `Error: ${err.message}`);
  }
});
