import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import crypto from "crypto";

// WAJIB: Node runtime
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 🔥 AMBIL USER ID DARI URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = segments[segments.length - 2]; 
    // /api/users/{id}/reset-password

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    // 🔐 Generate password sementara
    const tempPassword = crypto
      .randomBytes(6)
      .toString("base64");

    const hashed = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        forcePasswordChange: true,
      },
    });

    return NextResponse.json({
      success: true,
      temporaryPassword: tempPassword,
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
