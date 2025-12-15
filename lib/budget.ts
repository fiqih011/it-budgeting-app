// lib/budget.ts
import { BudgetType } from "@prisma/client";

export function calculateRemaining(amount: number, used: number) {
  return amount - used;
}

export function validateBudgetType(
  type: BudgetType,
  assetNumber?: string | null,
  coa?: string | null
) {
  if (type === "CAPEX" && !assetNumber) {
    throw new Error("Asset Number wajib untuk CAPEX");
  }

  if (type === "OPEX" && !coa) {
    throw new Error("COA wajib untuk OPEX");
  }
}

export function ensureEnoughBudget(remaining: number, amount: number) {
  if (amount <= 0) {
    throw new Error("Amount realisasi harus > 0");
  }
  if (remaining < amount) {
    throw new Error("Budget tidak mencukupi");
  }
}

export function validateSplit(
  fromRemaining: number,
  amount: number,
  fromType: string,
  toType: string
) {
  if (amount <= 0) {
    throw new Error("Amount split harus > 0");
  }

  if (fromRemaining < amount) {
    throw new Error("Budget sumber tidak mencukupi");
  }

  if (fromType !== toType) {
    throw new Error("Split hanya boleh antar jenis yang sama (OPEX ↔ OPEX / CAPEX ↔ CAPEX)");
  }
}
