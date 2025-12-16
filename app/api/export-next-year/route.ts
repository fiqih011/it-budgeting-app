import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Proteksi: jangan generate kalau next year sudah ada data
    const exists = await prisma.budgetItem.findFirst({
      where: { year: nextYear },
      select: { id: true },
    });

    if (exists) {
      return NextResponse.json(
        { message: `Data tahun ${nextYear} sudah ada` },
        { status: 400 }
      );
    }

    const items = await prisma.budgetItem.findMany({
      where: { year: currentYear },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: [{ type: "asc" }, { category: { name: "asc" } }],
    });

    const wb = new ExcelJS.Workbook();
    wb.creator = "IT Budgeting App";
    wb.created = new Date();

    // =========================
    // OPEX
    // =========================
    const wsOpex = wb.addWorksheet("OPEX");
    wsOpex.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Subcategory", key: "subcategory", width: 20 },
      { header: "Item Name", key: "name", width: 30 },
      { header: "COA", key: "coa", width: 15 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    items
      .filter((i) => i.type === "OPEX")
      .forEach((i) => {
        wsOpex.addRow({
          category: i.category?.name ?? "",
          subcategory: i.subcategory?.name ?? "",
          name: i.name,
          coa: i.coa ?? "",
          amount: i.amount,
        });
      });

    // =========================
    // CAPEX
    // =========================
    const wsCapex = wb.addWorksheet("CAPEX");
    wsCapex.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Subcategory", key: "subcategory", width: 20 },
      { header: "Item Name", key: "name", width: 30 },
      { header: "Asset Number", key: "assetNumber", width: 20 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    items
      .filter((i) => i.type === "CAPEX")
      .forEach((i) => {
        wsCapex.addRow({
          category: i.category?.name ?? "",
          subcategory: i.subcategory?.name ?? "",
          name: i.name,
          assetNumber: i.assetNumber ?? "",
          amount: i.amount,
        });
      });

    [wsOpex, wsCapex].forEach((ws) => {
      ws.getRow(1).font = { bold: true };
      ws.views = [{ state: "frozen", ySplit: 1 }];
    });

    const buffer = await wb.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=Budget_${nextYear}_Baseline.xlsx`,
      },
    });
  } catch (err: any) {
    console.error("EXPORT NEXT YEAR ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Gagal export next year" },
      { status: 500 }
    );
  }
}
