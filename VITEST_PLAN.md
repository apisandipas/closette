# Vitest plan

Three steps, in the order to do them. Step 2 pays off less than step 3 but
comes first because it needs no mocks and proves the config.

## What to test, and why

- **Server function handlers** in `src/features/*/api/service.ts` (step 3).
  Highest payoff. A bug here means one user reads another's rows, a
  client-chosen S3 key gets trusted, or an old image never gets deleted.
- **Pure schema and helper code** (step 2): `ownsKey`, `buildImageKey`,
  `toItemPayload`, the zod schemas. Cheap, no mocks. The form-to-server
  contract is the thing most likely to drift as fields get added.
- **Components.** Skip for now. The forms are shadcn plus TanStack Form
  wiring with no logic of their own. Testing them means jsdom,
  testing-library, and mocking react-query and `useServerFn` for little
  return. `resizeToWebp` needs a real canvas, so it is out too.

## Mock vs real

| Mock | Real |
|---|---|
| `@/lib/db` (Postgres) | zod schemas, drizzle table defs |
| `@/lib/storage` (B2 over the network) | handler logic: ownership checks, image cleanup |
| `@/lib/auth/functions` (`ensureSession`) | `ownsKey`, `buildImageKey`, `toItemPayload`, `makeKeys` |
| `createServerFn` from `@tanstack/react-start` | |

`createServerFn` needs the Start compiler. Without it, calling a server fn in
a test tries to `fetch`. The setup file below swaps it for a plain builder.

`@/lib/env` never loads because both modules that import it are mocked. If a
test throws at import from `createEnv`, the mock is at the wrong seam.

## Step 1: setup (about 10 minutes)

```sh
npm i -D vitest
```

Add `"test": "vitest run"` to `package.json` scripts.

`vitest.config.ts`, kept separate from `vite.config.ts` so the
`tanstackStart()` plugin stays out of the test run:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

`src/test/mocks.ts`. One db, storage, and session mock shared by every
service test. All four features hit the same drizzle surface:

```ts
import { vi } from "vitest";

// One drizzle-ish chain: db.insert(t).values(v).returning(), and so on.
// Every link returns the chain. `returning` is the leaf you give a value to.
// Keys are spelled out, not looped: TS drops a Record's index signature when
// it is spread, which would leave `db` typed as `{ query }` only. The
// `: unknown` return type stops TS seeing `chain` inside its own initializer.
const link = () => vi.fn((): unknown => chain);
const chain = {
  insert: link(),
  values: link(),
  update: link(),
  set: link(),
  delete: link(),
  where: link(),
  select: link(),
  from: link(),
  returning: vi.fn(),
};

const table = () => ({ findFirst: vi.fn(), findMany: vi.fn() });

export const db = {
  ...chain,
  query: { brand: table(), closet: table(), item: table(), itemType: table() },
};

export const storage = {
  presignUpload: vi.fn(),
  presignDownload: vi.fn(),
  verifyUpload: vi.fn(),
  deleteImage: vi.fn(),
};

export const session = { user: { id: "u1" } };
```

`src/test/setup.ts`. Wires the mocks in for every test file, and replaces
`createServerFn` with a builder that runs the validator and returns the
handler as a plain function. The factories use `await import` so they never
touch a variable before it exists (vi.mock is hoisted):

```ts
import { beforeEach, vi } from "vitest";

vi.mock("@/lib/db", async () => ({ db: (await import("./mocks")).db }));
vi.mock("@/lib/storage", async () => (await import("./mocks")).storage);
vi.mock("@/lib/auth/functions", async () => {
  const { session } = await import("./mocks");
  return { ensureSession: vi.fn(async () => session) };
});

beforeEach(() => vi.clearAllMocks());

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let schema: { parse: (d: unknown) => unknown } | undefined;
    const builder = {
      validator(s: typeof schema) {
        schema = s;
        return builder;
      },
      handler(fn: (ctx: { data: unknown }) => unknown) {
        return (opts: { data?: unknown } = {}) =>
          fn({ data: schema ? schema.parse(opts.data) : opts.data });
      },
    };
    return builder;
  },
}));
```

Check on first run: `resolve.tsconfigPaths` is a Vite 8 option. If Vitest
ignores it, use
`resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } }`.

## Step 2: pure tests (about 15 minutes)

`src/lib/storage/constants.test.ts`:

