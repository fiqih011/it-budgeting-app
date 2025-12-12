// app/api/category/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE CATEGORY
export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    await prisma.subcategory.deleteMany({ where: { categoryId: id } });
    await prisma.budgetItem.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DELETE category error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// UPDATE CATEGORY
export async function PUT(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = params?.id;

    const body = await req.json();

    const updated = await prisma.category.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT category error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET CATEGORY BY ID
export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const cat = await prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });

    if (!cat) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(cat);
  } catch (err) {
    console.error("GET category error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
