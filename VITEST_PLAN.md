# Vitest plan

Three tiers, highest payoff first. Do tier 2 first because it needs no mocks
and proves the config.

## Payoff ranking

1. **Server function handlers** in `src/features/*/api/service.ts`, with db,
   storage, and session mocked. A bug here means one user reads another's
   rows, a client-chosen S3 key gets trusted, or an old image never gets
   deleted. Nothing else in the repo has consequences like that.
2. **Pure schema and helper code**, no mocks: `ownsKey`, `buildImageKey`,
   `toItemPayload`, the zod schemas. The form-to-server contract is the thing
   most likely to drift as fields get added.
3. **Components.** Skip for now. The forms are shadcn plus TanStack Form
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

`src/test/setup.ts`. Replaces `createServerFn` with a builder that runs the
validator and returns the handler as a plain function:

```ts
import { vi } from "vitest";

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

## Step 3: server fn handlers (about 1 hour for items)

Then copy the shape to brands, closets, and types.

`src/features/items/api/service.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const { db, storage } = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const m of ["insert", "values", "update", "set", "delete", "where"]) {
    chain[m] = vi.fn(() => chain);
  }
  chain.returning = vi.fn();
  return {
    db: {
      ...chain,
      query: {
        closet: { findFirst: vi.fn() },
        item: { findFirst: vi.fn() },
      },
    },
    storage: {
      verifyUpload: vi.fn(),
      deleteImage: vi.fn(),
      presignUpload: vi.fn(),
      presignDownload: vi.fn(),
    },
  };
});

vi.mock("@/lib/db", () => ({ db }));
vi.mock("@/lib/storage", () => storage);
vi.mock("@/lib/auth/functions", () => ({
  ensureSession: vi.fn(async () => ({ user: { id: "u1" } })),
}));

import { createItem, deleteItem, updateItem } from "./service";

const base = { name: "Hat", color: "#FF46A2" };

beforeEach(() => vi.clearAllMocks());

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
