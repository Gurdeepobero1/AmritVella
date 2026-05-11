import { Flame, Sparkles, Target } from "lucide-react";

const loadingCards = [
  { label: "Routine", icon: Flame },
  { label: "Simran", icon: Sparkles },
  { label: "Work", icon: Target }
];

export default function AppLoading() {
  return (
    <div className="space-y-5" aria-live="polite" aria-busy="true">
      <section className="rounded-[32px] bg-navy-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-saffron-500" />
          Opening today
        </div>
        <div className="mt-8 h-16 w-28 animate-pulse rounded-[16px] bg-white/15" />
        <div className="mt-4 h-4 w-44 animate-pulse rounded-full bg-white/15" />
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {loadingCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-[16px] bg-white/10 p-4">
                <Icon className="h-4 w-4 text-saffron-500" />
                <div className="mt-4 text-sm font-bold">{card.label}</div>
                <div className="mt-3 h-3 w-20 animate-pulse rounded-full bg-white/15" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-[16px] bg-card p-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-steel-300" />
            <div className="mt-5 h-8 w-16 animate-pulse rounded-[12px] bg-steel-300" />
            <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-steel-300" />
          </div>
        ))}
      </section>
    </div>
  );
}
