"use client";

import { useEffect, useState } from "react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import OpexCapexDonut from "@/components/charts/OpexCapexDonut";
import CategoryBarChart from "@/components/charts/CategoryBarChart";

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const totalBudget = items.reduce((s, i) => s + i.amount, 0);
  const totalUsed = items.reduce((s, i) => s + i.used, 0);
  const totalRemaining = items.reduce((s, i) => s + i.remaining, 0);

  const opexTotal = items
    .filter((i) => i.type === "OPEX")
    .reduce((s, i) => s + i.amount, 0);

  const capexTotal = items
    .filter((i) => i.type === "CAPEX")
    .reduce((s, i) => s + i.amount, 0);

  const categoryMap: Record<string, number> = {};
  items.forEach((i) => {
    const name = i.category?.name || "Unknown";
    categoryMap[name] = (categoryMap[name] || 0) + i.amount;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, amount]) => ({ name, amount })
  );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Budget"
          value={totalBudget.toLocaleString()}
        />
        <SummaryCard
          title="Used"
          value={totalUsed.toLocaleString()}
          color="bg-red-600"
        />
        <SummaryCard
          title="Remaining"
          value={totalRemaining.toLocaleString()}
          color="bg-green-600"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">OPEX vs CAPEX</h3>
          <OpexCapexDonut opex={opexTotal} capex={capexTotal} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Budget by Category</h3>
          <CategoryBarChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
