import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BudgetAgg = {
  amount: number;
  used: number;
  remaining: number;
};

function emptyAgg(): BudgetAgg {
  return { amount: 0, used: 0, remaining: 0 };
}

export async function GET() {
  try {
    const year = new Date().getFullYear();

    const items = await prisma.budgetItem.findMany({
      where: { year },
      select: {
        type: true,
        amount: true,
        used: true,
        remaining: true,
      },
    });

    const opex = emptyAgg();
    const capex = emptyAgg();

    for (const i of items) {
      const target = i.type === "OPEX" ? opex : capex;

      target.amount += i.amount ?? 0;
      target.used += i.used ?? 0;
      target.remaining += i.remaining ?? 0;
    }

    const total: BudgetAgg = {
      amount: opex.amount + capex.amount,
      used: opex.used + capex.used,
      remaining: opex.remaining + capex.remaining,
    };

    return NextResponse.json({
      year,
      opex,
      capex,
      total,
    });
  } catch (err: any) {
    console.error("DASHBOARD SUMMARY ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Gagal load dashboard summary" },
      { status: 500 }
    );
  }
}
