import { expect, test } from "vitest";
import { makeKeys, searchFiltersSchema } from "./index";

test("search filters coerce page and limit from strings and default them", () => {
  expect(searchFiltersSchema.parse({})).toEqual({ page: 1, limit: 10 });
  expect(searchFiltersSchema.parse({ page: "3", limit: "25" })).toMatchObject({
    page: 3,
    limit: 25,
  });
});

test("query keys nest list under all and detail under details", () => {
  const keys = makeKeys("brands");
  expect(keys.list({ page: 2, limit: 10 })).toEqual([
    "brands",
    "list",
    { page: 2, limit: 10 },
  ]);
  expect(keys.detail("x")).toEqual(["brands", "details", "x"]);
});
