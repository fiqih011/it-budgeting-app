import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ============================
// GET — all budget items
// ============================
export async function GET() {
  const items = await prisma.budgetItem.findMany({
    include: { category: true, subcategory: true },
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
    } = body;

    // required fields
    if (!name || !type || !year || !amount || !categoryId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 400 }
      );
    }

    // Subcategory validation if provided
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

    // CAPEX: assetNumber MUST be unique
    if (type === "CAPEX") {
      if (!assetNumber) {
        return NextResponse.json(
          { message: "CAPEX requires an assetNumber" },
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

    // OPEX → COA allowed duplicate, so no validation needed

    // Remaining budget = amount (since used = 0)
    const item = await prisma.budgetItem.create({
      data: {
        name,
        type,
        year,
        amount,
        used: 0,
        remaining: amount,
        categoryId,
        subcategoryId,
        coa,
        assetNumber,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
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
    } = body;

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    // Load existing item
    const prev = await prisma.budgetItem.findUnique({ where: { id } });
    if (!prev) {
      return NextResponse.json(
        { message: "Budget item not found" },
        { status: 404 }
      );
    }

    // Type cannot be changed
    if (assetNumber && prev.type !== "CAPEX") {
      return NextResponse.json(
        { message: "Cannot assign assetNumber to an OPEX item" },
        { status: 400 }
      );
    }

    if (coa && prev.type !== "OPEX") {
      return NextResponse.json(
        { message: "Cannot assign COA to a CAPEX item" },
        { status: 400 }
      );
    }

    // CAPEX asset number uniqueness check
    if (prev.type === "CAPEX" && assetNumber) {
      const duplicate = await prisma.budgetItem.findFirst({
        where: { assetNumber, NOT: { id } },
      });

      if (duplicate) {
        return NextResponse.json(
          { message: "Asset number already used by another item" },
          { status: 400 }
        );
      }
    }

    // Recalculate remaining if amount changed
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
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// ============================
// DELETE — delete item
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
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
