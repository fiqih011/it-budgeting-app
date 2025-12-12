"use client";

import { useState } from "react";

export default function ImportOpexExcelForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [step, setStep] = useState(1);

  async function uploadFile() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/import/opex", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setPreview(data.preview);
    setStep(2);
  }

  return (
    <div className="p-4 space-y-4 bg-white rounded shadow">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold">Import OPEX Excel</h2>
          <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button
            onClick={uploadFile}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload & Preview
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold">Preview Data</h2>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">COA</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2">{row.name}</td>
                  <td className="border p-2">{row.amount}</td>
                  <td className="border p-2">{row.category}</td>
                  <td className="border p-2">{row.subcategory}</td>
                  <td className="border p-2">{row.coa}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Proceed to Mapping
          </button>
        </>
      )}
    </div>
  );
}
