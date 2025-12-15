// app/api/import-opex/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

export async function POST(req: Request) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Validasi file ada
    if (!file) {
      return NextResponse.json(
        { message: "File wajib diupload" },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          message: "Tipe file tidak valid. Hanya file Excel (.xlsx, .xls) yang diperbolehkan",
          allowedTypes: ALLOWED_TYPES 
        },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          message: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE
        },
        { status: 400 }
      );
    }

    // Konversi file ke ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse Excel (langsung pakai ArrayBuffer)
    const rows = await parseExcel(arrayBuffer);

    // Optional: Validasi business logic untuk OPEX
    const invalidRows = rows.filter(row => {
      // Contoh: OPEX tidak boleh punya asset number
      return row.assetNumber && row.assetNumber.length > 0;
    });

    if (invalidRows.length > 0) {
      return NextResponse.json(
        {
          message: "Beberapa baris memiliki Asset Number. OPEX tidak memerlukan Asset Number",
          invalidCount: invalidRows.length,
          preview: rows,
          total: rows.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses ${rows.length} baris data OPEX`,
      preview: rows.slice(0, 10), // Preview 10 baris pertama saja
      total: rows.length,
    });

  } catch (err: any) {
    console.error("IMPORT OPEX ERROR:", err);
    
    return NextResponse.json(
      { 
        success: false,
        message: err.message || "Terjadi kesalahan saat memproses file",
        error: process.env.NODE_ENV === "development" ? err.toString() : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method untuk informasi endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/import-opex",
    method: "POST",
    description: "Import OPEX data dari file Excel",
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    allowedTypes: ALLOWED_TYPES,
    expectedColumns: [
      "Name (A)",
      "Amount (B)", 
      "Category (C)",
      "Subcategory (D)",
      "COA (E)",
      "Asset Number (F) - should be empty for OPEX"
    ]
  });
}