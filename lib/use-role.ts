"use client";

import { useSession } from "next-auth/react";

export function useRole() {
  const { data: session, status } = useSession();

  const role =
    typeof session?.user?.role === "string"
      ? session.user.role
      : null;

  return {
    role,
    isAdmin: role === "ADMIN",
    isViewer: role === "VIEWER",
    loading: status === "loading",
  };
}
