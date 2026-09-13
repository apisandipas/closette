import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "../db";
import { createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { count } from "drizzle-orm";
import { user } from "../db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      // Bootstrap: the very first account is allowed, because requiring a
      // session to create one would otherwise be unsatisfiable. This escape
      // closes itself the moment that account exists.
      const [{ value: existing }] = await db
        .select({ value: count() })
        .from(user);
      if (existing === 0) return;

      const session = await getSessionFromCtx(ctx);
      if (!session) {
        throw new APIError("FORBIDDEN", {
          message: "Closette is invite-only.",
        });
      }
    }),
  },
  plugins: [tanstackStartCookies()],
});
