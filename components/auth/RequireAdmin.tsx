"use client";

import { useSession } from "next-auth/react";

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
