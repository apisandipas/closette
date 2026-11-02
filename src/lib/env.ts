import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
    B2_KEY_ID: z.string(),
    B2_APP_KEY: z.string(),
    B2_BUCKET: z.string(),
    B2_ENDPOINT: z.url(),
    B2_REGION: z.string(),
    // Optional so the app boots without Postmark; sendMail throws when it
    // is missing.
    POSTMARK_API_KEY: z.string().optional(),
    // Must be a sender signature (or on a domain) verified in Postmark.
    MAIL_FROM: z.email().default("noreply@closette.test"),
  },
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: { ...process.env, ...import.meta.env },
  emptyStringAsUndefined: true,
});
