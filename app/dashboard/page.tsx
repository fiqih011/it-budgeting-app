"use client";

import { useEffect, useState } from "react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import OpexCapexDonut from "@/components/charts/OpexCapexDonut";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

/**
 * =========================
 * TYPE DEFINITIONS
 * =========================
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

/**
 * =========================
 * DASHBOARD PAGE
 * =========================
 */
export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, breakdownRes] = await Promise.all([
          fetch("/api/dashboard/summary", { cache: "no-store" }),
          fetch("/api/dashboard/breakdown", { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !breakdownRes.ok) {
          throw new Error("API response not OK");
        }

        const summaryData: SummaryResponse = await summaryRes.json();
        const breakdownData: BreakdownResponse = await breakdownRes.json();

        if (!mounted) return;

        setSummary(summaryData);
        setBreakdown(breakdownData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (mounted) {
          setError("Gagal memuat data dashboard");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * =========================
   * LOADING STATE (SKELETON)
   * =========================
   */
  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-48" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  /**
   * =========================
   * ERROR STATE
   * =========================
   */
  if (error || !summary || !breakdown) {
    return (
      <div className="p-8">
        <ErrorState message={error ?? "Data dashboard tidak tersedia"} />
      </div>
    );
  }

  /**
   * =========================
   * EMPTY STATE
   * =========================
   */
  if (summary.total.amount === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="Belum ada data budget"
          description="Silakan input atau import budget terlebih dahulu."
        />
      </div>
    );
  }

  /**
   * =========================
   * DATA MAPPING (SAFE)
   * =========================
   */
  const opexTotal = summary.opex.amount;
  const capexTotal = summary.capex.amount;

  const categoryData = [...breakdown.opex, ...breakdown.capex].map((row) => ({
    name: row.category,
    amount: row.amount,
  }));

  /**
   * =========================
   * RENDER
   * =========================
   */
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Ringkasan budget tahun {summary.year}
        </p>
      </div>

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
