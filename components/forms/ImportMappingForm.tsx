// components/forms/ImportMappingForm.tsx
"use client";

import { useState } from "react";

export default function ImportMappingForm({ type }: { type: "OPEX" | "CAPEX" }) {
  const [file, setFile] = useState<File | null>(null);
  const [mappingPreview, setMappingPreview] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setMsg("Choose a file first");

    const fd = new FormData();
    fd.append("file", file);

    const url = type === "OPEX" ? "/api/import-opex" : "/api/import-capex";

    const res = await fetch(url, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const d = await res.json();
      setMsg(d?.message || "Upload failed");
      return;
    }

    const d = await res.json();
    // backend could return parsed preview → for now show placeholder
    setMappingPreview(d.preview ?? { info: "Preview not available" });
    setMsg("File uploaded. Map columns then confirm.");
  }

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Import {type} Excel</h2>

      <form onSubmit={handleUpload}>
        <input type="file" accept=".xls,.xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-4">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Upload & Parse</button>
        </div>
      </form>

      {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}

      {mappingPreview && (
        <div className="mt-4">
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(mappingPreview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
