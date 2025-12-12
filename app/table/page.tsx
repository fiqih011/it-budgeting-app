"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/table/DataTable";

export default function TablePage() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("ALL");

  async function loadData() {
    const res = await fetch("/api/budget");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    filterType === "ALL"
      ? data
      : data.filter((item: any) => item.type === filterType);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-4">Budget Table</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-4 py-2 rounded ${filterType === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          ALL
        </button>

        <button
          onClick={() => setFilterType("OPEX")}
          className={`px-4 py-2 rounded ${filterType === "OPEX" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          OPEX
        </button>

        <button
          onClick={() => setFilterType("CAPEX")}
          className={`px-4 py-2 rounded ${filterType === "CAPEX" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          CAPEX
        </button>
      </div>

      {/* TABLE */}
      <DataTable data={filtered} />

    </div>
  );
}
