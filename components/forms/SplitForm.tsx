"use client";

import { useEffect, useState } from "react";

export default function SplitForm() {
  const [items, setItems] = useState<any[]>([]);
  const [fromItemId, setFromItemId] = useState("");
  const [toItemId, setToItemId] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/budget");
      const data = await res.json();
      setItems(data);
    }
    load();
  }, []);

  async function submit(e: any) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/split", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromItemId, toItemId, amount }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage("❌ " + result.error);
      return;
    }

    setMessage("✅ Split budget berhasil.");
    setAmount(0);
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Split Budget</h2>

      {/* FROM */}
      <div>
        <label>Dari (Source Item)</label>
        <select
          className="border p-2 w-full rounded"
          value={fromItemId}
          onChange={(e) => setFromItemId(e.target.value)}
        >
          <option value="">-- pilih item --</option>
          {items.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name} — Remaining: {item.remaining}
            </option>
          ))}
        </select>
      </div>

      {/* TO */}
      <div>
        <label>Ke (Target Item)</label>
        <select
          className="border p-2 w-full rounded"
          value={toItemId}
          onChange={(e) => setToItemId(e.target.value)}
        >
          <option value="">-- pilih item --</option>
          {items.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name} — Remaining: {item.remaining}
            </option>
          ))}
        </select>
      </div>

      {/* AMOUNT */}
      <div>
        <label>Amount</label>
        <input
          className="border p-2 w-full rounded"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button className="bg-purple-600 text-white px-4 py-2 rounded">
        Submit
      </button>

      {message && <div className="mt-3">{message}</div>}
    </form>
  );
}
