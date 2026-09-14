import { describe, expect, it } from "vitest";
import { auth } from "@/test/mocks";
import { createUser, getUsers, sendPasswordReset, updateUser } from "./service";

const base = { name: "A", email: "a@example.com", role: "user" as const };

describe("getUsers", () => {
  it("maps page to offset, search to email, and rounds pageCount up", async () => {
    auth.api.listUsers.mockResolvedValueOnce({ users: [], total: 11 });
    const res = await getUsers({ data: { page: 2, limit: 10, search: "a@" } });
    expect(auth.api.listUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          limit: 10,
          offset: 10,
          searchField: "email",
          searchValue: "a@",
        }),
      }),
    );
    expect(res.pageCount).toBe(2);
  });
});

describe("createUser", () => {
  it("rejects a short password", async () => {
    await expect(
      createUser({ data: { ...base, password: "short" } }),
    ).rejects.toThrow();
    expect(auth.api.createUser).not.toHaveBeenCalled();
  });

  it("rejects an unknown role", async () => {
    await expect(
      createUser({
        // @ts-expect-error role is an enum
        data: { ...base, role: "root", password: "long-enough-pw" },
      }),
    ).rejects.toThrow();
  });
});

describe("updateUser", () => {
  it("keeps the password when blank", async () => {
    await updateUser({ data: { id: "u2", ...base, password: "" } });
    expect(auth.api.adminUpdateUser).toHaveBeenCalledWith(
      expect.objectContaining({ body: { userId: "u2", data: base } }),
    );
    expect(auth.api.setUserPassword).not.toHaveBeenCalled();
  });

  it("sets the password when given", async () => {
    await updateUser({
      data: { id: "u2", ...base, password: "long-enough-pw" },
    });
    expect(auth.api.setUserPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { userId: "u2", newPassword: "long-enough-pw" },
      }),
    );
  });
});

describe("sendPasswordReset", () => {
  it("asks Better Auth for a reset token", async () => {
    expect(await sendPasswordReset({ data: { email: base.email } })).toEqual({
      email: base.email,
    });
    expect(auth.api.requestPasswordReset).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { email: base.email, redirectTo: "/reset-password" },
      }),
    );
  });
});
