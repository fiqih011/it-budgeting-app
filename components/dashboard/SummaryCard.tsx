"use client";

export default function SummaryCard({
  title,
  value,
  color = "bg-blue-600",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className={`p-4 rounded text-white shadow ${color}`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
