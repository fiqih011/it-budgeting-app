import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Agg = {
  category: string;
  amount: number;
  used: number;
  remaining: number;
};

function initAgg(category: string): Agg {
  return { category, amount: 0, used: 0, remaining: 0 };
}

export async function GET() {
  try {
    const year = new Date().getFullYear();

    const items = await prisma.budgetItem.findMany({
      where: { year },
      include: {
        category: true, // category bisa ada; name dijaga null-safe
      },
    });

    const opexMap = new Map<string, Agg>();
    const capexMap = new Map<string, Agg>();

    for (const i of items) {
      const categoryName = i.category?.name ?? "Uncategorized";
      const targetMap = i.type === "OPEX" ? opexMap : capexMap;

      if (!targetMap.has(categoryName)) {
        targetMap.set(categoryName, initAgg(categoryName));
      }

      const agg = targetMap.get(categoryName)!; // aman karena baru diset
      agg.amount += i.amount ?? 0;
      agg.used += i.used ?? 0;
      agg.remaining += i.remaining ?? 0;
    }

    return NextResponse.json({
      year,
      opex: Array.from(opexMap.values()),
      capex: Array.from(capexMap.values()),
    });
  } catch (err: any) {
    console.error("DASHBOARD BREAKDOWN ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Gagal load dashboard breakdown" },
      { status: 500 }
    );
  }
}
