// app/api/import-capex/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export async function POST(req: Request) {
  try {
    // ======================
    // 1. FILE VALIDATION
    // ======================
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File wajib diupload" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipe file tidak valid (xlsx / xls)" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 10MB" },
        { status: 400 }
      );
    }

    // ======================
    // 2. PARSE EXCEL
    // ======================
    const arrayBuffer = await file.arrayBuffer();
    const rows = await parseExcel(arrayBuffer);

    if (!rows.length) {
      return NextResponse.json(
        { message: "File Excel kosong" },
        { status: 400 }
      );
    }

    // ======================
    // 3. VALIDASI CAPEX
    // ======================
    const invalid = rows.filter(
      (r) => !r.assetNumber || r.assetNumber.trim() === ""
    );

    if (invalid.length > 0) {
      return NextResponse.json(
        {
          message: "CAPEX wajib memiliki Asset Number",
          invalidCount: invalid.length,
        },
        { status: 400 }
      );
    }

    // ======================
    // 4. IMPORT + MERGE
    // ======================
    let created = 0;
    let merged = 0;
    let failed = 0;

    const errors: any[] = [];

    for (const row of rows) {
      try {
        await prisma.$transaction(async (tx) => {
          const category = await tx.category.findFirst({
            where: { name: row.category },
          });

          if (!category) {
            throw new Error(`Category '${row.category}' tidak ditemukan`);
          }

          const subcategory = await tx.subcategory.findFirst({
            where: {
              name: row.subcategory,
              categoryId: category.id,
            },
          });

          if (!subcategory) {
            throw new Error(
              `Subcategory '${row.subcategory}' tidak ditemukan`
            );
          }

          const existing = await tx.budgetItem.findFirst({
            where: {
              assetNumber: row.assetNumber,
              year: Number(row.year),
              type: "CAPEX",
            },
          });

          const amount = Number(row.amount);

          if (isNaN(amount) || amount <= 0) {
            throw new Error("Amount tidak valid");
          }

          if (existing) {
            // ======================
            // MERGE CAPEX
            // ======================
            await tx.budgetItem.update({
              where: { id: existing.id },
              data: {
                amount: existing.amount + amount,
                remaining: existing.remaining + amount,
              },
            });
            merged++;
          } else {
            // ======================
            // CREATE CAPEX
            // ======================
            await tx.budgetItem.create({
              data: {
                name: row.name,
                type: "CAPEX",
                year: Number(row.year),
                amount,
                used: 0,
                remaining: amount,
                assetNumber: row.assetNumber,
                coa: null,
                categoryId: category.id,
                subcategoryId: subcategory.id,
              },
            });
            created++;
          }
        });
      } catch (err: any) {
        failed++;
        errors.push({
          assetNumber: row.assetNumber,
          error: err.message,
        });
      }
    }

    // ======================
    // 5. RESPONSE SUMMARY
    // ======================
    return NextResponse.json({
      success: true,
      total: rows.length,
      created,
      merged,
      failed,
      errors,
    });
  } catch (err: any) {
    console.error("IMPORT CAPEX ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Gagal import CAPEX",
      },
      { status: 500 }
    );
  }
}

// ======================
// INFO ENDPOINT
// ======================
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/import-capex",
    method: "POST",
    description: "Import CAPEX dari Excel (merge by AssetNumber)",
    rules: {
      assetNumber: "WAJIB & UNIQUE",
      coa: "HARUS NULL",
      type: "CAPEX",
    },
  });
}
