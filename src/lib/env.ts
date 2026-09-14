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
    MAILTRAP_TOKEN: z.string(),
    MAILTRAP_FROM: z.email().default("noreply@closette.test"),
    MAILTRAP_USE_SANDBOX: z.stringbool().default(false),
    MAILTRAP_INBOX_ID: z.coerce.number().optional(), // sandbox only
  },
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: { ...process.env, ...import.meta.env },
  emptyStringAsUndefined: true,
});
