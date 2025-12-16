import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const wb = new ExcelJS.Workbook();
    wb.creator = "IT Budgeting App";
    wb.created = new Date();

    // =========================
    // TEMPLATE OPEX
    // =========================
    const wsOpex = wb.addWorksheet("OPEX");
    wsOpex.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Subcategory", key: "subcategory", width: 20 },
      { header: "Item Name", key: "name", width: 30 },
      { header: "COA", key: "coa", width: 15 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    wsOpex.addRow({
      category: "IT OPEX",
      subcategory: "Software",
      name: "Microsoft 365",
      coa: "610101",
      amount: 120000000,
    });

    // =========================
    // TEMPLATE CAPEX
    // =========================
    const wsCapex = wb.addWorksheet("CAPEX");
    wsCapex.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Subcategory", key: "subcategory", width: 20 },
      { header: "Item Name", key: "name", width: 30 },
      { header: "Asset Number", key: "assetNumber", width: 20 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    wsCapex.addRow({
      category: "IT CAPEX",
      subcategory: "Hardware",
      name: "Laptop Dell Latitude",
      assetNumber: "AST-IT-0001",
      amount: 25000000,
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
        "Content-Disposition":
          "attachment; filename=Budget_Import_Template.xlsx",
      },
    });
  } catch (err: any) {
    console.error("TEMPLATE ERROR:", err);
    return NextResponse.json(
      { message: err.message || "Gagal generate template" },
      { status: 500 }
    );
  }
}
