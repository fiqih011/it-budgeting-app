"use client";

import { ReactNode } from "react";
import { useRole } from "@/lib/use-role";

type Props = {
  allow: ("ADMIN" | "VIEWER")[];
  children: ReactNode;
};

export default function RoleGate({ allow, children }: Props) {
  const { role, loading } = useRole();

  if (loading) {
    return <div className="text-gray-400">Checking permission...</div>;
  }

  if (!role || !allow.includes(role as any)) {
    return null;
  }

  return <>{children}</>;
}
