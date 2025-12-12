import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const items = await prisma.budgetItem.findMany({
      where: { year },
      include: { category: true },
    });

    const totalBudget = items.reduce((sum, x) => sum + x.amount, 0);
    const totalUsed = items.reduce((sum, x) => sum + x.used, 0);
    const totalRemaining = items.reduce((sum, x) => sum + x.remaining, 0);

    const opexBudget = items
      .filter((x) => x.type === "OPEX")
      .reduce((s, x) => s + x.amount, 0);

    const capexBudget = items
      .filter((x) => x.type === "CAPEX")
      .reduce((s, x) => s + x.amount, 0);

    const categoryBreakdown: Record<string, number> = {};
    items.forEach((item) => {
      const cname = item.category?.name || "Uncategorized";
      categoryBreakdown[cname] = (categoryBreakdown[cname] || 0) + item.amount;
    });

    return NextResponse.json({
      year,
      totals: {
        totalBudget,
        totalUsed,
        totalRemaining,
        opexBudget,
        capexBudget,
      },
      categoryBreakdown,
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
