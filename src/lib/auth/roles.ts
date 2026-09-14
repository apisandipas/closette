// Shared by server and client; keep it free of server imports.
export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];
