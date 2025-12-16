import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const typeParam = searchParams.get("type");
  const yearParam = searchParams.get("year");

  const type =
    typeParam === "OPEX" || typeParam === "CAPEX" ? typeParam : undefined;

  const year = yearParam ? Number(yearParam) : new Date().getFullYear();
  if (Number.isNaN(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const items = await prisma.budgetItem.findMany({
    where: {
      year,
      ...(type ? { type } : {}),
    },
    include: {
      category: true,
      subcategory: true,
    },
    orderBy: { name: "asc" },
  });

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet(type ?? "ALL");

  sheet.columns = [
    { header: "Type", key: "type", width: 10 },
    { header: "Category", key: "category", width: 20 },
    { header: "Subcategory", key: "subcategory", width: 20 },
    { header: "Item Name", key: "name", width: 30 },
    { header: "Asset Number", key: "assetNumber", width: 18 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Used", key: "used", width: 15 },
    { header: "Remaining", key: "remaining", width: 15 },
  ];

  for (const i of items) {
    sheet.addRow({
      type: i.type,
      category: i.category?.name ?? "",
      subcategory: i.subcategory?.name ?? "",
      name: i.name,
      assetNumber: i.assetNumber ?? "",
      amount: i.amount,
      used: i.used,
      remaining: i.remaining,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=budget-${type ?? "ALL"}-${year}.xlsx`,
    },
  });
}
