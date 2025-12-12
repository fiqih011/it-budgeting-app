"use client";

export default function DataTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-auto border rounded shadow bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Subcategory</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-right">Used</th>
            <th className="p-3 text-right">Remaining</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={8} className="p-4 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          )}

          {data.map((item: any) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.type}</td>
              <td className="p-3">{item.year}</td>
              <td className="p-3">{item.category?.name || "-"}</td>
              <td className="p-3">{item.subcategory?.name || "-"}</td>
              <td className="p-3 text-right">{item.amount.toLocaleString()}</td>
              <td className="p-3 text-right">{item.used.toLocaleString()}</td>
              <td
                className={`p-3 text-right font-semibold ${
                  item.remaining < 0 ? "text-red-600" : "text-green-700"
                }`}
              >
                {item.remaining.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
