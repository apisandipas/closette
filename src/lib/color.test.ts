import { expect, test } from "vitest";
import { hexToFamily } from "./color";

test.each([
  ["#000000", "black"],
  ["#FFFFFF", "white"],
  ["#808080", "grey"],
  ["#6B4226", "brown"],
  ["#F5F5DC", "beige"],
  ["#FF46A2", "pink"],
  ["#1E3A8A", "blue"],
  ["#228B22", "green"],
  ["", null],
  ["red", null],
])("%s → %s", (hex, family) => {
  expect(hexToFamily(hex)).toBe(family);
});
