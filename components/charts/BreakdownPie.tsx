"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Row = {
  category: string;
  amount: number;
};

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

function formatCurrency(value: unknown): string {
  if (typeof value === "number") {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }

  if (typeof value === "string") {
    const n = Number(value);
    if (!Number.isNaN(n)) {
      return `Rp ${n.toLocaleString("id-ID")}`;
    }
  }

  return "Rp 0";
}

export default function BreakdownPie({
  title,
  data,
}: {
  title: string;
  data: Row[];
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow h-[320px]">
      <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            outerRadius={110}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
