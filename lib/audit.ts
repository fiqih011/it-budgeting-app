// lib/audit.ts
import { prisma } from "@/lib/prisma";

export async function writeAuditLog({
  userId,
  action,
  detail,
}: {
  userId?: string;
  action: string;
  detail?: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      detail,
    },
  });
}
