import { describe, expect, it } from "vitest";
import { db, storage } from "@/test/mocks";
import { createItem, deleteItem, updateItem } from "./service";
import { randomUUID } from "crypto";
const id = randomUUID();
const base = { name: "Hat", color: "#FF46A2" };

describe("createItem", () => {
  it("rejects an image key under another user's prefix before touching storage", async () => {
    await expect(
      createItem({ data: { ...base, image: "u/someone-else/x.webp" } }),
    ).rejects.toThrow("Invalid image");
    expect(storage.verifyUpload).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects a key that does not point at a real, sane object", async () => {
    storage.verifyUpload.mockResolvedValueOnce(null);
    await expect(
      createItem({ data: { ...base, image: "u/u1/x.webp" } }),
    ).rejects.toThrow("Invalid image");
  });

  it("saves userId from the session and ignores userId in the request", async () => {
    db.returning.mockResolvedValueOnce([{ id }]);
    await createItem({ data: { ...base, userId: "attacker" } as never });
    expect(db.values).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1" }),
    );
  });

  it("rejects a closet the user does not own", async () => {
    db.query.closet.findFirst.mockResolvedValueOnce(undefined);
    await expect(
      createItem({ data: { ...base, closetId: randomUUID() } }),
    ).rejects.toThrow("Closet not found");
  });
});

describe("updateItem", () => {
  it("deletes the old image when it is replaced", async () => {
    storage.verifyUpload.mockResolvedValueOnce({ size: 1, type: "image/webp" });
    db.query.item.findFirst.mockResolvedValueOnce({ image: "u/u1/old.webp" });
    db.returning.mockResolvedValueOnce([{ id, image: "u/u1/new.webp" }]);

    await updateItem({ data: { id, color: "", image: "u/u1/new.webp" } });
    expect(storage.verifyUpload).toHaveBeenCalledWith("u/u1/new.webp");
    expect(storage.deleteImage).toHaveBeenCalledWith("u/u1/old.webp");
  });

  it("leaves the image alone when it is unchanged", async () => {
    db.query.item.findFirst.mockResolvedValueOnce({ image: "u/u1/same.webp" });
    db.returning.mockResolvedValueOnce([{ id, image: "u/u1/same.webp" }]);

    await updateItem({ data: { id, name: "Cap", color: "" } });
    expect(storage.deleteImage).not.toHaveBeenCalled();
  });

  it("throws when the row belongs to someone else", async () => {
    db.query.item.findFirst.mockResolvedValueOnce(undefined);
    db.returning.mockResolvedValueOnce([]);
    await expect(updateItem({ data: { id, color: "" } })).rejects.toThrow(
      "Item not found",
    );
  });
});

describe("deleteItem", () => {
  it("removes the image and survives a failed cleanup", async () => {
    db.returning.mockResolvedValueOnce([{ id, image: "u/u1/x.webp" }]);
    storage.deleteImage.mockRejectedValueOnce(new Error("b2 down"));
    await expect(deleteItem({ data: { id } })).resolves.toEqual({
      id,
    });
  });
});
