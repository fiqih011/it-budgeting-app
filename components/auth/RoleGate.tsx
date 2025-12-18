"use client";

import { ReactNode } from "react";
import { Role } from "@prisma/client";
import { useRole } from "@/lib/use-role";

type Props = {
  allow: Role[];
  children: ReactNode;
};

export default function RoleGate({ allow, children }: Props) {
  const { role, loading } = useRole();

  if (loading) return null;

  if (!role || !allow.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
