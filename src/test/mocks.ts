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
  deleteImage: vi.fn(async () => {}),
};

export const session = { user: { id: "u1" } };
