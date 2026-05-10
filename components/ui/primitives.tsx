import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-steel-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-paper text-navy-950 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function DarkCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-white/[0.04] text-white", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-navy-950/10 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-navy-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-5 text-steel-700">{description}</p> : null}
    </div>
  );
}

export function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-950">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block text-xs text-steel-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring w-full rounded-md border border-navy-950/15 bg-white px-3 py-2 text-sm text-navy-950 outline-none transition placeholder:text-steel-300 focus:border-saffron-500";

export const darkInputClass =
  "focus-ring w-full rounded-md border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-steel-500 focus:border-saffron-500";

export function SubmitButton({ children = "Save" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="focus-ring inline-flex items-center justify-center rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-saffron-600"
    >
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: React.ReactNode;
  detail?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-steel-300">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      {detail ? <div className="mt-1 text-sm text-steel-300">{detail}</div> : null}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-navy-950/15 p-4 text-sm text-steel-700">{children}</p>;
}
