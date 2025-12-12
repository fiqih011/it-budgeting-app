"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSub, setNewSub] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Load categories
  async function loadCategories() {
    const res = await fetch("/api/category");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Add category
  async function addCategory() {
    if (!newCategory) return alert("Nama kategori wajib diisi!");

    await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });

    setNewCategory("");
    loadCategories();
  }

  // Add subcategory
  async function addSubcategory() {
    if (!newSub || !selectedCategory) return alert("Pilih category & isi nama subcategory!");

    await fetch("/api/subcategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSub, categoryId: selectedCategory }),
    });

    setNewSub("");
    loadCategories();
  }

  // Delete category
  async function deleteCategory(id: string) {
    if (!confirm("Hapus kategori ini? (Jika masih ada item, harus remap terlebih dahulu)")) return;

    const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    loadCategories();
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">Category Management</h1>

      {/* Add Category */}
      <div className="p-4 bg-white rounded shadow max-w-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Add Category</h2>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Add Subcategory */}
      <div className="p-4 bg-white rounded shadow max-w-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Add Subcategory</h2>

        <select
          className="border p-2 rounded w-full mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Subcategory name"
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
          />

          <button
            onClick={addSubcategory}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="p-4 bg-white rounded shadow max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Category List</h2>

        <div className="space-y-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="border rounded p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{c.name}</h3>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>

              {/* Subcategory */}
              <ul className="ml-4 mt-2 text-sm">
                {c.subcategories.map((s) => (
                  <li key={s.id} className="text-gray-700">
                    • {s.name}
                  </li>
                ))}

                {c.subcategories.length === 0 && (
                  <li className="text-gray-400 italic">No subcategories</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
