"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Row = {
  month: string;
  opex: number;
  capex: number;
  total: number;
};

export default function MonthlyTrendLine({ data }: { data: Row[] }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow h-[360px]">
      <h3 className="text-sm font-semibold text-gray-500 mb-2">
        Monthly Actual Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString("id-ID")}`} />
          <Legend />
          <Line type="monotone" dataKey="opex" stroke="#2563eb" />
          <Line type="monotone" dataKey="capex" stroke="#16a34a" />
          <Line type="monotone" dataKey="total" stroke="#f59e0b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
