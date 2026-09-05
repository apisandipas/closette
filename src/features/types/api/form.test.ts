import { expect, test } from "vitest";
import { typeFormOpts } from "./form";
import { insertTypeSchema, typeFormSchema } from "./types";

test("empty default fails the form, a name passes the insert schema", () => {
  expect(typeFormSchema.safeParse(typeFormOpts.defaultValues).success).toBe(
    false,
  );
  expect(insertTypeSchema.safeParse({ name: "Shoes" }).success).toBe(true);
});
