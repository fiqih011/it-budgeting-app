// app/input/page.tsx
"use client";

import { useState } from "react";
import BudgetForm from "@/components/forms/BudgetForm";
import ActualForm from "@/components/forms/ActualForm";
import SplitForm from "@/components/forms/SplitForm";
import ImportMappingForm from "@/components/forms/ImportMappingForm";
import ImportOpexExcelForm from "@/components/forms/ImportOpexExcelForm";
import Button from "@/components/ui/Button";

export default function InputPage() {
  const [view, setView] = useState<
    | "menu"
    | "budget-opex"
    | "budget-capex"
    | "actual"
    | "split"
    | "import-opex"
    | "import-capex"
  >("menu");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Input — Quick Actions</h1>

      {view === "menu" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setView("budget-opex")}
            title="Input Budget (OPEX)"
            subtitle="Add annual OPEX item"
          />
          <Button
            onClick={() => setView("budget-capex")}
            title="Input Budget (CAPEX)"
            subtitle="Add annual CAPEX item"
          />
          <Button
            onClick={() => setView("actual")}
            title="Input Actual (Realisasi)"
            subtitle="Record transaction"
          />
          <Button
            onClick={() => setView("split")}
            title="Split Budget"
            subtitle="Split amount between items"
          />
          <Button
            onClick={() => setView("import-opex")}
            title="Import OPEX Excel"
            subtitle="Upload & map OPEX file"
          />
          <Button
            onClick={() => setView("import-capex")}
            title="Import CAPEX Excel"
            subtitle="Upload & map CAPEX file"
          />
        </div>
      )}

      <div className="mt-6">
        {/* ---------------- OPEX BUDGET ---------------- */}
        {view === "budget-opex" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            <BudgetForm type="OPEX" />
          </>
        )}

        {/* ---------------- CAPEX BUDGET ---------------- */}
        {view === "budget-capex" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            <BudgetForm type="CAPEX" />
          </>
        )}

        {/* ---------------- ACTUAL (REALISASI) ---------------- */}
        {view === "actual" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            <ActualForm />
          </>
        )}

        {/* ---------------- SPLIT ---------------- */}
        {view === "split" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            <SplitForm />
          </>
        )}

        {/* ---------------- IMPORT OPEX EXCEL ---------------- */}
        {view === "import-opex" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            <ImportOpexExcelForm />
          </>
        )}

        {/* ---------------- IMPORT CAPEX EXCEL (NANTI) ---------------- */}
        {view === "import-capex" && (
          <>
            <div className="mb-4">
              <Button onClick={() => setView("menu")} title="← Back to menu" />
            </div>
            {/* nanti ganti ImportCapexExcelForm */}
            <ImportMappingForm type="CAPEX" />
          </>
        )}
      </div>
    </div>
  );
}
