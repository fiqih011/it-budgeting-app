// components/ui/Button.tsx
"use client";

export default function Button({ title, subtitle, onClick }: { title: string; subtitle?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="p-6 border rounded-lg bg-white shadow hover:shadow-md text-left">
      <div className="font-semibold text-lg">{title}</div>
      {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
    </button>
  );
}
