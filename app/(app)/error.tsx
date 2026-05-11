"use client";

import { RefreshCcw } from "lucide-react";

export default function AppError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl rounded-[32px] bg-navy-950 p-6 text-white sm:p-8">
      <div className="text-sm font-bold uppercase tracking-[0.14em] text-saffron-500">AmritVella</div>
      <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">The app could not load this view.</h1>
      <p className="mt-4 text-sm leading-6 text-white/70">
        Your data is still stored in the database. Retry the view after the connection recovers.
      </p>
      <button
        type="button"
        onClick={reset}
        className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </button>
    </section>
  );
}
