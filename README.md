# Closette

A personal wardrobe inventory. Items live in closets, carry a brand and a
type, and can have a photo. There is a masonry dashboard for browsing and an
admin area with searchable, paged tables for managing everything.

## Stack

- [TanStack Start](https://tanstack.com/start) on Vite, with Router, Query,
  Form, and Table
- [Better Auth](https://www.better-auth.com) with email and password
- [Drizzle ORM](https://orm.drizzle.team) on Postgres
- Tailwind v4 and [shadcn](https://ui.shadcn.com) components
- Backblaze B2 through the S3 SDK for item photos
- Vitest, ESLint, and Prettier

## Getting started

Postgres comes from the nix shell, which starts a server under `.direnv/` and
stops it when you leave. Node is provided too.

```sh
direnv allow        # or: nix-shell
cp .env.example .env
```

Fill in `.env`. `BETTER_AUTH_SECRET` can be any long random string, for
example `openssl rand -base64 32`. The `B2_*` keys need a Backblaze bucket;
without them the app will refuse to start because `src/lib/env.ts` validates
every variable at boot.

```sh
npm install
npm run db:migrate
npm run dev         # http://localhost:3000
```

Without nix, `docker compose -f docker-compose.dev.yml up -d` gives you a
Postgres on the same port, and `DATABASE_URL` in `.env` points at it.

## Scripts

| Script                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Vite dev server with SSR                      |
| `npm run build`        | Production build into `.output/`              |
| `npm test`             | Vitest, once                                  |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Prettier, writing changes                     |
| `npm run format:check` | Prettier, failing on unformatted files        |
| `npm run check`        | Lint, format check, and tests, the same as CI |
| `npm run db:generate`  | Write a migration from schema changes         |
| `npm run db:migrate`   | Apply migrations                              |
| `npm run db:studio`    | Drizzle Studio                                |

## Development database

`db/dev_db.sql` is a `pg_dump` of the dev database, minus sessions and
verification tokens, so a checkout on another machine can start with the same
data. The nix shell provides two helpers:

- `db-dump` writes the live database to `db/dev_db.sql`. Nothing runs this
  automatically; run it when you want the file updated.
- `db-restore` loads `db/dev_db.sql` over the live database, replacing it.

On first entry into an empty database the shell restores the dump for you.
After that it leaves the database alone.

## Layout

```
src/
  routes/       file-based routes; thin, delegate to features
  features/     one directory per entity: api (server fns, queries,
                mutations, form, types) and components
  components/   shared UI, shadcn output under ui/
  lib/          auth, db, env, storage, form hook, query client
  test/         vitest setup and the mocked db
```

Every server function takes the user from the session and scopes its query
by `userId`; nothing trusts an id the client sends.

## Tests

Tests cover the server functions in each feature's `api/service.ts`. They run
in node against a chainable mock of the Drizzle client, so no database is
needed. CI runs lint, format check, and tests on every push to `main` and
every pull request.

## License

[MIT](LICENSE)
