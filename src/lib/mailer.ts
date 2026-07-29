import nodemailer from "nodemailer";
import { serverEnv } from "@/lib/env";

export function isEmailConfigured(): boolean {
  return Boolean(
    serverEnv.SMTP_HOST && serverEnv.SMTP_USER && serverEnv.SMTP_PASSWORD && serverEnv.EMAIL_FROM,
  );
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: serverEnv.SMTP_HOST,
      port: serverEnv.SMTP_PORT ? Number(serverEnv.SMTP_PORT) : 587,
      secure: serverEnv.SMTP_SECURE,
      auth: { user: serverEnv.SMTP_USER, pass: serverEnv.SMTP_PASSWORD },
    });
  }
  return transporter;
}

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendMailResult {
  sent: boolean;
  reason?: string;
}

/**
 * Sends transactional email if SMTP is configured. When it is not
 * configured, this returns { sent: false } rather than pretending success —
 * callers (e.g. the forgot-password flow) must surface that honestly.
 */
export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const client = getTransporter();
  if (!client) {
    return { sent: false, reason: "Email delivery is not configured on this deployment." };
  }
  try {
    await client.sendMail({ from: serverEnv.EMAIL_FROM, ...input });
    return { sent: true };
  } catch (error) {
    console.error("[mailer] failed to send email", error);
    return { sent: false, reason: "Email delivery failed." };
  }
}
