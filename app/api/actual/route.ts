import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, amount, note } = body;

    if (!itemId || !amount) {
      return NextResponse.json(
        { error: "itemId and amount are required" },
        { status: 400 }
      );
    }

    const item = await prisma.budgetItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // VALIDATION: remaining must be enough
    if (amount > item.remaining) {
      return NextResponse.json(
        {
          error: `Not enough remaining budget. Remaining: ${item.remaining}`,
        },
        { status: 400 }
      );
    }

    // INSERT UsageLog
    await prisma.usageLog.create({
      data: {
        itemId,
        amount,
        note,
      },
    });

    // UPDATE BudgetItem (used + remaining)
    await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        used: item.used + amount,
        remaining: item.remaining - amount,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ACTUAL API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
