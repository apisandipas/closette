# Deployment and Lockdown Plan

A plan for putting Closette on Render and restricting it to two people. Nothing
here is implemented — this is the design, the reasoning, and sketches of the
code to write.

Everything marked **verified** was checked against the installed package or the
current source on this branch. Everything marked **confirm** is an assumption
that needs a five-second check before it is trusted.

---

## Part 1 — Deployment to Render

### Why Render

Closette is one SSR Node process plus one Postgres, with no persistent disk
requirement. Photos already live in Backblaze B2 (`src/lib/storage/index.ts`),
so Render's ephemeral filesystem costs us nothing. That shape is Render's
sweet spot: managed Postgres on an internal connection string, build and start
as plain npm scripts, and the whole topology committed as `render.yaml` rather
than click-configured state nobody can reproduce.

The real caveat: free Postgres expires after 30 days and free web services
cold-start after ~15 minutes idle. A cold boot here is slow — SSR bundle plus a
fresh Postgres connection. Budget for the paid starter tiers.

Runners-up, for the record:

- **Fly.io** — better if traffic or geography matters. Costs more attention:
  `fly.toml` plus a Dockerfile, and Postgres is closer to something you run
  than something managed.
- **Railway** — smoothest first deploy of the three, usage-based pricing.
- **VPS + Coolify/Dokku** — cheapest, and you become the ops person.

### Blockers in the repo today

These break any host, not just Render. In rough order of how quickly you hit
them:

#### 1. There is no `start` script

**Verified**: `package.json` has no `start`. Render needs one.

```jsonc
// package.json
"scripts": {
  "start": "node .output/server/index.mjs"
}
```

**Confirm the path before committing this.** The README says the build lands in
`.output/`, but TanStack Start has moved this between versions and the exact
entry file was not verified here:

```sh
npm run build && ls -R .output/server | head
```

Use whatever that prints. Getting this wrong means a service that builds
cleanly and then crash-loops on boot.

#### 2. `drizzle-kit` is a devDependency

**Verified**: it is under `devDependencies`. So migrations must run in the
**build** command, where devDeps are installed and `DATABASE_URL` is available
— not in the start command, where a pruned production install would fail to
resolve `drizzle-kit` at all.

```
buildCommand: npm ci && npm run db:migrate && npm run build
```

Migrating before building is deliberate: a failed migration should fail the
deploy before a new bundle is produced.

#### 3. `dotenv` is imported but not declared

**Verified**: `drizzle.config.ts` line 1 is `import "dotenv/config"`, and
`dotenv` appears in `package-lock.json` only as a transitive dependency (it is
not in `package.json`). It resolves today by luck. Any dependency bump that
drops it breaks `npm run db:migrate` — which, per the above, is now in the
deploy path.

Two options. Preferred, since Render injects env vars directly and nothing in
production needs a `.env` file parsed:

```ts
// drizzle.config.ts — drop line 1 entirely
import { defineConfig } from "drizzle-kit";
```

If local `npm run db:migrate` depends on reading `.env`, declare it instead:
`npm i -D dotenv`. Do one or the other; do not leave it undeclared.

#### 4. `BETTER_AUTH_URL` is still localhost

**Verified**: `.env.example` has `BETTER_AUTH_URL=http://localhost:3000`.

In production this must be the real HTTPS origin. It drives auth callbacks and
secure cookie flags; a mismatch presents as users being randomly logged out
rather than as a clean error.

#### 5. Node version is unpinned

CI uses Node 24 and `shell.nix` pins `nodejs_24`, but nothing tells Render.
Either add `"engines": { "node": "24.x" }` to `package.json` or set
`NODE_VERSION` in the service env.

#### 6. Env validation fails closed at boot

**Verified**: `src/lib/env.ts` validates eight variables through
`@t3-oss/env-core` with `emptyStringAsUndefined: true`. A missing or
empty-string variable is a crash loop on first deploy, not a runtime 500.

This is good behaviour — it just means every variable must be set _before_ the
first deploy, and an accidentally blank value in the Render dashboard behaves
exactly like a missing one.

### Sketch: `render.yaml`

Untested. Check current Render blueprint fields against their docs before
relying on it.

```yaml
services:
  - type: web
    name: closette
    runtime: node
    plan: starter
    region: oregon
    branch: main
    buildCommand: npm ci && npm run db:migrate && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_VERSION
        value: "24"
      - key: DATABASE_URL
        fromDatabase:
          name: closette-db
          property: connectionString
      - key: BETTER_AUTH_URL
        sync: false
      - key: BETTER_AUTH_SECRET
        generateValue: true
      - key: B2_KEY_ID
        sync: false
      - key: B2_APP_KEY
        sync: false
      - key: B2_BUCKET
        sync: false
      - key: B2_ENDPOINT
        sync: false
      - key: B2_REGION
        sync: false

databases:
  - name: closette-db
    plan: basic-256mb
    postgresMajorVersion: "17"
```

Notes on the env vars:

- `sync: false` means "prompt me, don't store it in git". Correct for every
  secret and for the B2 bucket details.
