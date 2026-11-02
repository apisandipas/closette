import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "@/lib/env";
import { sendMail } from "./mail";

vi.mock("@/lib/env", () => ({
  env: { POSTMARK_API_KEY: "token", MAIL_FROM: "noreply@closette.test" },
}));

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => vi.stubGlobal("fetch", fetchMock));
afterEach(() => vi.unstubAllGlobals());

const reply = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status });

describe("sendMail", () => {
  it("posts a text email to Postmark with the server token", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { ErrorCode: 0 }));
    await sendMail("a@example.com", "Hi", "Body");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.postmarkapp.com/email");
    expect(new Headers(init!.headers).get("X-Postmark-Server-Token")).toBe(
      "token",
    );
    expect(JSON.parse(init!.body as string)).toEqual({
      From: "Closette <noreply@closette.test>",
      To: "a@example.com",
      Subject: "Hi",
      TextBody: "Body",
      MessageStream: "outbound",
    });
  });

  it("sends the tag so Postmark groups the message", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { ErrorCode: 0 }));
    await sendMail("a@example.com", "Hi", "Body", "Password Reset");
    const [, init] = fetchMock.mock.calls[0]!;
    expect(JSON.parse(init!.body as string).Tag).toBe("Password Reset");
  });

  it("throws Postmark's message on an error", async () => {
    fetchMock.mockResolvedValueOnce(
      reply(422, { ErrorCode: 400, Message: "Sender not verified" }),
    );
    await expect(sendMail("a@example.com", "Hi", "Body")).rejects.toThrow(
      /Sender not verified/,
    );
  });

  it("throws without a token and sends nothing", async () => {
    const mutable = env as { POSTMARK_API_KEY?: string };
    const saved = mutable.POSTMARK_API_KEY;
    mutable.POSTMARK_API_KEY = undefined;
    await expect(sendMail("a@example.com", "Hi", "Body")).rejects.toThrow(
      /POSTMARK_API_KEY/,
    );
    expect(fetchMock).not.toHaveBeenCalled();
    mutable.POSTMARK_API_KEY = saved;
  });
});
