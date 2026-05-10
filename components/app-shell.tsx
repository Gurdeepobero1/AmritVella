import Link from "next/link";
import {
  Activity,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Database,
  HeartPulse,
  Home,
  NotebookPen,
  Shield,
  Sparkles
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/daily", label: "Daily Sikh Routine", icon: BookOpen },
  { href: "/simran", label: "Simran", icon: Sparkles },
  { href: "/emotional", label: "Emotional Control", icon: Shield },
  { href: "/career", label: "Career", icon: BriefcaseBusiness },
  { href: "/fitness", label: "Fitness & Seva", icon: HeartPulse },
  { href: "/library", label: "Gurbani Library", icon: NotebookPen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reviews", label: "Reviews", icon: Activity },
  { href: "/data", label: "Backup", icon: Database }
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-navy-950/95 px-4 py-5 backdrop-blur lg:block">
        <Link href="/dashboard" className="focus-ring block rounded-md px-2">
          <div className="text-xl font-semibold tracking-[0.08em] text-white">AMRITVELLA</div>
          <div className="mt-1 text-xs uppercase tracking-[0.22em] text-saffron-500">discipline system</div>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-steel-100 transition hover:bg-white/7 hover:text-white"
              >
                <Icon className="h-4 w-4 text-saffron-500" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-medium text-white">{userName ?? "Single-user mode"}</div>
          <div className="mt-1 text-xs text-steel-300">Direct access enabled. History still stays under one database owner.</div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-navy-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="focus-ring rounded-md text-base font-semibold tracking-[0.08em] text-white">
              AMRITVELLA
            </Link>
            <span className="rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-steel-100">Direct access</span>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring whitespace-nowrap rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-steel-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
