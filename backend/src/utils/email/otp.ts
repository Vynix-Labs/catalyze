import type { SentMessageInfo } from "nodemailer";
import { transporter } from "./transporter";
import env from "../../config/env";

export async function sendOtp(
  email: string,
  otp: string
): Promise<SentMessageInfo> {
  const subject = "Your Catalyze OTP Code";
  const html = `
    <div style="font-family: sans-serif;">
      <h2>OpenTask OTP</h2>
      <p>Your OTP code is: <b>${otp}</b></p>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;

  try {
    return await transporter.sendMail({
      from: `"Catalyze" <${env.SMTP_FROM || env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Failed to send OTP email:", err.message);
      throw err;
    } else {
      throw new Error("Unknown error sending OTP email");
    }
  }
}
