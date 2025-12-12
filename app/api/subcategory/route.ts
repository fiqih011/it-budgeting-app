import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: create subcategory
export async function POST(req: Request) {
  try {
    const { name, categoryId } = await req.json();

    if (!name || !categoryId) {
      return NextResponse.json({ message: "Name and categoryId required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const sub = await prisma.subcategory.create({
      data: { name, categoryId },
    });

    return NextResponse.json(sub);
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
