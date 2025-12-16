"use client";

import { useEffect, useState } from "react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import OpexCapexDonut from "@/components/charts/OpexCapexDonut";
import CategoryBarChart from "@/components/charts/CategoryBarChart";

/**
 * Type definitions (explicit & aman)
 */
type Summary = {
  amount: number;
  used: number;
  remaining: number;
};

type SummaryResponse = {
  year: number;
  opex: Summary;
  capex: Summary;
  total: Summary;
};

type BreakdownRow = {
  category: string;
  amount: number;
};

type BreakdownResponse = {
  year: number;
  opex: BreakdownRow[];
  capex: BreakdownRow[];
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [s, b] = await Promise.all([
          fetch("/api/dashboard/summary", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/dashboard/breakdown", { cache: "no-store" }).then((r) => r.json()),
        ]);

        if (!mounted) return;
        setSummary(s);
        setBreakdown(b);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!summary || !breakdown) {
    return (
      <div className="p-8">
        <p className="text-red-600">Gagal memuat data dashboard</p>
      </div>
    );
  }

  /**
   * Chart data mapping (aman & sederhana)
   */
  const opexTotal = summary.opex.amount;
  const capexTotal = summary.capex.amount;

  const categoryData = [
    ...breakdown.opex,
    ...breakdown.capex,
  ].map((c) => ({
    name: c.category,
    amount: c.amount,
  }));

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Budget"
          value={summary.total.amount.toLocaleString("id-ID")}
        />
        <SummaryCard
          title="Used"
          value={summary.total.used.toLocaleString("id-ID")}
          color="bg-red-600"
        />
        <SummaryCard
          title="Remaining"
          value={summary.total.remaining.toLocaleString("id-ID")}
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
