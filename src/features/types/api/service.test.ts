import { describe, expect, it } from "vitest";
import { db } from "@/test/mocks";
import { createType, deleteType, getTypes, updateType } from "./service";
import { randomUUID } from "crypto";

const id = randomUUID();

describe("createType", () => {
  it("saves userId from the session and ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await createType({ data: { name: "Nike", userId: "attacker" } as never });
    expect(db.values).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
  });
});

describe("updateType", () => {
  it("throws when the update matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(updateType({ data: { id, name: "Puma" } })).rejects.toThrow(
      "Type option not updated",
    );
  });

  it("ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await updateType({ data: { id, userId: randomUUID() } as never });
    expect(db.set).not.toHaveBeenCalledWith(
      expect.objectContaining({ userId: expect.anything() }),
    );
  });

  it("rejects an id that is not a uuid", async () => {
    await expect(
      updateType({ data: { id: "b1", name: "Puma" } }),
    ).rejects.toThrow();
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("deleteType", () => {
  it("returns the deleted id", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await expect(deleteType({ data: { id } })).resolves.toEqual({ id });
  });

  it("throws when the delete matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(deleteType({ data: { id } })).rejects.toThrow(
      "Type option not deleted",
    );
  });
});

describe("getTypes", () => {
  it("returns itemCount per row and rounds pageCount up", async () => {
    db.query.itemType.findMany.mockResolvedValueOnce([
      { id, name: "Nike", items: [{ id: "i1" }, { id: "i2" }] },
    ]);
    db.where.mockResolvedValueOnce([{ value: 11 }]);

    const res = await getTypes({ data: { page: 1, limit: 10 } });
    expect(res.types[0]).toMatchObject({ name: "Nike", itemCount: 2 });
    expect(res.types[0]).not.toHaveProperty("items");
    expect(res.pageCount).toBe(2);
  });
});
