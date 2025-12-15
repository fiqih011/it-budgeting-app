// app/api/actual/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRemaining, ensureEnoughBudget } from "@/lib/budget";

// =======================
// GET — list all actual (realisasi)
// =======================
export async function GET() {
  try {
    const logs = await prisma.usageLog.findMany({
      include: {
        item: {
          include: {
            category: true,
            subcategory: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(logs);
  } catch (err) {
    console.error("GET ACTUAL ERROR:", err);
    return NextResponse.json(
      { message: "Failed to load actual data" },
      { status: 500 }
    );
  }
}

// =======================
// POST — create actual (realisasi)
// =======================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, amount, note } = body;

    // validation
    if (!itemId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "itemId dan amount wajib & amount harus > 0" },
        { status: 400 }
      );
    }

    const item = await prisma.budgetItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Budget item tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek sisa budget cukup
    ensureEnoughBudget(item.remaining, amount);

    const newUsed = item.used + amount;
    const newRemaining = calculateRemaining(item.amount, newUsed);

    // =======================
    // TRANSACTION (WAJIB)
    // =======================
    const result = await prisma.$transaction(async (tx) => {
      const log = await tx.usageLog.create({
        data: {
          itemId,
          amount,
          note,
        },
      });

      await tx.budgetItem.update({
        where: { id: itemId },
        data: {
          used: newUsed,
          remaining: newRemaining,
        },
      });

      return log;
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("CREATE ACTUAL ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// =======================
// DELETE — rollback actual (hapus realisasi)
// =======================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID realisasi wajib" },
        { status: 400 }
      );
    }

    const log = await prisma.usageLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json(
        { message: "Realisasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const item = await prisma.budgetItem.findUnique({
      where: { id: log.itemId },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Budget item tidak ditemukan" },
        { status: 404 }
      );
    }

    const newUsed = item.used - log.amount;
    const newRemaining = calculateRemaining(item.amount, newUsed);

    // =======================
    // TRANSACTION ROLLBACK
    // =======================
    await prisma.$transaction(async (tx) => {
      await tx.usageLog.delete({ where: { id } });

      await tx.budgetItem.update({
        where: { id: item.id },
        data: {
          used: newUsed,
          remaining: newRemaining,
        },
      });
    });

    return NextResponse.json({
      message: "Realisasi dihapus & budget dikembalikan",
    });
  } catch (err: any) {
    console.error("DELETE ACTUAL ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