```ts
import { expect, test } from "vitest";
import { buildImageKey, ownsKey } from "./constants";

test("a user owns keys built for them and nobody else's", () => {
  const key = buildImageKey("u1", "image/webp");
  expect(key).toMatch(/^u\/u1\/[0-9a-f-]{36}\.webp$/);
  expect(ownsKey("u1", key)).toBe(true);
  expect(ownsKey("u10", key)).toBe(false);
  expect(ownsKey("u1", "u/u10/x.webp")).toBe(false);
});
```

`src/features/items/api/form.test.ts`, the form-to-server contract:

```ts
import { expect, test } from "vitest";
import { itemFormOpts, toItemPayload } from "./form";
import { insertItemSchema } from "./types";

test("form defaults round-trip into the insert schema", () => {
  const payload = toItemPayload({ ...itemFormOpts.defaultValues!, name: "Hat" });
  expect(payload).toMatchObject({ brandId: null, typeId: null, closetId: null, image: null });
  expect(insertItemSchema.safeParse(payload).success).toBe(true);
});

test("insert schema rejects a bad hex color", () => {
  expect(insertItemSchema.safeParse({ name: "Hat", color: "red" }).success).toBe(false);
});
```

Run: `npx vitest run src/lib/storage`. No mocks, so it proves the config.

## Step 3: server fn handlers (about 1 hour for items, then copy to brands, closets, types)

`src/features/items/api/service.test.ts`:

The mocks come from `src/test/mocks.ts`; the setup file already wired them
in and clears them between tests. A brands or closets test starts the same
way and only swaps the service imports.

```ts
import { describe, expect, it } from "vitest";
import { db, storage } from "@/test/mocks";
import { createItem, deleteItem, updateItem } from "./service";

const base = { name: "Hat", color: "#FF46A2" };

describe("createItem", () => {
  it("rejects an image key under another user's prefix before touching storage", async () => {
    await expect(
      createItem({ data: { ...base, image: "u/someone-else/x.webp" } }),
    ).rejects.toThrow("Invalid image");
    expect(storage.verifyUpload).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects a key that does not point at a real, sane object", async () => {
    storage.verifyUpload.mockResolvedValueOnce(null);
    await expect(
      createItem({ data: { ...base, image: "u/u1/x.webp" } }),
    ).rejects.toThrow("Invalid image");
  });

  it("stamps the session user, not anything the client sent", async () => {
    db.returning.mockResolvedValueOnce([{ id: "i1" }]);
    await createItem({ data: { ...base, userId: "attacker" } as never });
    expect(db.values).toHaveBeenCalledWith(expect.objectContaining({ userId: "u1" }));
  });

  it("rejects a closet the user does not own", async () => {
    db.query.closet.findFirst.mockResolvedValueOnce(undefined);
    await expect(
      createItem({ data: { ...base, closetId: "c9" } }),
    ).rejects.toThrow("Closet not found");
  });
});

describe("updateItem", () => {
  it("deletes the old image when it is replaced", async () => {
    storage.verifyUpload.mockResolvedValueOnce({ size: 1, type: "image/webp" });
    db.query.item.findFirst.mockResolvedValueOnce({ image: "u/u1/old.webp" });
    db.returning.mockResolvedValueOnce([{ id: "i1", image: "u/u1/new.webp" }]);

    await updateItem({ data: { id: "i1", color: "", image: "u/u1/new.webp" } });
    expect(storage.deleteImage).toHaveBeenCalledWith("u/u1/old.webp");
  });

  it("leaves the image alone when it is unchanged", async () => {
    db.query.item.findFirst.mockResolvedValueOnce({ image: "u/u1/same.webp" });
    db.returning.mockResolvedValueOnce([{ id: "i1", image: "u/u1/same.webp" }]);

    await updateItem({ data: { id: "i1", name: "Cap", color: "" } });
    expect(storage.deleteImage).not.toHaveBeenCalled();
  });

  it("throws when the row belongs to someone else", async () => {
    db.query.item.findFirst.mockResolvedValueOnce(undefined);
    db.returning.mockResolvedValueOnce([]);
    await expect(
      updateItem({ data: { id: "i1", color: "" } }),
    ).rejects.toThrow("Item not found");
  });
});

describe("deleteItem", () => {
  it("removes the image and survives a failed cleanup", async () => {
    db.returning.mockResolvedValueOnce([{ id: "i1", image: "u/u1/x.webp" }]);
    storage.deleteImage.mockRejectedValueOnce(new Error("b2 down"));
    await expect(deleteItem({ data: { id: "i1" } })).resolves.toEqual({ id: "i1" });
  });
});
```

