import { expect, test } from "vitest";
import { brandFormOpts } from "./form";
import { brandFormSchema, insertBrandSchema } from "./types";

test("empty default fails the form, a name passes the insert schema", () => {
  expect(brandFormSchema.safeParse(brandFormOpts.defaultValues).success).toBe(
    false,
  );
  expect(insertBrandSchema.safeParse({ name: "Nike" }).success).toBe(true);
});
