"use client";

import { useEffect, useState } from "react";

interface BudgetItem {
  id: string;
  name: string;
  type: "OPEX" | "CAPEX";
  year: number;
  amount: number;
  used: number;
  remaining: number;
  category: { name: string };
  subcategory?: { name: string } | null;
}

export default function DataTable() {
  const [data, setData] = useState<BudgetItem[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | "OPEX" | "CAPEX">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const filtered = data.filter((item) => {
    if (filterType !== "ALL" && item.type !== filterType) return false;
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* FILTER BAR */}
      <div className="flex gap-4 items-center">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="ALL">ALL</option>
          <option value="OPEX">OPEX</option>
          <option value="CAPEX">CAPEX</option>
        </select>

        <input
          placeholder="Search budget name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Year</th>
              <th className="p-2">Category</th>
              <th className="p-2">Subcategory</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-right">Used</th>
              <th className="p-2 text-right">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.type}</td>
                <td className="p-2 text-center">{item.year}</td>
                <td className="p-2">{item.category?.name}</td>
                <td className="p-2">
                  {item.subcategory?.name || "-"}
                </td>
                <td className="p-2 text-right">
                  {item.amount.toLocaleString()}
                </td>
                <td className="p-2 text-right">
                  {item.used.toLocaleString()}
                </td>
                <td
                  className={`p-2 text-right font-semibold ${
                    item.remaining < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {item.remaining.toLocaleString()}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
