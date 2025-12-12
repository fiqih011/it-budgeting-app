// app/api/category/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all categories
export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true }
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET category list error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// CREATE category
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
      }
    });

    return NextResponse.json(newCategory);
  } catch (err) {
    console.error("POST category error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
