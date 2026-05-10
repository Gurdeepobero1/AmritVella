import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Row = Record<string, unknown>;

function userRows(rows: unknown, userId: string) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const clean = { ...(row as Row) };
    delete clean.user;
    clean.userId = userId;
    return clean;
  });
}

function rows(input: unknown) {
  return Array.isArray(input) ? (input as Row[]) : [];
}

async function createManyIfAny<T>(items: T[], create: (items: T[]) => Promise<unknown>) {
  if (items.length) {
    await create(items);
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = body.data ?? body;
  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    await createManyIfAny(userRows(data.appSettings, userId) as Prisma.AppSettingCreateManyInput[], (items) => tx.appSetting.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.dailyLogs, userId) as Prisma.DailyLogCreateManyInput[], (items) => tx.dailyLog.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.pathCompletions, userId) as Prisma.PathCompletionCreateManyInput[], (items) => tx.pathCompletion.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.simranSessions, userId) as Prisma.SimranSessionCreateManyInput[], (items) => tx.simranSession.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.careerTasks, userId) as Prisma.CareerTaskCreateManyInput[], (items) => tx.careerTask.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.fitnessLogs, userId) as Prisma.FitnessLogCreateManyInput[], (items) => tx.fitnessLog.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.emotionalTriggers, userId) as Prisma.EmotionalTriggerCreateManyInput[], (items) => tx.emotionalTrigger.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.emergencyModeUsages, userId) as Prisma.EmergencyModeUsageCreateManyInput[], (items) => tx.emergencyModeUsage.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.sevaActions, userId) as Prisma.SevaActionCreateManyInput[], (items) => tx.sevaAction.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.fiveThievesRatings, userId) as Prisma.FiveThievesRatingCreateManyInput[], (items) => tx.fiveThievesRating.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.weeklyReviews, userId) as Prisma.WeeklyReviewCreateManyInput[], (items) => tx.weeklyReview.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.monthlyReviews, userId) as Prisma.MonthlyReviewCreateManyInput[], (items) => tx.monthlyReview.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.journalEntries, userId) as Prisma.JournalEntryCreateManyInput[], (items) => tx.journalEntry.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.revenueLogs, userId) as Prisma.RevenueLogCreateManyInput[], (items) => tx.revenueLog.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.outreachLogs, userId) as Prisma.OutreachLogCreateManyInput[], (items) => tx.outreachLog.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(userRows(data.skillPracticeLogs, userId) as Prisma.SkillPracticeLogCreateManyInput[], (items) => tx.skillPracticeLog.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(rows(data.gurbaniContent) as Prisma.GurbaniContentCreateManyInput[], (items) => tx.gurbaniContent.createMany({ data: items, skipDuplicates: true }));
    await createManyIfAny(rows(data.playlistLinks) as Prisma.PlaylistLinkCreateManyInput[], (items) => tx.playlistLink.createMany({ data: items, skipDuplicates: true }));
  });

  return NextResponse.json({ ok: true });
}
