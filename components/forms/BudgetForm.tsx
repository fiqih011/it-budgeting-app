"use client";

import { useEffect, useState } from "react";

type BudgetType = "OPEX" | "CAPEX";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export default function BudgetForm({ type }: { type: BudgetType }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    amount: "",
    categoryId: "",
    subcategoryId: "",
    coa: "",
    assetNumber: "",
    estimateNextYr: "",
  });

  // ==========================
  // LOAD CATEGORY + SUBCATEGORY
  // ==========================
  useEffect(() => {
    fetch("/api/category")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        const subs = data.flatMap((c: any) => c.subcategories || []);
        setSubcategories(subs);
      });
  }, []);

  // ==========================
  // HANDLE CHANGE
  // ==========================
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ==========================
  // SUBMIT
  // ==========================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!form.name || !form.amount || !form.categoryId) {
      setError("Nama, Amount, dan Category wajib diisi");
      return;
    }

    if (type === "OPEX" && !form.coa) {
      setError("COA wajib untuk OPEX");
      return;
    }

    if (type === "CAPEX" && !form.assetNumber) {
      setError("Asset Number wajib untuk CAPEX");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          type,
          year: Number(form.year),
          amount: Number(form.amount),
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || null,
          coa: type === "OPEX" ? form.coa : null,
          assetNumber: type === "CAPEX" ? form.assetNumber : null,
          estimateNextYr: Number(form.estimateNextYr) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create budget item");
      }

      setSuccess("Budget item berhasil dibuat ✅");

      // Reset form
      setForm({
        name: "",
        year: new Date().getFullYear(),
        amount: "",
        categoryId: "",
        subcategoryId: "",
        coa: "",
        assetNumber: "",
        estimateNextYr: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">
        Input Budget {type}
      </h2>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <input
        name="name"
        placeholder="Nama Budget"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="year"
        type="number"
        value={form.year}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Pilih Category --</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        name="subcategoryId"
        value={form.subcategoryId}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Subcategory (optional) --</option>
        {subcategories
          .filter((s) => s.categoryId === form.categoryId)
          .map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
      </select>

      {type === "OPEX" && (
        <input
          name="coa"
          placeholder="COA"
          value={form.coa}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      )}

      {type === "CAPEX" && (
        <input
          name="assetNumber"
          placeholder="Asset Number"
          value={form.assetNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      )}

      <input
        name="estimateNextYr"
        type="number"
        placeholder="Estimate Next Year"
        value={form.estimateNextYr}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Budget"}
      </button>
    </form>
  );
}
