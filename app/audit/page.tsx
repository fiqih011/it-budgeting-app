"use client";

import { useEffect, useState } from "react";
import AuditTable from "@/components/audit/AuditTable";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>
      <AuditTable data={logs} />
    </div>
  );
}