- `generateValue: true` has Render mint `BETTER_AUTH_SECRET` once. This is
  better than pasting your dev secret in — production should never share a
  signing secret with a laptop.
- `healthCheckPath: /` works because `src/routes/index.tsx` is public and
  cheap. It must stay public — pointing the health check at a protected route
  gives you a permanently unhealthy service.
- `postgresMajorVersion` is `17` to match `docker-compose.dev.yml`. Note
  `shell.nix` uses Postgres **16**, so `pg_dump` output from the nix shell is
  not guaranteed to restore into 17. Worth reconciling if you ever restore
  `db/dev_db.sql` into production.

---

## Part 2 — Locking it down

### The thing that matters most

**Moving `/signup` under `_protected` does not lock down signup.**

The route is only UI. Account creation goes through
`authClient.signUp.email()` in `src/components/auth/signup-form.tsx`, which
POSTs to `/api/auth/sign-up/email`, handled by the catch-all in
`src/routes/api/auth/$.ts`. That endpoint does not care where the form lives:

```sh
curl -X POST https://closette.onrender.com/api/auth/sign-up/email \
  -H 'content-type: application/json' \
  -d '{"name":"Rando","email":"rando@example.com","password":"hunter2hunter2"}'
```

**Verified**: `/sign-up/email` is the real endpoint path, registered via
`createAuthEndpoint("/sign-up/email", ...)` in better-auth 1.6.25.

That request creates an account, and because `_protected` gates on _any_ valid
session, that account sees the entire wardrobe.

So: gating the route is still worth doing — it removes the discovery surface
and spares a logged-out visitor a form that will refuse them — but the
enforcement belongs in `src/lib/auth/index.ts`. And the gate cannot simply be
`_protected`; see "The route move and the bootstrap escape conflict" below.

### Good news: the data layer is already correct

**Verified** by counting `createServerFn(` against `ensureSession()` in every
service:

| File                                    | Server fns | Guarded |
| --------------------------------------- | ---------- | ------- |
| `src/features/brands/api/service.ts`    | 5          | 5       |
| `src/features/closets/api/service.ts`   | 5          | 5       |
| `src/features/dashboard/api/service.ts` | 2          | 2       |
| `src/features/items/api/service.ts`     | 7          | 7       |
| `src/features/types/api/service.ts`     | 5          | 5       |

All 24 call `ensureSession()` as their first statement. This is the part most
apps get wrong — server functions are directly callable endpoints, so a
`beforeLoad` guard alone would be decorative. It is not decorative here.

It also means the B2 presign paths are covered: `presignUpload` and
`presignDownload` are only ever reached from inside guarded server functions
(`items/api/service.ts`, `dashboard/api/service.ts`), so an unauthenticated
visitor cannot enumerate photos.

**No changes needed in Part 2 to the data layer.** Everything below is about
the auth surface only.

### Option A — turn signup off entirely

**Verified**: `disableSignUp` is a real `emailAndPassword` option in 1.6.25.

```ts
// src/lib/auth/index.ts
emailAndPassword: {
  enabled: true,
  disableSignUp: true,
},
```

Create the two accounts, then flip it on. Adding a friend later means a config
change and a redeploy.

Honest assessment: for a two-person app this is probably enough, and it has the
great virtue of being impossible to get subtly wrong. Option B exists because
you specifically wanted the invite-a-friend path to not require a deploy.

### Option B — require a session to sign anyone up

This is the rule you actually want: the first account is allowed because none
exists yet, and every account after that has to be created by someone already
signed in. It also makes gating the route _real_ rather than cosmetic — the
form is hidden and the endpoint is closed.

**Verified** in 1.6.25:

- `createAuthMiddleware` and `APIError` are exported from `better-auth/api`.
- `hooks.before` is registered with `matcher: () => true`
  (`dist/api/dispatch.mjs`), so it runs for every path and you branch on
  `ctx.path` yourself.
- `getSessionFromCtx(ctx)` is exported and takes the hook context directly.

```ts
// src/lib/auth/index.ts — sketch, typecheck it
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import {
  createAuthMiddleware,
  APIError,
  getSessionFromCtx,
} from "better-auth/api";
import { count } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

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

  plugins: [tanstackStartCookies()], // must stay last
});
```

Use `getSessionFromCtx(ctx)` rather than `auth.api.getSession(...)`: the hook is
defined inside the `betterAuth({...})` call, so referencing `auth` from within
it is a self-reference into a binding that does not exist yet.

#### Gotchas for Option B

- **The hook also runs on `auth.api.*` calls.** `dist/api/dispatch.mjs`
  documents its runner as canonical for "the HTTP router and `auth.api.*`". So
  a seed script calling `auth.api.signUpEmail()` is subject to the same rule —
  which is fine given the empty-table escape, but do not expect a server-side
  script to bypass it.
- **The `user` table import is correct.** **Verified**:
  `src/lib/db/auth-schema.ts:4` exports `user`, re-exported through
  `src/lib/db/schema.ts`, so `import { user } from "../db/schema"` resolves as
  written.
- **The count query runs on every signup attempt.** Irrelevant at this scale.
- **Test the bootstrap path against a genuinely empty table**, not your dev
  database. The failure mode — deploying a rule nobody can satisfy — only
  shows up on a fresh database, which is exactly what production is.

