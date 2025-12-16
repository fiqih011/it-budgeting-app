import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type MonthRow = {
  month: string;
  opex: number;
  capex: number;
  total: number;
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function emptyMonths(): MonthRow[] {
  return MONTH_LABELS.map((m) => ({
    month: m,
    opex: 0,
    capex: 0,
    total: 0,
  }));
}

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const months = emptyMonths();

    // =========================
    // 1. Ambil UsageLog
    // =========================
    const logs = await prisma.usageLog.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        itemId: true,
        amount: true,
        date: true,
      },
    });

    if (logs.length === 0) {
      return NextResponse.json({ year, months });
    }

    // =========================
    // 2. Ambil BudgetItem terkait
    // =========================
    const itemIds = Array.from(new Set(logs.map((l) => l.itemId)));

    const items = await prisma.budgetItem.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, type: true },
    });

    const itemTypeMap = new Map<string, "OPEX" | "CAPEX">();
    for (const i of items) {
      itemTypeMap.set(i.id, i.type);
    }

    // =========================
    // 3. Agregasi bulanan
    // =========================
    for (const log of logs) {
      if (!log.date) continue;

      const monthIndex = log.date.getUTCMonth();
      if (monthIndex < 0 || monthIndex > 11) continue;

      const amount = log.amount ?? 0;
      const type = itemTypeMap.get(log.itemId);

      if (type === "OPEX") {
        months[monthIndex].opex += amount;
      } else if (type === "CAPEX") {
        months[monthIndex].capex += amount;
      }

      months[monthIndex].total += amount;
    }

    return NextResponse.json({
      year,
      months,
    });
  } catch (err: any) {
    console.error("DASHBOARD MONTHLY TREND ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Gagal load monthly trend" },
      { status: 500 }
    );
  }
}
