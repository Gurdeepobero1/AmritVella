import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const [
    appSettings,
    dailyLogs,
    pathCompletions,
    simranSessions,
    careerTasks,
    fitnessLogs,
    emotionalTriggers,
    emergencyModeUsages,
    sevaActions,
    fiveThievesRatings,
    weeklyReviews,
    monthlyReviews,
    journalEntries,
    revenueLogs,
    outreachLogs,
    skillPracticeLogs,
    gurbaniContent,
    playlistLinks
  ] = await Promise.all([
    prisma.appSetting.findMany({ where: { userId } }),
    prisma.dailyLog.findMany({ where: { userId } }),
    prisma.pathCompletion.findMany({ where: { userId } }),
    prisma.simranSession.findMany({ where: { userId } }),
    prisma.careerTask.findMany({ where: { userId } }),
    prisma.fitnessLog.findMany({ where: { userId } }),
    prisma.emotionalTrigger.findMany({ where: { userId } }),
    prisma.emergencyModeUsage.findMany({ where: { userId } }),
    prisma.sevaAction.findMany({ where: { userId } }),
    prisma.fiveThievesRating.findMany({ where: { userId } }),
    prisma.weeklyReview.findMany({ where: { userId } }),
    prisma.monthlyReview.findMany({ where: { userId } }),
    prisma.journalEntry.findMany({ where: { userId } }),
    prisma.revenueLog.findMany({ where: { userId } }),
    prisma.outreachLog.findMany({ where: { userId } }),
    prisma.skillPracticeLog.findMany({ where: { userId } }),
    prisma.gurbaniContent.findMany(),
    prisma.playlistLink.findMany()
  ]);

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      app: "AmritVella",
      version: 1,
      data: {
        appSettings,
        dailyLogs,
        pathCompletions,
        simranSessions,
        careerTasks,
        fitnessLogs,
        emotionalTriggers,
        emergencyModeUsages,
        sevaActions,
        fiveThievesRatings,
        weeklyReviews,
        monthlyReviews,
        journalEntries,
        revenueLogs,
        outreachLogs,
        skillPracticeLogs,
        gurbaniContent,
        playlistLinks
      }
    },
    {
      headers: {
        "content-disposition": `attachment; filename="amritvella-backup-${new Date().toISOString().slice(0, 10)}.json"`
      }
    }
  );
}