#### The route move and the bootstrap escape conflict

These two pieces of the plan interact, and the interaction is easy to miss
because they are listed separately below.

If `/signup` moves under `_protected`, the first user cannot reach the form —
`_protected` redirects anyone without a session to `/login`. So the bootstrap
escape in the hook, which exists precisely to let that first account be
created, becomes unreachable through the UI. The endpoint would allow the
signup; the router would never let you see the form that calls it.

Three ways out, in descending order of how much I like them:

1. **Mirror the rule in the route.** The route guard should ask the same
   question the hook does: allow when no users exist, or when signed in. That
   needs a small server function the route can call from `beforeLoad`:

   ```ts
   // src/lib/auth/functions.ts — sketch
   export const isSignupOpen = createServerFn({ method: "GET" }).handler(
     async () => {
       const headers = getRequestHeaders();
       const session = await auth.api.getSession({ headers });
       if (session) return true;

       const [{ value: existing }] = await db
         .select({ value: count() })
         .from(user);
       return existing === 0;
     },
   );
   ```

   Then `/signup` stays a top-level route with its own `beforeLoad` calling
   `isSignupOpen()` and redirecting to `/login` when false — rather than moving
   under `_protected` at all. Note this server function deliberately does _not_
   use `ensureSession()`, since it must be callable with no session.

2. **Leave `/signup` public.** The hook is the real enforcement; an anonymous
   visitor just gets a 403 from the form instead of a redirect. Slightly worse
   UX, zero extra code, and no way to lock yourself out.

3. **Move it under `_protected` and bootstrap out of band** — create the first
   account with a one-off script or by hand against the database, then never
   think about it again. Fine if you would rather not write option 1.

What does **not** work is moving `/signup` under `_protected` and relying on
the hook's empty-table escape to let you in. Those two cancel out.

### Recommendation

Option B, with Option A as the fallback if the hook fights you. Option B is
maybe fifteen lines and it is the difference between "the form is hidden" and
"the endpoint is closed."

For the route, option 1 above — a public `/signup` route with its own
`isSignupOpen` guard. It is the only arrangement where the UI and the endpoint
answer the same question, which is what makes the whole thing legible six
months from now.

### The rest of the hardening

In order of how much each actually matters:

1. **`trustedOrigins`** — **verified** as a real top-level option. Set it to
   the Render URL. Without it you are relying on defaults for CSRF protection
   on the auth endpoints. Included in the sketch above.

2. **`BETTER_AUTH_URL` as the real HTTPS origin** — see Part 1, item 4. Also
   what `trustedOrigins` reads from.

3. **A fresh `BETTER_AUTH_SECRET` for production** — handled by
   `generateValue: true` in `render.yaml`. Never the dev value.

4. **Raise the password floor.** **Verified**: `minPasswordLength` (and
   `maxPasswordLength`) are real options. Two people with a password manager
   have no reason to accept 8 characters. Set `minPasswordLength: 12` and
   change `signupSchema` in `src/components/auth/signup-form.tsx` to match —
   currently `.min(8, "Password must be at least 8 characters")`. Both sides,
   or the client lets through what the server rejects.

5. **Rate limiting — already handled.** **Verified**: better-auth defaults to
   `options.rateLimit?.enabled ?? isProduction`, so it is on in production
   without configuration. Nothing to do. Noted here so nobody "fixes" it twice.

6. **Gate the `/signup` route** — the UX half, so a logged-out visitor gets
   `/login` instead of a form that will refuse them. Do this with an
   `isSignupOpen` guard rather than by moving the route under `_protected`;
   see "The route move and the bootstrap escape conflict" above for why the
   obvious version locks you out of your own first signup.

### Open question, not a security issue

Every service destructures `const { user } = await ensureSession()`. Whether
the queries then _scope rows by user id_ was not audited. If they do, you and
your girlfriend will each see only your own items — which may not be what you
want for a shared closet. This is a product decision, not a vulnerability;
worth answering deliberately before you both start adding items.

---

## Part 3 — Order of work

Deployment and lockdown are independent. Do lockdown first if the app will be
publicly reachable the moment it deploys — which, on Render, it will be.

1. Confirm the build output path; add `start`.
2. Fix the `dotenv` import.
3. Bump `minPasswordLength` to 12 on both client and server.
4. Add the signup hook (Option B) with the empty-table bootstrap.
5. Add `isSignupOpen` and guard `/signup` with it. Do **not** move the route
   under `_protected` — that would block the bootstrap signup in step 8.
6. Add `trustedOrigins`.
7. Commit `render.yaml`; create the Render Postgres; fill the `sync: false`
   vars.
8. Deploy. Create your account — the bootstrap escape permits exactly this
   one. Create hers from inside the app.
9. Verify the lockdown with the `curl` above. **It should now return 403.**
   This is the only test that proves the work; a hidden form proves nothing.
10. `npm run check` before pushing — CI runs typecheck, lint, format, and
    tests, and `docs/` is not in `.prettierignore`, so this file is format-checked too.
