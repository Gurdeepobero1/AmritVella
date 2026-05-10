import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { currentStreak } from "@/lib/metrics";
import { dateKey } from "@/lib/date";
import { PageHeader } from "@/components/ui/primitives";
import { AnalyticsClient } from "@/components/analytics-client";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const [dailyLogs, simran, tasks, skills, outreach, revenue, triggers, seva, fitness, thieves] = await Promise.all([
    prisma.dailyLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.simranSession.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.careerTask.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.skillPracticeLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.outreachLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.revenueLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.emotionalTrigger.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.sevaAction.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.fitnessLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.fiveThievesRating.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } })
  ]);

  const keys = new Set<string>();
  dailyLogs.forEach((item) => keys.add(dateKey(item.date)));
  simran.forEach((item) => keys.add(dateKey(item.date)));
  tasks.forEach((item) => keys.add(dateKey(item.date)));
  skills.forEach((item) => keys.add(dateKey(item.date)));
  outreach.forEach((item) => keys.add(dateKey(item.date)));
  revenue.forEach((item) => keys.add(dateKey(item.date)));
  triggers.forEach((item) => keys.add(dateKey(item.createdAt)));
  seva.forEach((item) => keys.add(dateKey(item.date)));
  fitness.forEach((item) => keys.add(dateKey(item.date)));
  thieves.forEach((item) => keys.add(dateKey(item.date)));

  const daily = dailyLogs.map((item) => ({
    date: dateKey(item.date),
    score: item.totalScore,
    sikh: item.sikhDisciplineScore,
    career: item.careerExecutionScore,
    emotional: item.emotionalControlScore,
    fitness: item.fitnessScore,
    seva: item.sevaCharacterScore,
    relapse: item.relapseCount,
    missed: item.missedDay
  }));

  const activity = Array.from(keys)
    .sort()
    .map((key) => {
      const thiefRows = thieves.filter((item) => dateKey(item.date) === key);
      return {
        date: key,
        simranMinutes: simran.filter((item) => dateKey(item.date) === key).reduce((sum, item) => sum + item.durationMinutes, 0),
        careerHours: tasks.filter((item) => dateKey(item.date) === key).reduce((sum, item) => sum + Number(item.actualDuration ?? 0), 0),
        cadCamHours:
          skills
            .filter((item) => dateKey(item.date) === key && item.skillCategory.toLowerCase().includes("cad"))
            .reduce((sum, item) => sum + Number(item.hours), 0) +
          tasks
            .filter((item) => dateKey(item.date) === key && item.category === "CAD_CAM")
            .reduce((sum, item) => sum + Number(item.actualDuration ?? 0), 0),
        outreach: outreach.filter((item) => dateKey(item.date) === key).length,
        revenue: revenue.filter((item) => dateKey(item.date) === key).reduce((sum, item) => sum + Number(item.amount), 0),
        triggers: triggers.filter((item) => dateKey(item.createdAt) === key).length,
        seva: seva.filter((item) => dateKey(item.date) === key).length,
        fitness: fitness.filter((item) => dateKey(item.date) === key && item.durationMinutes > 0).length,
        fiveThievesAvg: thiefRows.length ? Number((thiefRows.reduce((sum, item) => sum + item.rating, 0) / thiefRows.length).toFixed(2)) : 0
      };
    });

  return (
    <div>
      <PageHeader
        title="Analytics and Full History"
        description="Daily score trend, averages, Simran, Nitnem, career, CAD/CAM, outreach, revenue, triggers, relapse, five thieves, seva, fitness, streaks, and missed days."
      />
      <AnalyticsClient daily={daily} activity={activity} currentStreak={currentStreak(dailyLogs)} />
    </div>
  );
}
