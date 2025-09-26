import nodemailer, { type Transporter } from "nodemailer";
import env from "../../config/env";

export const transporter: Transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});