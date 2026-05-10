import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDateInput } from "@/lib/date";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  const month = request.nextUrl.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const start = parseDateInput(`${month}-01`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  const userId = user.id;
  const [daily, simran, paths, tasks, skills, outreach, revenue, triggers, seva, fitness] = await Promise.all([
    prisma.dailyLog.findMany({ where: { userId, date: { gte: start, lt: end } }, orderBy: { date: "asc" } }),
    prisma.simranSession.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.pathCompletion.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.careerTask.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.skillPracticeLog.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.outreachLog.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.revenueLog.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.emotionalTrigger.findMany({ where: { userId, createdAt: { gte: start, lt: end } } }),
    prisma.sevaAction.findMany({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.fitnessLog.findMany({ where: { userId, date: { gte: start, lt: end } } })
  ]);

  const totalScore = daily.length ? Math.round(daily.reduce((sum, item) => sum + item.totalScore, 0) / daily.length) : 0;
  const markdown = `# AmritVella Monthly Report: ${month}

## Summary
- Average daily score: ${totalScore}
- Simran minutes: ${simran.reduce((sum, item) => sum + item.durationMinutes, 0)}
- Path completions: ${paths.length}
- Career task hours: ${tasks.reduce((sum, item) => sum + Number(item.actualDuration ?? 0), 0).toFixed(2)}
- CAD/CAM practice hours: ${skills.reduce((sum, item) => sum + Number(item.hours), 0).toFixed(2)}
- Outreach actions: ${outreach.length}
- Revenue: ${revenue.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)}
- Emotional triggers: ${triggers.length}
- Relapse count: ${daily.reduce((sum, item) => sum + item.relapseCount, 0)}
- Seva actions: ${seva.length}
- Fitness logs: ${fitness.length}

## Notes
Use this report for monthly review. Gurbani content is intentionally not exported here unless added from verified sources.
`;

  return new NextResponse(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="amritvella-report-${month}.md"`
    }
  });
}
