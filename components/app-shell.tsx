import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Home,
  Sparkles
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/daily", label: "Routine", icon: BookOpen },
  { href: "/simran", label: "Simran", icon: Sparkles },
  { href: "/career", label: "Work", icon: BriefcaseBusiness },
  { href: "/analytics", label: "Insights", icon: BarChart3 }
];

const secondaryNav = [
  { href: "/emotional", label: "Emotional" },
  { href: "/fitness", label: "Body & seva" },
  { href: "/library", label: "Library" },
  { href: "/reviews", label: "Reviews" },
  { href: "/data", label: "Backup" }
];

export function AppShell({
  children,
  userName
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Link href="/dashboard" className="focus-ring shrink-0 rounded-[16px] px-2 py-2">
            <div className="text-lg font-bold tracking-[-0.03em] text-saffron-500">AmritVella</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-500">calm discipline</div>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-steel-500 transition active:bg-card active:text-navy-950"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full bg-card px-3 py-2 text-xs font-semibold text-steel-500 md:inline-flex">
              {userName ?? "Direct access"}
            </span>
            <Link
              href="/daily"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-saffron-500 px-4 py-3 text-sm font-bold leading-none text-white"
            >
              Log
            </Link>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring whitespace-nowrap rounded-full bg-card px-4 py-2 text-xs font-semibold text-navy-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <footer className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 pb-8 text-xs font-semibold text-steel-500 sm:px-6 lg:px-8">
        {secondaryNav.map((item) => (
          <Link key={item.href} href={item.href} className="focus-ring rounded-full px-2 py-1">
            {item.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
