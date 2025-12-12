import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { fromItemId, toItemId, amount } = await req.json();

    if (!fromItemId || !toItemId || !amount) {
      return NextResponse.json(
        { error: "fromItemId, toItemId and amount are required" },
        { status: 400 }
      );
    }

    if (fromItemId === toItemId) {
      return NextResponse.json(
        { error: "Cannot split into the same item" },
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
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // VALIDATION: type must match
    if (fromItem.type !== toItem.type) {
      return NextResponse.json(
        { error: "OPEX ↔ CAPEX split is not allowed" },
        { status: 400 }
      );
    }

    // VALIDATION: remaining must be enough
    if (amount > fromItem.remaining) {
      return NextResponse.json(
        { error: `Not enough remaining in source item. Remaining: ${fromItem.remaining}` },
        { status: 400 }
      );
    }

    // INSERT split log
    await prisma.splitLog.create({
      data: {
        fromItemId,
        toItemId,
        amount,
      },
    });

    // UPDATE BOTH ITEMS
    await prisma.budgetItem.update({
      where: { id: fromItemId },
      data: {
        remaining: fromItem.remaining - amount,
      },
    });

    await prisma.budgetItem.update({
      where: { id: toItemId },
      data: {
        remaining: toItem.remaining + amount,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SPLIT API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
