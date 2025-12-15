// lib/excel.ts
import ExcelJS from "exceljs";

export interface ExcelRow {
  name: string;
  amount: number;
  category: string;
  subcategory: string;
  coa: string;
  assetNumber: string;
}

/**
 * Parse Excel file buffer into rows
 * Expect header in row 1
 */
export async function parseExcel(arrayBuffer: ArrayBuffer): Promise<ExcelRow[]> {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // ExcelJS load method can accept ArrayBuffer directly in newer versions
    // or we use Buffer.from for compatibility
    const buffer = Buffer.from(arrayBuffer);
    await workbook.xlsx.load(buffer as any); // Type assertion to bypass strict typing
    
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw new Error("Excel sheet tidak ditemukan");
    }

    if (sheet.rowCount < 2) {
      throw new Error("File Excel kosong atau hanya berisi header");
    }

    const rows: ExcelRow[] = [];
    let errorRows: number[] = [];

    sheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;

      try {
        const name = String(row.getCell(1).value ?? "").trim();
        const amountValue = row.getCell(2).value;
        const category = String(row.getCell(3).value ?? "").trim();
        const subcategory = String(row.getCell(4).value ?? "").trim();
        const coa = String(row.getCell(5).value ?? "").trim();
        const assetNumber = String(row.getCell(6).value ?? "").trim();

        // Validasi data minimal
        if (!name) {
          console.warn(`Baris ${rowNumber}: Name kosong, dilewati`);
          errorRows.push(rowNumber);
          return;
        }

        // Parse amount dengan lebih robust
        let amount = 0;
        if (typeof amountValue === 'number') {
          amount = amountValue;
        } else if (typeof amountValue === 'string') {
          // Handle format currency (misal: "Rp 1.000.000" atau "1,000.00")
          const cleanAmount = amountValue.replace(/[^\d.-]/g, '');
          amount = parseFloat(cleanAmount) || 0;
        }

        rows.push({
          name,
          amount,
          category,
          subcategory,
          coa,
          assetNumber,
        });
      } catch (err) {
        console.warn(`Error parsing baris ${rowNumber}:`, err);
        errorRows.push(rowNumber);
      }
    });

    if (rows.length === 0) {
      throw new Error("Tidak ada data valid yang ditemukan di file Excel");
    }

    if (errorRows.length > 0) {
      console.warn(`${errorRows.length} baris dilewati karena data tidak valid:`, errorRows);
    }

    return rows;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Gagal parse Excel: ${err.message}`);
    }
    throw new Error("Gagal parse Excel: Unknown error");
  }
}