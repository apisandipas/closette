# Collection — design spec

Settled 2026-08-29 (grilling session). You write the code; this is the shared
understanding to build against. Vocabulary per `CONTEXT.md`.

## The module

One deep module replaces the four cloned read slices. Two pieces:

**The core** — pure of session and HTTP, the test surface:

```ts
// src/lib/collections/create-collection.ts
listCore(userId: string, filters: Filters): Promise<Page<Row>>
// Page = { rows, total, page, limit, pageCount }
```

**The factory** — wraps the core in the framework adapters each feature needs:

```ts
const c = createCollection(config)
c.searchSchema   // zod: { page: 1, limit: 10, search?, sort? } (shared, no more 4 copies)
c.keys           // { all: [name], list: (f) => [name, "list", f] } — singular name, as const
c.queryOptions   // (filters) => queryOptions({ queryKey: keys.list(f), queryFn: serverFn })
c.serverFn       // createServerFn(GET).validator(searchSchema)
                 //   .handler: ensureSession() → listCore(user.id, filters)
c.listCore       // exposed for tests — the seam's interface
```

The server fn is the **production adapter** (session + HTTP); the PGlite test
harness is the **second adapter** — two adapters make the seam real.

## Config shape (one per feature)

```ts
// src/features/types/api/collection.ts  (~15 lines, replaces 3 files)
export const typesCollection = createCollection({
  name: "type",                        // query-key namespace + response identity
  table: itemType,                     // drizzle table; userId + name + createdAt assumed
  with: { items: { columns: { id: true } } },   // relations to load (optional)
  mapRow: ({ items, ...rest }) => ({ ...rest, itemCount: items.length }), // optional
  sorts: {                             // sort map replaces the untyped binary string
    name: asc(itemType.name),
    createdAt: desc(itemType.createdAt),  // default
  },
})
```

Search column: `table.name` by convention (all four use it); make it a config
knob only if an entity ever needs different. Items config: `with: { brand:
true, type: true, closet: true }`, no `mapRow`.

## Decisions locked in

- **Uniform page shape**: `{ rows, total, page, limit, pageCount }` — no more
  per-entity keys (`data.types` → `data.rows`). Listing components/tables take
  a one-line edit each during migration. Keep `total`/`limit` in the shape even
  though nothing consumes them yet (pagination UI will).
- **Query keys standardized** by the factory: singular `name`, `as const`;
  kills the `["items"]`-plural / ad-hoc `['itemFormOptions']` drift.
- **List-only interface.** `getItem` and `getItemFormOptions` stay bespoke in
  items. Designed-for extension: `options()` → all `{ id, name }` rows of a
  collection, added in the writes phase when item forms consume it from three
  collections.
- **Reads only.** Mutations (all currently empty) are designed later, against
  the landed pattern.
- Behavior pinned, not changed: user scoping from session only, `ilike`
  search on name, `offset = (page-1)*limit`, `pageCount = max(1,
  ceil(total/limit))`.

## Test suite

Harness (scaffolded): Vitest + PGlite (`tests/helpers/db.ts`) — real Postgres
in-process via WASM, your `drizzle/` migrations replayed into a throwaway
in-memory database per test file. No server, no nix-shell; runs on both
machines with `npm test`.

Tests to write per collection, through `listCore` only (the interface is the
test surface):

1. scopes rows to the owning user (user B's rows never appear)
2. search: `ilike` on name, case-insensitive, no-match → empty rows + total 0
3. pagination: offset math, last partial page, `pageCount ≥ 1` when total 0
4. count respects the same where as rows (the old types bug, made unwritable)
5. sort map: each key orders correctly; unknown/absent key → default
6. `mapRow` applied (itemCount correct; raw relation rows not leaked)

`tests/collections/types-list.test.ts` starts as a characterization of today's
semantics with raw drizzle queries; port each onto `listCore` as you build it,
then delete the raw versions.

## Migration checklist (strangler — one entity per sitting)

Each step leaves the app working:

1. **types**: write `createCollection` + `types/api/collection.ts`; port the
   characterization tests to `listCore`; point `_list.tsx` route + listing +
   table at `typesCollection` and `data.rows`; delete `types/api/{service,
   queries}.ts` + schema from `types.ts`.
2. **brands**: config file + route/listing/table swap; fix stale "closets"
   strings while there; note missing `<Outlet />` if `/admin/brands/new`
   really doesn't open.
3. **closets**: same.
4. **items**: config with full relations, no `mapRow`; leave `getItem`,
   `getItemFormOptions`, `itemQueryOptions` untouched (they're outside the
   interface).
5. Delete the four `*-listing.tsx` clones' divergences opportunistically —
   they may collapse to one component once all consume `rows`, but that's a
   separate, optional deepening.

## PGlite primer

PGlite is Postgres compiled to WebAssembly, embedded in the Node process the
way SQLite would be — no server, no socket. `new PGlite()` is a fresh
in-memory database; Drizzle talks to it through `drizzle-orm/pglite`, and
`drizzle-orm/pglite/migrator` replays the SQL files in `drizzle/`. To your
code it is just another Drizzle client — which is exactly what makes it the
second adapter at the Collection seam: same interface, different thing
satisfying it.
