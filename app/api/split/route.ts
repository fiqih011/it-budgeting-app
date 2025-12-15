// app/api/split/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSplit } from "@/lib/budget";

// =======================
// GET — list split logs
// =======================
export async function GET() {
  const logs = await prisma.splitLog.findMany({
    include: {
      fromItem: true,
      toItem: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(logs);
}

// =======================
// POST — split budget
// =======================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromItemId, toItemId, amount } = body;

    if (!fromItemId || !toItemId || !amount) {
      return NextResponse.json(
        { message: "fromItemId, toItemId, dan amount wajib" },
        { status: 400 }
      );
    }

    if (fromItemId === toItemId) {
      return NextResponse.json(
        { message: "Tidak bisa split ke item yang sama" },
        { status: 400 }
      );
    }

    const fromItem = await prisma.budgetItem.findUnique({
      where: { id: fromItemId },
    });
    const toItem = await prisma.budgetItem.findUnique({
      where: { id: toItemId },
    });

    if (!fromItem || !toItem) {
      return NextResponse.json(
        { message: "Budget item tidak ditemukan" },
        { status: 404 }
      );
    }

    validateSplit(
      fromItem.remaining,
      amount,
      fromItem.type,
      toItem.type
    );

    // TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      const log = await tx.splitLog.create({
        data: {
          fromItemId,
          toItemId,
          amount,
        },
      });

      await tx.budgetItem.update({
        where: { id: fromItemId },
        data: {
          remaining: fromItem.remaining - amount,
        },
      });

      await tx.budgetItem.update({
        where: { id: toItemId },
        data: {
          remaining: toItem.remaining + amount,
          amount: toItem.amount + amount,
        },
      });

      return log;
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("SPLIT ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
