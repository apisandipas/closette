import { expect, test } from "vitest";
import { closetFormOpts } from "./form";
import { closetFormSchema, insertClosetSchema } from "./types";

test("empty default fails the form, a name passes the insert schema", () => {
  expect(closetFormSchema.safeParse(closetFormOpts.defaultValues).success).toBe(
    false,
  );
  expect(insertClosetSchema.safeParse({ name: "Kaylyn's" }).success).toBe(true);
});
