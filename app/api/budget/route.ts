// app/api/budget/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BudgetType } from "@prisma/client";

// ============================
// GET — list budget items (support filter)
// ============================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year");
  const type = searchParams.get("type") as BudgetType | null;

  const items = await prisma.budgetItem.findMany({
    where: {
      ...(year ? { year: Number(year) } : {}),
      ...(type ? { type } : {}),
    },
    include: {
      category: true,
      subcategory: true,
    },
    orderBy: [{ year: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

// ============================
// POST — create budget item
// ============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      type,
      year,
      amount,
      categoryId,
      subcategoryId,
      coa,
      assetNumber,
      estimateNextYr = 0,
    } = body;

    // Required base fields
    if (!name || !type || !year || !amount || !categoryId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 400 }
      );
    }

    // Validate subcategory if provided
    if (subcategoryId) {
      const sub = await prisma.subcategory.findUnique({
        where: { id: subcategoryId },
      });
      if (!sub) {
        return NextResponse.json(
          { message: "Subcategory not found" },
          { status: 400 }
        );
      }
    }

    // ======================
    // TYPE RULE VALIDATION
    // ======================
    if (type === "CAPEX") {
      if (!assetNumber) {
        return NextResponse.json(
          { message: "CAPEX requires assetNumber" },
          { status: 400 }
        );
      }

      if (coa) {
        return NextResponse.json(
          { message: "CAPEX cannot have COA" },
          { status: 400 }
        );
      }

      const existing = await prisma.budgetItem.findFirst({
        where: { assetNumber },
      });

      if (existing) {
        return NextResponse.json(
          { message: "Asset number already exists" },
          { status: 400 }
        );
      }
    }

    if (type === "OPEX") {
      if (!coa) {
        return NextResponse.json(
          { message: "OPEX requires COA" },
          { status: 400 }
        );
      }

      if (assetNumber) {
        return NextResponse.json(
          { message: "OPEX cannot have assetNumber" },
          { status: 400 }
        );
      }
    }

    const used = 0;
    const remaining = amount - used;

    const item = await prisma.budgetItem.create({
      data: {
        name,
        type,
        year,
        amount,
        used,
        remaining,
        estimateNextYr,
        categoryId,
        subcategoryId,
        coa: type === "OPEX" ? coa : null,
        assetNumber: type === "CAPEX" ? assetNumber : null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("CREATE BUDGET ITEM ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// ============================
// PUT — update budget item
// ============================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      amount,
      categoryId,
      subcategoryId,
      coa,
      assetNumber,
      estimateNextYr,
    } = body;

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    const prev = await prisma.budgetItem.findUnique({ where: { id } });
    if (!prev) {
      return NextResponse.json(
        { message: "Budget item not found" },
        { status: 404 }
      );
    }

    // Type rules (cannot change type implicitly)
    if (prev.type === "CAPEX") {
      if (coa) {
        return NextResponse.json(
          { message: "CAPEX cannot have COA" },
          { status: 400 }
        );
      }

      if (assetNumber) {
        const dup = await prisma.budgetItem.findFirst({
          where: { assetNumber, NOT: { id } },
        });

        if (dup) {
          return NextResponse.json(
            { message: "Asset number already used" },
            { status: 400 }
          );
        }
      }
    }

    if (prev.type === "OPEX") {
      if (assetNumber) {
        return NextResponse.json(
          { message: "OPEX cannot have assetNumber" },
          { status: 400 }
        );
      }
    }

    const newRemaining =
      amount !== undefined ? amount - prev.used : prev.remaining;

    const updated = await prisma.budgetItem.update({
      where: { id },
      data: {
        name,
        amount,
        remaining: newRemaining,
        categoryId,
        subcategoryId,
        coa,
        assetNumber,
        estimateNextYr,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE BUDGET ITEM ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// ============================
// DELETE — delete budget item
// ============================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    await prisma.usageLog.deleteMany({ where: { itemId: id } });
    await prisma.splitLog.deleteMany({
      where: { OR: [{ fromItemId: id }, { toItemId: id }] },
    });

    await prisma.budgetItem.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE BUDGET ITEM ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
