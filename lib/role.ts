// lib/role.ts
export type UserRole = "ADMIN" | "VIEWER";

export function isAdmin(role?: string | null) {
  return role === "ADMIN";
}

export function isViewer(role?: string | null) {
  return role === "VIEWER";
}
