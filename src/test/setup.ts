import { beforeEach, vi } from "vitest";

vi.mock("@/lib/db", async () => ({ db: (await import("./mocks")).db }));
vi.mock("@/lib/auth", async () => ({ auth: (await import("./mocks")).auth }));
vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeaders: () => new Headers(),
}));
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
        return async (opts: { data?: unknown } = {}) =>
          fn({ data: schema ? schema.parse(opts.data) : opts.data });
      },
    };
    return builder;
  },
}));
