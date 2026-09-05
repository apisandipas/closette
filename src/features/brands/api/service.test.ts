import { describe, expect, it } from "vitest";
import { db } from "@/test/mocks";
import { createBrand, deleteBrand, getBrands, updateBrand } from "./service";
import { randomUUID } from "crypto";

const id = randomUUID();

describe("createBrand", () => {
  it("saves userId from the session and ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await createBrand({ data: { name: "Nike", userId: "attacker" } as never });
    expect(db.values).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
  });
});

describe("updateBrand", () => {
  it("throws when the update matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(updateBrand({ data: { id, name: "Puma" } })).rejects.toThrow(
      "Brand not updated",
    );
  });

  it("ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await updateBrand({ data: { id, userId: randomUUID() } as never });
    expect(db.set).not.toHaveBeenCalledWith(
      expect.objectContaining({ userId: expect.anything() }),
    );
  });

  it("rejects an id that is not a uuid", async () => {
    await expect(
      updateBrand({ data: { id: "b1", name: "Puma" } }),
    ).rejects.toThrow();
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("deleteBrand", () => {
  it("returns the deleted id", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await expect(deleteBrand({ data: { id } })).resolves.toEqual({ id });
  });

  it("throws when the delete matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(deleteBrand({ data: { id } })).rejects.toThrow(
      "Brand not found",
    );
  });
});

describe("getBrands", () => {
  it("returns itemCount per row and rounds pageCount up", async () => {
    db.query.brand.findMany.mockResolvedValueOnce([
      { id, name: "Nike", items: [{ id: "i1" }, { id: "i2" }] },
    ]);
    db.where.mockResolvedValueOnce([{ value: 11 }]);

    const res = await getBrands({ data: { page: 1, limit: 10 } });
    expect(res.brands[0]).toMatchObject({ name: "Nike", itemCount: 2 });
    expect(res.brands[0]).not.toHaveProperty("items");
    expect(res.pageCount).toBe(2);
  });
});