Note: `db.query.closet.findFirst` returns `undefined` by default, so any test
that passes a `closetId` and expects success needs
`mockResolvedValueOnce({ id })` to get past the ownership check.

## Later

- `brand.name` and `itemType.name` are `.unique()` across the whole table,
  not per user. Two users cannot both have a brand called "Nike". A test
  against real Postgres (the `docker-compose.dev.yml` db) would catch this;
  a mocked one cannot. Decide whether that is intended before adding a
  tier for real-db tests.

## Step 4: brands, closets, types (about 20 minutes for all three)

These three have no storage and no cross-table check, so each service test
is four cases. Write brands, then copy with the table below.

| brands | closets | types |
|---|---|---|
| `createBrand` `updateBrand` `deleteBrand` `getBrands` | `createCloset` `updateCloset` `deleteCloset` `getClosets` | `createType` `updateType` `deleteType` `getTypes` |
| `db.query.brand` | `db.query.closet` | `db.query.itemType` |
| `.brands` in list result | `.closets` | `.types` |
| "Brand not updated" / "Brand not found" | "Closet not found" / "Item not found" | "Type option not updated" / "Type option not deleted" |

Two of these tests fail today, on purpose. Fix the code, not the test:

- **`updateX` accepts `userId`.** `createUpdateSchema(table).partial()` keeps
  `userId`, `createdAt`, `updatedAt` as optional fields, so a client can hand
  its own row to another user. Items is safe because `updateItemSchema`
  builds on `insertItemSchema`, which omits them. Fix: `.omit({ userId: true,
  createdAt: true, updatedAt: true })` on all three update schemas.
  `updateType` also passes `id` into `.set()`; harmless, but the omit makes
  the `set` assertion cleaner.
- **`deleteType` returns `{ id: deleted }`,** the whole row, not the id.

The form tests for these three are one line of value each: the empty
default fails `xFormSchema`, a name passes `insertXSchema`. Skip them until
a form grows a `toPayload` like items has.

## Ideas, not yet scheduled

- **`describe.each` across the three flat features.** Brands, closets, and
  types are the same four handlers with names swapped. One
  `src/features/crud.test.ts` taking `{ create, update, del, list, table,
  key }` per row would replace three files. Only worth it once the three
  files exist and are visibly identical; a shared test that has to special
  case one feature is worse than three plain ones.
- **Response shape drift.** `updateBrand` returns the bare row; every other
  update returns `{ brand }`, `{ closet }`, `{ type }`, `{ item }`.
  `getCloset` returns `{ closet: undefined }` where `getBrand` throws. A
  test per handler asserting the shape pins this down. Decide the shape
  first, then test it.
- **Error message typos.** `getType` says "now found", `deleteCloset` says
  "Item not found". Tests that match on message will surface these as they
  get written.
- **`searchFiltersSchema` and `makeKeys`** in `src/features/common`. Pure,
  no mocks. Worth two tests: `page`/`limit` coerce from strings and default,
  `sort` beyond `"name"` falls through to `createdAt`. Cheap insurance for
  the URL search param path.
- **`getX` list handlers.** The count query is `db.select().from().where()`,
  so in tests `db.where.mockResolvedValueOnce([{ value: n }])` feeds the
  total. One test per feature that a row with two items comes back with
  `itemCount: 2` and `pageCount` rounds up.
- **Mock defaults.** Done for `deleteImage`. `storage.deleteImage` is `vi.fn(async () => {})`
  so the service's `.catch` has a promise to hang off. Same for
  `presignDownload` once `getItems` gets a test. `vi.clearAllMocks` keeps
  these defaults; `mockReset` would not.
- **Coverage.** `npx vitest run --coverage` needs `@vitest/coverage-v8`.
  Add it only when someone asks what is untested; the answer today is
  "components and `getX` handlers", no tool needed.

## Done on 2026-09-05

Step 4 landed for brands, closets, types, plus `src/features/common/index.test.ts`.
37 tests, 10 files, `tsc` clean. Fixed on the way: all four update schemas now
omit `userId`/`createdAt`/`updatedAt` and take a uuid id, delete validators
take a uuid, `deleteType` returns `deleted.id`, `deleteCloset` and `getType`
messages corrected. The `createServerFn` shim in `src/test/setup.ts` returns
an async function so validator errors reject instead of throwing.
