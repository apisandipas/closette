// Server only. Mail goes through Postmark's REST API. POSTMARK_API_KEY is a
// Postmark server token; the token POSTMARK_API_TEST accepts mail without
// delivering it.
import { env } from "@/lib/env";

// A missing token fails the mail, not the boot. tag groups the message in
// Postmark's activity and stats.
export async function sendMail(
  to: string,
  subject: string,
  text: string,
  tag?: string,
) {
  if (!env.POSTMARK_API_KEY) throw new Error("POSTMARK_API_KEY is not set");
  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": env.POSTMARK_API_KEY,
    },
    body: JSON.stringify({
      From: `Closette <${env.MAIL_FROM}>`,
      To: to,
      Subject: subject,
      TextBody: text,
      Tag: tag,
      MessageStream: "outbound",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  // Postmark answers errors with { ErrorCode, Message }, 0 meaning success.
  const body = (await res.json().catch(() => ({}))) as {
    ErrorCode?: number;
    Message?: string;
  };
  if (!res.ok || (body.ErrorCode ?? 0) !== 0) {
    throw new Error(
      `Postmark ${res.status}: ${body.Message ?? "send failed"} (${body.ErrorCode ?? "?"})`,
    );
  }
}
