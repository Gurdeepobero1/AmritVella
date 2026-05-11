import { createMonthlyReview, createWeeklyReview } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { dateKey, endOfWeek, startOfMonth, startOfWeek, toDateInput } from "@/lib/date";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";

export default async function ReviewsPage() {
  const user = await requireUser();
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const monthStart = startOfMonth();

  const [weekLogs, tasks, simran, paths, seva, outreach, revenue, dailyLogs, weeklyReviews, monthlyReviews] =
    await prisma.$transaction([
      prisma.dailyLog.findMany({ where: { userId: user.id, date: { gte: weekStart, lte: weekEnd } } }),
      prisma.careerTask.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.simranSession.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.pathCompletion.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.sevaAction.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.outreachLog.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.revenueLog.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.dailyLog.findMany({ where: { userId: user.id, date: { gte: monthStart } } }),
      prisma.weeklyReview.findMany({ where: { userId: user.id }, orderBy: { weekStart: "desc" }, take: 8 }),
      prisma.monthlyReview.findMany({ where: { userId: user.id }, orderBy: { month: "desc" }, take: 8 })
    ]);

  const weeklyAverage = weekLogs.length
    ? Math.round(weekLogs.reduce((sum, log) => sum + log.totalScore, 0) / weekLogs.length)
    : 0;
  const nitnemDays = new Set(paths.map((path) => dateKey(path.date))).size;
  const totalRevenue = revenue.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDeepWorkHours = tasks.reduce((sum, item) => sum + Number(item.actualDuration ?? 0), 0);
  const totalSimranMinutes = simran.reduce((sum, item) => sum + item.durationMinutes, 0);
  const relapses = dailyLogs.reduce((sum, item) => sum + item.relapseCount, 0);

  return (
    <div>
      <PageHeader
        title="Weekly and Monthly Reviews"
        description="Store Sunday reviews and monthly performance summaries permanently."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Weekly review" description="Every Sunday: truth, Naam, honest earning, seva, attachment, career." />
          <form action={createWeeklyReview} className="grid gap-4 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Week start">
                <input className={inputClass} name="weekStart" type="date" defaultValue={toDateInput(weekStart)} />
              </Field>
              <Field label="Week end">
                <input className={inputClass} name="weekEnd" type="date" defaultValue={toDateInput(weekEnd)} />
              </Field>
              <Field label="Score average">
                <input className={inputClass} name="scoreAverage" type="number" min="0" max="100" defaultValue={weeklyAverage} />
              </Field>
            </div>
            <Prompt name="livedTruthfully" label="Did I live truthfully?" />
            <Prompt name="didNaamSimran" label="Did I do Naam Simran?" />
            <Prompt name="earnedHonestly" label="Did I earn honestly?" />
            <Prompt name="served" label="Did I serve?" />
            <Prompt name="reducedAttachment" label="Did I reduce attachment?" />
            <Prompt name="builtCareer" label="Did I build my career?" />
            <Prompt name="improveNextWeek" label="What must improve next week?" />
            <SubmitButton>Save weekly review</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Monthly review" description="Defaults are calculated from this month's stored logs and can be adjusted." />
          <form action={createMonthlyReview} className="grid gap-4 p-4 sm:p-5">
            <Field label="Month">
              <input className={inputClass} name="month" type="month" defaultValue={toDateInput(monthStart).slice(0, 7)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Total deep work hours">
                <input className={inputClass} name="totalDeepWorkHours" type="number" min="0" step="0.25" defaultValue={totalDeepWorkHours.toFixed(2)} />
              </Field>
              <Field label="Total Simran minutes">
                <input className={inputClass} name="totalSimranMinutes" type="number" min="0" defaultValue={totalSimranMinutes} />
              </Field>
              <Field label="Total Nitnem days">
                <input className={inputClass} name="totalNitnemDays" type="number" min="0" defaultValue={nitnemDays} />
              </Field>
              <Field label="Total seva actions">
                <input className={inputClass} name="totalSevaActions" type="number" min="0" defaultValue={seva.length} />
              </Field>
              <Field label="Total outreach">
                <input className={inputClass} name="totalOutreach" type="number" min="0" defaultValue={outreach.length} />
              </Field>
              <Field label="Total revenue">
                <input className={inputClass} name="totalRevenue" type="number" min="0" step="0.01" defaultValue={totalRevenue.toFixed(2)} />
              </Field>
              <Field label="Emotional relapse count">
                <input className={inputClass} name="emotionalRelapseCount" type="number" min="0" defaultValue={relapses} />
              </Field>
            </div>
            <Prompt name="strongestHabit" label="Strongest habit" />
            <Prompt name="weakestHabit" label="Weakest habit" />
            <Prompt name="nextMonthCommitment" label="One commitment for next month" />
            <SubmitButton>Save monthly review</SubmitButton>
          </form>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <CardHeader title="Review history" description="Stored weekly and monthly reviews." />
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-navy-950">Weekly</h3>
            <div className="mt-3 space-y-2">
              {weeklyReviews.length ? (
                weeklyReviews.map((review) => (
                  <div key={review.id} className="rounded-[12px] bg-card px-3 py-2">
                    <div className="text-sm font-bold text-navy-950">
                      {toDateInput(review.weekStart)} to {toDateInput(review.weekEnd)}
                    </div>
                    <div className="mt-1 text-xs text-steel-500">Average: {review.scoreAverage ? Number(review.scoreAverage) : 0}</div>
                  </div>
                ))
              ) : (
                <EmptyState>No weekly reviews yet.</EmptyState>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-950">Monthly</h3>
            <div className="mt-3 space-y-2">
              {monthlyReviews.length ? (
                monthlyReviews.map((review) => (
                  <div key={review.id} className="rounded-[12px] bg-card px-3 py-2">
                    <div className="text-sm font-bold text-navy-950">{toDateInput(review.month).slice(0, 7)}</div>
                    <div className="mt-1 text-xs text-steel-500">
                      Revenue {Number(review.totalRevenue).toFixed(2)} · Simran {review.totalSimranMinutes}m
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState>No monthly reviews yet.</EmptyState>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Prompt({ name, label }: { name: string; label: string }) {
  return (
    <Field label={label}>
      <textarea className={inputClass} name={name} rows={3} />
    </Field>
  );
}
