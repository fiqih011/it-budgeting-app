"use client";

interface AuditLog {
  id: string;
  action: string;
  detail?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function AuditTable({ data }: { data: AuditLog[] }) {
  return (
    <div className="overflow-auto border rounded bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Detail</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No audit logs
              </td>
            </tr>
          )}

          {data.map((log) => (
            <tr key={log.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="p-3">
                {log.user?.name || "System"}
              </td>
              <td className="p-3 font-semibold">
                {log.action}
              </td>
              <td className="p-3 text-gray-600">
                {log.detail || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
