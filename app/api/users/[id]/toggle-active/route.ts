import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

type Params = {
  params: { id: string };
};

/**
 * PATCH — Toggle active user (ADMIN ONLY)
 */
export async function PATCH(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetUserId = params.id;

  // ❌ Admin tidak boleh disable dirinya sendiri
  if (session.user.id === targetUserId) {
    return NextResponse.json(
      { error: "Cannot disable your own account" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { active: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { active: !user.active },
    select: {
      id: true,
      active: true,
    },
  });

  return NextResponse.json(updated);
}
