"use client";

import { useState } from "react";
import { Download, FileText, Upload, RotateCcw } from "lucide-react";
import { darkInputClass } from "@/components/ui/primitives";

export function DataTools() {
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-[16px] border border-hairline bg-paper p-5 text-navy-950">
        <Download className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">Export backup</h2>
        <p className="mt-2 text-sm leading-6 text-steel-500">Download all user-owned history as JSON.</p>
        <a
          className="focus-ring mt-4 inline-flex rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
          href="/api/export"
        >
          Export JSON
        </a>
      </section>

      <section className="rounded-[16px] border border-hairline bg-paper p-5 text-navy-950">
        <Upload className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">Import backup</h2>
        <p className="mt-2 text-sm leading-6 text-steel-500">Import JSON into the direct-access owner. Existing duplicate IDs are skipped.</p>
        <input
          className={`${darkInputClass} mt-4`}
          type="file"
          accept="application/json"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setStatus("Importing...");
            const text = await file.text();
            const response = await fetch("/api/import", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: text
            });
            setStatus(response.ok ? "Import complete." : "Import failed. Check the JSON shape.");
          }}
        />
      </section>

      <section className="rounded-[16px] border border-hairline bg-paper p-5 text-navy-950">
        <FileText className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">Monthly report</h2>
        <p className="mt-2 text-sm leading-6 text-steel-500">Export a month as markdown for review or printing.</p>
        <input className={`${darkInputClass} mt-4`} type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        <a
          className="focus-ring mt-4 inline-flex rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
          href={`/api/monthly-report?month=${month}`}
        >
          Export markdown
        </a>
      </section>

      <section className="rounded-[16px] border border-hairline bg-paper p-5 text-navy-950 lg:col-span-3">
        <RotateCcw className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">Reset local cache</h2>
        <p className="mt-2 text-sm leading-6 text-steel-500">Clears browser localStorage, sessionStorage, and cache storage. Database records remain untouched.</p>
        <button
          type="button"
          className="focus-ring mt-4 rounded-[16px] bg-card px-5 py-3 text-sm font-bold leading-none text-navy-950"
          onClick={async () => {
            localStorage.clear();
            sessionStorage.clear();
            if ("caches" in window) {
              const names = await caches.keys();
              await Promise.all(names.map((name) => caches.delete(name)));
            }
            setStatus("Local cache cleared. Database was not changed.");
          }}
        >
          Reset local cache
        </button>
      </section>

      {status ? <div className="rounded-[16px] border border-hairline bg-paper p-3 text-sm text-steel-500 lg:col-span-3">{status}</div> : null}
    </div>
  );
}
