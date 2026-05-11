import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Clock, Flame, Target } from "lucide-react";
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
  const activePathCards = nitnemPathCatalog.filter((path) => activePaths.includes(path.name));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your real daily cockpit: Nitnem, Simran, career execution, emotional control, body discipline, and seva."
        action={
          <Link
            href="/daily"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
          >
            Log today
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="mb-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] bg-navy-950 p-5 text-white sm:p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-steel-300">
            <Flame className="h-4 w-4 text-saffron-500" />
            {toDisplayDate(today)}
          </div>
          <div className="mt-5 text-6xl font-bold tracking-[-0.06em] sm:text-7xl">{metrics.score}</div>
          <div className="mt-1 text-lg font-bold text-white/80">daily score out of 100</div>
          <p className="mt-5 text-xl font-bold tracking-[-0.03em] text-white">{quoteLine}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white">
            <span className="rounded-full bg-white/10 px-3 py-2">{routineModeLabels[routineMode]} mode</span>
            <span className="rounded-full bg-white/10 px-3 py-2">Streak {streak}</span>
            <span className="rounded-full bg-white/10 px-3 py-2">Week avg {weeklyAverage}</span>
            <span className="rounded-full bg-white/10 px-3 py-2">Month avg {monthlyAverage}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
              <CircleAlert className="h-4 w-4 text-saffron-500" />
              Next corrective action
            </div>
            <div className="mt-3 text-3xl font-bold tracking-[-0.04em] text-navy-950">{metrics.weakestArea}</div>
            <p className="mt-2 text-sm leading-6 text-steel-500">{metrics.correctiveAction}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
              <Target className="h-4 w-4 text-saffron-500" />
              Next path
            </div>
            {nextPath ? (
              <>
                <div className="mt-3 text-2xl font-bold tracking-[-0.03em] text-navy-950">{nextPath.name}</div>
                <p className="mt-1 text-sm text-steel-500">{nextPath.period} - {nextPath.defaultDuration} min</p>
                <form action={createPathCompletion} className="mt-4">
                  <input type="hidden" name="date" value={todayInputDate()} readOnly />
                  <input type="hidden" name="pathName" value={nextPath.name} readOnly />
                  <input type="hidden" name="durationMinutes" value={nextPath.defaultDuration} readOnly />
                  <button className="focus-ring inline-flex min-h-11 items-center rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white">
                    Log done
                  </button>
                </form>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-steel-500">All listed paths have at least one completion today.</p>
            )}
          </Card>
        </div>
      </section>

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

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-base font-bold text-navy-950">
            <CheckCircle2 className="h-5 w-5 text-saffron-500" />
            Active Nitnem board
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {activePathCards.map((path) => {
              const done = completedNames.has(path.name);
              return (
                <div key={path.name} className="rounded-[16px] bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-navy-950">{path.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-steel-500">
                        <Clock className="h-3.5 w-3.5" />
                        {path.period} - {path.defaultDuration} min
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${done ? "bg-navy-950 text-white" : "bg-white text-steel-500"}`}>
                      {done ? "Logged" : "Open"}
                    </span>
                  </div>
                  {!done ? (
                    <form action={createPathCompletion} className="mt-3">
                      <input type="hidden" name="date" value={todayInputDate()} readOnly />
                      <input type="hidden" name="pathName" value={path.name} readOnly />
                      <input type="hidden" name="durationMinutes" value={path.defaultDuration} readOnly />
                      <button className="focus-ring w-full rounded-[16px] bg-white px-3 py-2 text-sm font-bold text-navy-950">
                        Mark complete
                      </button>
                    </form>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="text-base font-bold text-navy-950">Completed paths today</div>
          <div className="mt-4 space-y-2">
            {paths.length ? (
              paths.map((path) => (
                <div key={path.id} className="rounded-[16px] bg-card px-3 py-2 text-sm text-steel-500">
                  <span className="font-bold text-navy-950">{path.pathName}</span>
                  <span> - {path.durationMinutes} min</span>
                </div>
              ))
            ) : (
              <p className="rounded-[16px] bg-card p-4 text-sm text-steel-500">No path completion stored today.</p>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-5 xl:col-span-2">
          <div className="text-base font-bold text-navy-950">Career execution today</div>
          <div className="mt-4 space-y-2">
            {career.length ? (
              career.map((task) => (
                <div key={task.id} className="rounded-[16px] bg-card px-3 py-2 text-sm text-steel-500">
                  <span className="font-bold text-navy-950">{task.title}</span>
                  <span> - {task.status.replaceAll("_", " ")}</span>
                </div>
              ))
            ) : (
              <p className="rounded-[16px] bg-card p-4 text-sm text-steel-500">No career task logged today.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
