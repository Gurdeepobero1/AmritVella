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
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-editorial text-4xl font-normal tracking-[-0.04em] text-navy-950 sm:text-5xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-steel-500 sm:text-lg">{description}</p> : null}
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
    <section className={cn("rounded-[12px] border border-hairline bg-paper text-navy-950", className)}>
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
    <section className={cn("rounded-[12px] bg-navy-950 text-white", className)}>
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
    <div className="border-b border-hairline p-4 sm:p-5">
      <h2 className="text-lg font-medium tracking-[-0.01em] text-navy-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-5 text-steel-500">{description}</p> : null}
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
  "focus-ring w-full rounded-[8px] border border-hairline bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-steel-500 focus:border-saffron-500";

export const darkInputClass =
  "focus-ring w-full rounded-[8px] border border-hairline bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-steel-500 focus:border-saffron-500";

export function SubmitButton({ children = "Save" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="focus-ring inline-flex min-h-11 items-center justify-center rounded-[8px] bg-saffron-500 px-5 py-3 text-sm font-medium leading-none text-white transition active:bg-saffron-600"
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
    <div className="rounded-[12px] border border-hairline bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">{label}</div>
      <div className="font-editorial mt-3 text-3xl font-normal tracking-[-0.04em] text-navy-950">{value}</div>
      {detail ? <div className="mt-1 text-sm leading-5 text-steel-500">{detail}</div> : null}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[12px] border border-dashed border-hairline bg-card p-4 text-sm text-steel-500">{children}</p>;
}
