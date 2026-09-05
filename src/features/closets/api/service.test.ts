import { describe, expect, it } from "vitest";
import { db } from "@/test/mocks";
import {
  createCloset,
  deleteCloset,
  getClosets,
  updateCloset,
} from "./service";
import { randomUUID } from "crypto";

const id = randomUUID();

describe("createCloset", () => {
  it("saves userId from the session and ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await createCloset({ data: { name: "Nike", userId: "attacker" } as never });
    expect(db.values).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
  });
});

describe("updateCloset", () => {
  it("throws when the update matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(updateCloset({ data: { id, name: "Puma" } })).rejects.toThrow(
      "Closet not found",
    );
  });

  it("ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await updateCloset({ data: { id, userId: randomUUID() } as never });
    expect(db.set).not.toHaveBeenCalledWith(
      expect.objectContaining({ userId: expect.anything() }),
    );
  });

  it("rejects an id that is not a uuid", async () => {
    await expect(
      updateCloset({ data: { id: "b1", name: "Puma" } }),
    ).rejects.toThrow();
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("deleteCloset", () => {
  it("returns the deleted id", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await expect(deleteCloset({ data: { id } })).resolves.toEqual({ id });
  });

  it("throws when the delete matched no row", async () => {
    db.returning.mockResolvedValueOnce([]);
    await expect(deleteCloset({ data: { id } })).rejects.toThrow(
      "Closet not found",
    );
  });
});

describe("getClosets", () => {
  it("returns itemCount per row and rounds pageCount up", async () => {
    db.query.closet.findMany.mockResolvedValueOnce([
      { id, name: "Nike", items: [{ id: "i1" }, { id: "i2" }] },
    ]);
    db.where.mockResolvedValueOnce([{ value: 11 }]);

    const res = await getClosets({ data: { page: 1, limit: 10 } });
    expect(res.closets[0]).toMatchObject({ name: "Nike", itemCount: 2 });
    expect(res.closets[0]).not.toHaveProperty("items");
    expect(res.pageCount).toBe(2);
  });
});
