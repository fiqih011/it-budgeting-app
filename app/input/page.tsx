// app/input/page.tsx
"use client";

import { useState } from "react";
import BudgetForm from "@/components/forms/BudgetForm";
import ActualForm from "@/components/forms/ActualForm";
import SplitForm from "@/components/forms/SplitForm";
import ImportMappingForm from "@/components/forms/ImportMappingForm";
import ImportOpexExcelForm from "@/components/forms/ImportOpexExcelForm";
import ImportCapexExcelForm from "@/components/forms/ImportCapexExcelForm";
import Button from "@/components/ui/Button";

type ViewMode =
  | "menu"
  | "budget-opex"
  | "budget-capex"
  | "actual"
  | "split"
  | "import-opex"
  | "import-capex";

export default function InputPage() {
  const [view, setView] = useState<ViewMode>("menu");

  const BackButton = () => (
    <div className="mb-4">
      <Button onClick={() => setView("menu")} title="← Back to menu" />
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Input — Quick Actions
      </h1>

      {/* ================= MENU ================= */}
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

      {/* ================= CONTENT ================= */}
      <div className="mt-6">
        {/* -------- OPEX BUDGET -------- */}
        {view === "budget-opex" && (
          <>
            <BackButton />
            <BudgetForm type="OPEX" />
          </>
        )}

        {/* -------- CAPEX BUDGET -------- */}
        {view === "budget-capex" && (
          <>
            <BackButton />
            <BudgetForm type="CAPEX" />
          </>
        )}

        {/* -------- ACTUAL -------- */}
        {view === "actual" && (
          <>
            <BackButton />
            <ActualForm />
          </>
        )}

        {/* -------- SPLIT -------- */}
        {view === "split" && (
          <>
            <BackButton />
            <SplitForm />
          </>
        )}

        {/* -------- IMPORT OPEX -------- */}
        {view === "import-opex" && (
          <>
            <BackButton />
            <ImportOpexExcelForm />
          </>
        )}

        {/* -------- IMPORT CAPEX -------- */}
        {view === "import-capex" && (
          <>
            <BackButton />
            <ImportCapexExcelForm />
          </>
        )}
      </div>
    </div>
  );
}
