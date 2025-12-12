"use client";

import { useEffect, useState, FormEvent } from "react";

type Category = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export default function BudgetForm({ type }: { type: "OPEX" | "CAPEX" }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState<number>(0);

  const [coa, setCoa] = useState("");
  const [assetNumber, setAssetNumber] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryId("");
  }, [categoryId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: any = {
      name,
      year,
      amount,
      type,
      categoryId,
      subcategoryId: subcategoryId || null,
    };

    if (type === "OPEX") payload.coa = coa;
    if (type === "CAPEX") payload.assetNumber = assetNumber;

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Budget item saved!");
      setName("");
      setAmount(0);
      setCoa("");
      setAssetNumber("");
      setCategoryId("");
      setSubcategoryId("");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="max-w-2xl bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">{type} Budget Form</h2>

      {/* NAME */}
      <label className="block mb-3">
        Name:
        <input
          className="w-full border p-2 rounded mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      {/* YEAR */}
      <label className="block mb-3">
        Year:
        <input
          type="number"
          className="w-full border p-2 rounded mt-1"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          required
        />
      </label>

      {/* AMOUNT */}
      <label className="block mb-3">
        Amount:
        <input
          type="number"
          className="w-full border p-2 rounded mt-1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </label>

      {/* CATEGORY DROPDOWN */}
      <label className="block mb-3">
        Category:
        <select
          className="w-full border p-2 rounded mt-1"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {/* SUBCATEGORY DROPDOWN */}
      <label className="block mb-3">
        Subcategory:
        <select
          className="w-full border p-2 rounded mt-1"
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          disabled={!categoryId}
        >
          <option value="">-- Optional --</option>

          {categoryId &&
            categories
              .find((c) => c.id === categoryId)
              ?.subcategories.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
        </select>
      </label>

      {/* EXTRA FIELDS */}
      {type === "OPEX" && (
        <label className="block mb-3">
          COA:
          <input
            className="w-full border p-2 rounded mt-1"
            value={coa}
            onChange={(e) => setCoa(e.target.value)}
          />
        </label>
      )}

      {type === "CAPEX" && (
        <label className="block mb-3">
          Asset Number:
          <input
            className="w-full border p-2 rounded mt-1"
            value={assetNumber}
            onChange={(e) => setAssetNumber(e.target.value)}
          />
        </label>
      )}

      {/* SUBMIT BUTTON */}
      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        {loading ? "Saving..." : "Save Budget Item"}
      </button>

      {/* MESSAGE */}
      {message && <div className="mt-4">{message}</div>}
    </form>
  );
}
