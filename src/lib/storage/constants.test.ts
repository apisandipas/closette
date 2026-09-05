import { expect, test } from "vitest";
import { buildImageKey, ownsKey } from "./constants";

test("a user owns keys built for them and nobody else's", () => {
  const key = buildImageKey("u1", "image/webp");
  expect(key).toMatch(/^u\/u1\/[0-9a-f-]{36}\.webp$/);
  expect(ownsKey("u1", key)).toBe(true);
  expect(ownsKey("u10", key)).toBe(false);
  expect(ownsKey("u1", "u/u10/x.webp")).toBe(false);
});
