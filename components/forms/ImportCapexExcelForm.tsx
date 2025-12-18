"use client";

export default function ImportCapexExcelForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Import CAPEX Excel
      </h2>

      {/* DOWNLOAD TEMPLATE */}
      <a
        href="/templates/template-capex.xlsx"
        download
        className="inline-block text-sm text-blue-600 underline"
      >
        Download Template CAPEX
      </a>

      {/* TAHUN */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tahun Budget
        </label>
        <input
          type="number"
          className="border rounded px-3 py-2 w-40"
          defaultValue={new Date().getFullYear()}
        />
      </div>

      {/* FILE INPUT */}
      <div>
        <input type="file" accept=".xlsx" />
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Preview
      </button>
    </div>
  );
}
