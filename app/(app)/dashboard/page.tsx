import Link from "next/link";
import { ArrowRight, CircleAlert, Flame, Target } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { averageScore, currentStreak, todayDashboardMetrics } from "@/lib/metrics";
import { daysAgo, startOfMonth, todayInputDate, toDisplayDate, parseDateInput } from "@/lib/date";
import { nitnemPathCatalog, quoteLine, routineModeLabels, routinePaths } from "@/lib/constants";
import { createPathCompletion } from "@/lib/actions";
import { Card, PageHeader, StatCard } from "@/components/ui/primitives";

export default async function DashboardPage() {
  const user = await requireUser();
  const today = parseDateInput(todayInputDate());
  const weekStart = daysAgo(6);
  const monthStart = startOfMonth();

  const [
    setting,
    dailyLog,
    paths,
    simran,
    career,
    fitness,
    seva,
    triggers,
    weekLogs,
    monthLogs,
    allLogs
  ] = await prisma.$transaction([
    prisma.appSetting.findUnique({ where: { userId_key: { userId: user.id, key: "routineMode" } } }),
    prisma.dailyLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.pathCompletion.findMany({ where: { userId: user.id, date: today }, orderBy: { completedAt: "desc" } }),
    prisma.simranSession.findMany({ where: { userId: user.id, date: today } }),
    prisma.careerTask.findMany({ where: { userId: user.id, date: today } }),
    prisma.fitnessLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.sevaAction.findMany({ where: { userId: user.id, date: today } }),
    prisma.emotionalTrigger.findMany({
      where: { userId: user.id, createdAt: { gte: today } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.dailyLog.findMany({ where: { userId: user.id, date: { gte: weekStart } } }),
    prisma.dailyLog.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
    prisma.dailyLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } })
  ]);

  const routineMode = setting?.value === "INTERMEDIATE" || setting?.value === "FULL" ? setting.value : "BEGINNER";
  const metrics = todayDashboardMetrics({
    dailyLog,
    paths,
    simran,
    career,
    fitness,
    seva,
    triggers,
    routineMode
  });

  const streak = currentStreak(allLogs);
  const weeklyAverage = averageScore(weekLogs);
  const monthlyAverage = averageScore(monthLogs);
  const activePaths = routinePaths[routineMode];
  const completedNames = new Set(paths.map((path) => path.pathName));
  if (simran.length) completedNames.add("Waheguru Simran");
  const nextPath =
    nitnemPathCatalog.find((path) => activePaths.includes(path.name) && !completedNames.has(path.name)) ??
    nitnemPathCatalog.find((path) => !completedNames.has(path.name));

  return (
    <div>
      <PageHeader
        title="Today"
        description="A quiet view of what matters now."
        action={
          <Link
            href="/daily"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
          >
            Open routine
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="mb-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[32px] bg-navy-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-steel-300">
            <Flame className="h-4 w-4 text-saffron-500" />
            {toDisplayDate(today)}
          </div>
          <div className="mt-6 text-7xl font-bold tracking-[-0.06em]">{metrics.score}</div>
          <div className="mt-1 text-sm font-semibold text-white/70">score out of 100</div>
          <p className="mt-8 max-w-sm text-xl font-bold tracking-[-0.03em] text-white">{quoteLine}</p>
          <div className="mt-6 text-sm text-white/70">
            {routineModeLabels[routineMode]} mode · streak {streak} · week {weeklyAverage}
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
                <Target className="h-4 w-4 text-saffron-500" />
                Next path
              </div>
              {nextPath ? (
                <>
                  <div className="mt-3 text-3xl font-bold tracking-[-0.04em] text-navy-950">{nextPath.name}</div>
                  <p className="mt-1 text-sm text-steel-500">{nextPath.period} · {nextPath.defaultDuration} min</p>
                  <form action={createPathCompletion} className="mt-5">
                    <input type="hidden" name="date" value={todayInputDate()} readOnly />
                    <input type="hidden" name="pathName" value={nextPath.name} readOnly />
                    <input type="hidden" name="durationMinutes" value={nextPath.defaultDuration} readOnly />
                    <button className="focus-ring inline-flex min-h-11 items-center rounded-full bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white">
                      Mark done
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-steel-500">All active paths are logged today.</p>
              )}
            </div>
            <div className="border-t border-hairline pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
                <CircleAlert className="h-4 w-4 text-saffron-500" />
                Correction
              </div>
              <div className="mt-3 text-2xl font-bold tracking-[-0.03em] text-navy-950">{metrics.weakestArea}</div>
              <p className="mt-2 text-sm leading-6 text-steel-500">{metrics.correctiveAction}</p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nitnem" value={`${metrics.nitnemCompleted}/${metrics.nitnemTotal}`} detail="Active routine" />
        <StatCard label="Simran" value={`${metrics.simranMinutes}m`} detail="Today" />
        <StatCard label="Deep work" value={`${metrics.deepWorkHours.toFixed(1)}h`} detail="Career focus" />
        <StatCard label="Emotional state" value={metrics.emotionalControlStatus} detail="Today" />
      </div>

      <Card className="mt-5 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <SummaryRow label="Fitness" value={metrics.fitnessStatus} />
          <SummaryRow label="Seva" value={metrics.sevaStatus} />
          <SummaryRow label="Monthly average" value={monthlyAverage} />
          <SummaryRow label="Completed paths" value={paths.length ? paths.map((path) => path.pathName).join(", ") : "None yet"} />
        </div>
      </Card>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] bg-card px-4 py-3">
      <div className="text-sm font-semibold text-steel-500">{label}</div>
      <div className="min-w-0 truncate text-right text-sm font-bold text-navy-950">{value}</div>
    </div>
  );
}
