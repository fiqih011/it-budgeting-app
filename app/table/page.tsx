"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/table/DataTable";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

type BudgetType = "OPEX" | "CAPEX";
type FilterType = "ALL" | BudgetType;

type BudgetItem = {
  id: string;
  name: string;
  type: BudgetType;
  amount: number;
  used: number;
  remaining: number;
};

export default function TablePage() {
  const currentYear = new Date().getFullYear();

  const [data, setData] = useState<BudgetItem[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [year, setYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/budget", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");

      const json: BudgetItem[] = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      setError("Gagal memuat data budget");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    filterType === "ALL"
      ? data.filter((i) => i)
      : data.filter((i) => i.type === filterType);

  function handleExport() {
    const params = new URLSearchParams();
    params.set("year", String(year));

    if (filterType !== "ALL") {
      params.set("type", filterType);
    }

    window.location.href = `/api/export-budget?${params.toString()}`;
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="Belum ada data budget"
          description="Silakan input atau import budget terlebih dahulu."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Budget Table</h1>

        <div className="flex items-center gap-2">
          {/* YEAR SELECT */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* EXPORT */}
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {(["ALL", "OPEX", "CAPEX"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded text-sm font-medium
              ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Data tidak ditemukan"
          description={`Tidak ada data ${filterType}`}
        />
      ) : (
        <DataTable data={filtered} />
      )}
    </div>
  );
}
