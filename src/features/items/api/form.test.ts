import { expect, test } from "vitest";
import { itemFormOpts, toItemPayload } from "./form";
import { insertItemSchema } from "./types";

test("form defaults round-trip into the insert schema", () => {
  const payload = toItemPayload({
    ...itemFormOpts.defaultValues!,
    name: "Hat",
  });
  expect(payload).toMatchObject({
    brandId: null,
    typeId: null,
    closetId: null,
    image: null,
  });
  expect(insertItemSchema.safeParse(payload).success).toBe(true);
});

test("insert schema rejects a bad hex color", () => {
  expect(
    insertItemSchema.safeParse({ name: "Hat", color: "red" }).success,
  ).toBe(false);
});
