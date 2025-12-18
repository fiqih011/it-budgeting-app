// lib/excel.ts
import ExcelJS from "exceljs";

export type OpexPreviewRow = {
  rowNumber: number;
  name: string;
  category: string;
  subcategory?: string;
  coa?: string;
  amount: number;
  errors: string[];
};

const REQUIRED_HEADERS = [
  "name",
  "category",
  "subcategory",
  "coa",
  "amount",
];

function normalizeHeader(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export async function parseOpexExcelPreview(
  file: File
): Promise<OpexPreviewRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("Worksheet tidak ditemukan");
  }

  // ===== HEADER VALIDATION =====
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell((cell) => {
    headers.push(normalizeHeader(cell.value));
  });

  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      throw new Error(`Header "${required}" tidak ditemukan di Excel`);
    }
  }

  const headerIndex: Record<string, number> = {};
  headers.forEach((h, idx) => {
    headerIndex[h] = idx + 1;
  });

  // ===== DATA ROWS =====
  const rows: OpexPreviewRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const errors: string[] = [];

    const name = String(
      row.getCell(headerIndex["name"]).value ?? ""
    ).trim();

    const category = String(
      row.getCell(headerIndex["category"]).value ?? ""
    ).trim();

    const subcategory = String(
      row.getCell(headerIndex["subcategory"]).value ?? ""
    ).trim();

    const coa = String(
      row.getCell(headerIndex["coa"]).value ?? ""
    ).trim();

    const amount = toNumber(
      row.getCell(headerIndex["amount"]).value
    );

    if (!name) errors.push("Nama item kosong");
    if (!category) errors.push("Category kosong");
    if (!coa) errors.push("COA kosong");
    if (amount <= 0) errors.push("Amount harus > 0");

    rows.push({
      rowNumber,
      name,
      category,
      subcategory: subcategory || undefined,
      coa: coa || undefined,
      amount,
      errors,
    });
  });

  return rows;
}
