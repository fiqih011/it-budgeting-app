// app/api/import/opex/route.ts
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Excel file is required" }, { status: 400 });
    }

    // Use Uint8Array (no Node Buffer dependency)
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const workbook = new ExcelJS.Workbook();

    // <-- CAST to any to avoid TS complaining about Buffer vs Uint8Array
    // ExcelJS runtime accepts Uint8Array; this cast silences TS type-checking issues.
    await workbook.xlsx.load(uint8 as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return NextResponse.json({ error: "No sheet found" }, { status: 400 });
    }

    const rows: any[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      rows.push({
        name: String(row.getCell(1)?.value ?? ""),
        amount: Number(row.getCell(2)?.value ?? 0),
        category: String(row.getCell(3)?.value ?? ""),
        subcategory: String(row.getCell(4)?.value ?? ""),
        coa: String(row.getCell(5)?.value ?? ""),
      });
    });

    return NextResponse.json({ preview: rows });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    return NextResponse.json({ error: "Failed to process Excel file", details: String(error) }, { status: 500 });
  }
}
