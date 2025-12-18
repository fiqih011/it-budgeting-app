"use client";

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export function useRole() {
  const { data: session, status } = useSession();

  // ⏳ Loading
  if (status === "loading") {
    return {
      role: null,
      active: false,
      loading: true,
      isGuest: false,
    };
  }

  // 👁️ Guest (no login)
  if (!session?.user) {
    return {
      role: Role.VIEWER,
      active: true,
      loading: false,
      isGuest: true,
    };
  }

  return {
    role: session.user.role,
    active: session.user.active,
    loading: false,
    isGuest: false,
  };
}
