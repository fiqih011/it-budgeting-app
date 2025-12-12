"use client";

import { useEffect, useState } from "react";
import BudgetDonutChart from "@/components/charts/BudgetDonutChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());

  async function loadSummary() {
    const res = await fetch(`/api/dashboard?year=${year}`);
    const data = await res.json();
    setSummary(data);
  }

  useEffect(() => {
    loadSummary();
  }, [year]);

  if (!summary) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded shadow flex gap-4 w-fit">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={year}>{year}</option>
          <option value={year - 1}>{year - 1}</option>
          <option value={year - 2}>{year - 2}</option>
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Budget" value={summary.totals.totalBudget} color="blue" />
        <Card title="Total Used" value={summary.totals.totalUsed} color="red" />
        <Card title="Remaining" value={summary.totals.totalRemaining} color="green" />
        <Card title="OPEX Budget" value={summary.totals.opexBudget} color="purple" />
        <Card title="CAPEX Budget" value={summary.totals.capexBudget} color="yellow" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut OPEX vs CAPEX */}
        <div className="bg-white p-4 rounded shadow h-[350px]">
          <BudgetDonutChart
            opex={summary.totals.opexBudget}
            capex={summary.totals.capexBudget}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-4 rounded shadow h-[350px]">
          <CategoryBarChart data={summary.categoryBreakdown} />
        </div>

      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className={`p-4 rounded shadow border-l-4 border-${color}-500 bg-white`}>
      <div className="text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </div>
  );
}
