import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { averageScore, currentStreak, todayDashboardMetrics } from "@/lib/metrics";
import { daysAgo, startOfMonth, todayInputDate, toDisplayDate, parseDateInput } from "@/lib/date";
import { quoteLine, routineModeLabels } from "@/lib/constants";
import { DarkCard, PageHeader, StatCard } from "@/components/ui/primitives";

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
  ] = await Promise.all([
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="One command center for Sikh discipline, emotional steadiness, career execution, fitness, and seva."
        action={
          <Link
            href="/daily"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950"
          >
            Log today
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <DarkCard className="mb-5 overflow-hidden">
        <div className="grid gap-4 p-4 sm:grid-cols-[1.3fr_0.7fr] sm:p-6">
          <div>
            <div className="text-sm text-steel-300">{toDisplayDate(today)}</div>
            <div className="mt-3 text-5xl font-semibold tracking-tight text-white">{metrics.score}/100</div>
            <p className="mt-3 text-lg font-medium text-saffron-500">{quoteLine}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-steel-100">
              <span className="rounded-md border border-white/10 px-2 py-1">{routineModeLabels[routineMode]}</span>
              <span className="rounded-md border border-white/10 px-2 py-1">Current streak: {streak}</span>
              <span className="rounded-md border border-white/10 px-2 py-1">Weekly avg: {weeklyAverage}</span>
              <span className="rounded-md border border-white/10 px-2 py-1">Monthly avg: {monthlyAverage}</span>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-navy-950/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CircleAlert className="h-4 w-4 text-saffron-500" />
              Corrective action
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{metrics.weakestArea}</div>
            <p className="mt-2 text-sm leading-6 text-steel-300">{metrics.correctiveAction}</p>
          </div>
        </div>
      </DarkCard>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Nitnem progress" value={`${metrics.nitnemCompleted}/${metrics.nitnemTotal}`} detail="Required paths for active mode" />
        <StatCard label="Simran today" value={`${metrics.simranMinutes}m`} detail="Minutes stored in sessions" />
        <StatCard label="Career deep work" value={`${metrics.deepWorkHours.toFixed(1)}h`} detail="Actual career task duration" />
        <StatCard label="Emotional control" value={metrics.emotionalControlStatus} detail="Based on today's triggers" />
        <StatCard label="Fitness" value={metrics.fitnessStatus} detail="Workout and health log" />
        <StatCard label="Seva" value={metrics.sevaStatus} detail="Character/service action" />
        <StatCard label="Current streak" value={streak} detail="Consecutive scored days" />
        <StatCard label="Weekly / monthly" value={`${weeklyAverage} / ${monthlyAverage}`} detail="Average daily score" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DarkCard className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-base font-semibold text-white">
            <CheckCircle2 className="h-5 w-5 text-saffron-500" />
            Completed paths today
          </div>
          <div className="mt-4 space-y-2">
            {paths.length ? (
              paths.map((path) => (
                <div key={path.id} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-steel-100">
                  <span className="font-medium text-white">{path.pathName}</span>
                  <span className="text-steel-400"> · {path.durationMinutes} min</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-steel-300">No path completion stored today.</p>
            )}
          </div>
        </DarkCard>

        <DarkCard className="p-4 sm:p-5">
          <div className="text-base font-semibold text-white">Career execution today</div>
          <div className="mt-4 space-y-2">
            {career.length ? (
              career.map((task) => (
                <div key={task.id} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-steel-100">
                  <span className="font-medium text-white">{task.title}</span>
                  <span className="text-steel-400"> · {task.status.replaceAll("_", " ")}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-steel-300">No career task logged today.</p>
            )}
          </div>
        </DarkCard>
      </div>
    </div>
  );
}
