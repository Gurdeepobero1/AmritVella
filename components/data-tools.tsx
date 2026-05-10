"use client";

import { useState } from "react";
import { Download, FileText, Upload, RotateCcw } from "lucide-react";
import { darkInputClass } from "@/components/ui/primitives";

export function DataTools() {
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white">
        <Download className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-semibold">Export backup</h2>
        <p className="mt-2 text-sm leading-6 text-steel-300">Download all user-owned history as JSON.</p>
        <a
          className="focus-ring mt-4 inline-flex rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950"
          href="/api/export"
        >
          Export JSON
        </a>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white">
        <Upload className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-semibold">Import backup</h2>
        <p className="mt-2 text-sm leading-6 text-steel-300">Import JSON into the signed-in account. Existing duplicate IDs are skipped.</p>
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

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white">
        <FileText className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-semibold">Monthly report</h2>
        <p className="mt-2 text-sm leading-6 text-steel-300">Export a month as markdown for review or printing.</p>
        <input className={`${darkInputClass} mt-4`} type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        <a
          className="focus-ring mt-4 inline-flex rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950"
          href={`/api/monthly-report?month=${month}`}
        >
          Export markdown
        </a>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-white lg:col-span-3">
        <RotateCcw className="h-5 w-5 text-saffron-500" />
        <h2 className="mt-3 text-lg font-semibold">Reset local cache</h2>
        <p className="mt-2 text-sm leading-6 text-steel-300">Clears browser localStorage, sessionStorage, and cache storage. Database records remain untouched.</p>
        <button
          type="button"
          className="focus-ring mt-4 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white"
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

      {status ? <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-steel-100 lg:col-span-3">{status}</div> : null}
    </div>
  );
}
