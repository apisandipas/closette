// Server only. MAILTRAP_USE_SANDBOX sends into a Mailtrap testing inbox
// instead of delivering; the SDK needs that inbox's id.
import { MailtrapClient } from "mailtrap";
import { env } from "@/lib/env";

if (env.MAILTRAP_USE_SANDBOX && !env.MAILTRAP_INBOX_ID) {
  throw new Error("MAILTRAP_USE_SANDBOX needs MAILTRAP_INBOX_ID");
}

const client = new MailtrapClient({
  token: env.MAILTRAP_TOKEN,
  sandbox: env.MAILTRAP_USE_SANDBOX,
  testInboxId: env.MAILTRAP_INBOX_ID,
});

// category groups the message in Mailtrap's email logs and stats.
export async function sendMail(
  to: string,
  subject: string,
  text: string,
  category?: string,
) {
  await client.send({
    from: { email: env.MAILTRAP_FROM, name: "Closette" },
    to: [{ email: to }],
    subject,
    text,
    category,
  });
}
