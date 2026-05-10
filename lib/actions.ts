"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  CareerCategory,
  CareerStatus,
  EmotionalTriggerType,
  FiveThief,
  OutreachStatus,
  SimranMode
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { clamp, isChecked, optionalString, toNumber } from "@/lib/utils";
import { endOfWeek, parseDateInput, startOfMonth, startOfWeek, todayInputDate } from "@/lib/date";
import type { RoutineMode } from "@/lib/constants";

function dateFromForm(formData: FormData, key = "date") {
  return parseDateInput(optionalString(formData.get(key)));
}

function enumValue<T extends string>(value: FormDataEntryValue | null, fallback: T) {
  return typeof value === "string" && value.length ? (value as T) : fallback;
}

export async function registerUser(formData: FormData) {
  const name = optionalString(formData.get("name"));
  const email = optionalString(formData.get("email"))?.toLowerCase();
  const password = optionalString(formData.get("password"));
  const registrationCode = optionalString(formData.get("registrationCode"));

  if (!email || !password || password.length < 8) {
    throw new Error("Email and an 8+ character password are required.");
  }

  const existingUsers = await prisma.user.count();
  const requiredCode = process.env.REGISTRATION_CODE;
  if (existingUsers > 0 && (!requiredCode || registrationCode !== requiredCode)) {
    throw new Error("Registration is locked. Use the private setup code.");
  }
  if (requiredCode && registrationCode !== requiredCode) {
    throw new Error("Invalid registration code.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      appSettings: {
        create: {
          key: "routineMode",
          value: "BEGINNER"
        }
      }
    }
  });

  redirect("/login?registered=1");
}

export async function saveRoutineMode(formData: FormData) {
  const user = await requireUser();
  const mode = enumValue<RoutineMode>(formData.get("mode"), "BEGINNER");

  await prisma.appSetting.upsert({
    where: { userId_key: { userId: user.id, key: "routineMode" } },
    update: { value: mode },
    create: { userId: user.id, key: "routineMode", value: mode }
  });

  revalidatePath("/daily");
  revalidatePath("/dashboard");
}

export async function saveDailyLog(formData: FormData) {
  const user = await requireUser();
  const date = dateFromForm(formData);
  const sikhDisciplineScore = clamp(toNumber(formData.get("sikhDisciplineScore")), 0, 30);
  const careerExecutionScore = clamp(toNumber(formData.get("careerExecutionScore")), 0, 30);
  const emotionalControlScore = clamp(toNumber(formData.get("emotionalControlScore")), 0, 20);
  const fitnessScore = clamp(toNumber(formData.get("fitnessScore")), 0, 10);
  const sevaCharacterScore = clamp(toNumber(formData.get("sevaCharacterScore")), 0, 10);
  const totalScore =
    sikhDisciplineScore + careerExecutionScore + emotionalControlScore + fitnessScore + sevaCharacterScore;

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: {
      sikhDisciplineScore,
      careerExecutionScore,
      emotionalControlScore,
      fitnessScore,
      sevaCharacterScore,
      totalScore,
      noBegging: isChecked(formData, "noBegging"),
      noEmotionalThreat: isChecked(formData, "noEmotionalThreat"),
      noAngryTexting: isChecked(formData, "noAngryTexting"),
      noCheckingObsessing: isChecked(formData, "noCheckingObsessing"),
      noStalking: isChecked(formData, "noStalking"),
      noHookupLustAction: isChecked(formData, "noHookupLustAction"),
      noLying: isChecked(formData, "noLying"),
      noManipulation: isChecked(formData, "noManipulation"),
      waitedBeforeReacting: isChecked(formData, "waitedBeforeReacting"),
      acceptedRealityCalmly: isChecked(formData, "acceptedRealityCalmly"),
      relapseCount: Math.max(0, toNumber(formData.get("relapseCount"))),
      missedDay: isChecked(formData, "missedDay"),
      currentStreakSnapshot: Math.max(0, toNumber(formData.get("currentStreakSnapshot"))),
      notes: optionalString(formData.get("notes"))
    },
    create: {
      userId: user.id,
      date,
      sikhDisciplineScore,
      careerExecutionScore,
      emotionalControlScore,
      fitnessScore,
      sevaCharacterScore,
      totalScore,
      noBegging: isChecked(formData, "noBegging"),
      noEmotionalThreat: isChecked(formData, "noEmotionalThreat"),
      noAngryTexting: isChecked(formData, "noAngryTexting"),
      noCheckingObsessing: isChecked(formData, "noCheckingObsessing"),
      noStalking: isChecked(formData, "noStalking"),
      noHookupLustAction: isChecked(formData, "noHookupLustAction"),
      noLying: isChecked(formData, "noLying"),
      noManipulation: isChecked(formData, "noManipulation"),
      waitedBeforeReacting: isChecked(formData, "waitedBeforeReacting"),
      acceptedRealityCalmly: isChecked(formData, "acceptedRealityCalmly"),
      relapseCount: Math.max(0, toNumber(formData.get("relapseCount"))),
      missedDay: isChecked(formData, "missedDay"),
      currentStreakSnapshot: Math.max(0, toNumber(formData.get("currentStreakSnapshot"))),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/daily");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createPathCompletion(formData: FormData) {
  const user = await requireUser();

  await prisma.pathCompletion.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      pathName: optionalString(formData.get("pathName")) ?? "Waheguru Simran",
      completedAt: optionalString(formData.get("completedAt"))
        ? new Date(String(formData.get("completedAt")))
        : new Date(),
      durationMinutes: Math.max(0, toNumber(formData.get("durationMinutes"))),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/daily");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createJournalEntry(formData: FormData) {
  const user = await requireUser();

  await prisma.journalEntry.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      prompt: optionalString(formData.get("prompt")),
      content: optionalString(formData.get("content")) ?? "",
      mood: optionalString(formData.get("mood")),
      tags: optionalString(formData.get("tags"))
    }
  });

  revalidatePath("/daily");
}

export async function createSimranSession(formData: FormData) {
  const user = await requireUser();
  const now = new Date();
  const startTime = optionalString(formData.get("startTime")) ? new Date(String(formData.get("startTime"))) : now;
  const endTime = optionalString(formData.get("endTime")) ? new Date(String(formData.get("endTime"))) : now;

  await prisma.simranSession.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      startTime,
      endTime,
      durationMinutes: Math.max(0, toNumber(formData.get("durationMinutes"))),
      count: Math.max(0, toNumber(formData.get("count"))),
      mode: enumValue<SimranMode>(formData.get("mode"), SimranMode.TIMER),
      emotionBefore: optionalString(formData.get("emotionBefore")),
      emotionAfter: optionalString(formData.get("emotionAfter")),
      reflection: optionalString(formData.get("reflection"))
    }
  });

  revalidatePath("/simran");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createEmotionalTrigger(formData: FormData) {
  const user = await requireUser();

  await prisma.emotionalTrigger.create({
    data: {
      userId: user.id,
      triggerType: enumValue<EmotionalTriggerType>(formData.get("triggerType"), EmotionalTriggerType.OTHER),
      intensity: clamp(toNumber(formData.get("intensity"), 1), 1, 10),
      response: optionalString(formData.get("response")),
      didReact: isChecked(formData, "didReact"),
      usedEmergencyMode: isChecked(formData, "usedEmergencyMode"),
      lessonLearned: optionalString(formData.get("lessonLearned"))
    }
  });

  revalidatePath("/emotional");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createEmergencyModeUsage(formData: FormData) {
  const user = await requireUser();
  const triggerId = optionalString(formData.get("triggerId"));

  await prisma.emergencyModeUsage.create({
    data: {
      userId: user.id,
      triggerId,
      startedAt: optionalString(formData.get("startedAt")) ? new Date(String(formData.get("startedAt"))) : new Date(),
      completedAt: optionalString(formData.get("completedAt")) ? new Date(String(formData.get("completedAt"))) : null,
      wroteUnsentMessage: isChecked(formData, "wroteUnsentMessage"),
      contactedPersonAfter: isChecked(formData, "contactedPersonAfter"),
      finalDecision: optionalString(formData.get("finalDecision")),
      notes: optionalString(formData.get("notes"))
    }
  });

  if (triggerId) {
    await prisma.emotionalTrigger.updateMany({
      where: { id: triggerId, userId: user.id },
      data: { usedEmergencyMode: true }
    });
  }

  revalidatePath("/emotional");
}

export async function createCareerTask(formData: FormData) {
  const user = await requireUser();

  await prisma.careerTask.create({
    data: {
      userId: user.id,
      title: optionalString(formData.get("title")) ?? "Career task",
      category: enumValue<CareerCategory>(formData.get("category"), CareerCategory.CAD_CAM),
      plannedDuration: toNumber(formData.get("plannedDuration")),
      actualDuration: toNumber(formData.get("actualDuration")),
      status: enumValue<CareerStatus>(formData.get("status"), CareerStatus.PLANNED),
      date: dateFromForm(formData),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/career");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createSkillPracticeLog(formData: FormData) {
  const user = await requireUser();

  await prisma.skillPracticeLog.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      softwareUsed: optionalString(formData.get("softwareUsed")) ?? "CAD/CAM",
      skillCategory: optionalString(formData.get("skillCategory")) ?? "CAD/CAM practice",
      projectName: optionalString(formData.get("projectName")),
      hours: toNumber(formData.get("hours")),
      outputLinkNote: optionalString(formData.get("outputLinkNote")),
      difficulty: optionalString(formData.get("difficulty")) ? clamp(toNumber(formData.get("difficulty")), 1, 10) : null,
      whatImproved: optionalString(formData.get("whatImproved"))
    }
  });

  revalidatePath("/career");
  revalidatePath("/analytics");
}

export async function createOutreachLog(formData: FormData) {
  const user = await requireUser();

  await prisma.outreachLog.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      companyPerson: optionalString(formData.get("companyPerson")) ?? "Unknown contact",
      sector: optionalString(formData.get("sector")),
      contactMethod: optionalString(formData.get("contactMethod")) ?? "Message",
      messageSummary: optionalString(formData.get("messageSummary")),
      followUpDate: optionalString(formData.get("followUpDate")) ? parseDateInput(String(formData.get("followUpDate"))) : null,
      status: enumValue<OutreachStatus>(formData.get("status"), OutreachStatus.PLANNED),
      result: optionalString(formData.get("result")),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/career");
  revalidatePath("/analytics");
}

export async function createRevenueLog(formData: FormData) {
  const user = await requireUser();

  await prisma.revenueLog.create({
    data: {
      userId: user.id,
      date: dateFromForm(formData),
      clientSource: optionalString(formData.get("clientSource")) ?? "Unknown source",
      amount: toNumber(formData.get("amount")),
      category: optionalString(formData.get("category")) ?? "Design/CAD",
      paid: isChecked(formData, "paid"),
      invoiceReference: optionalString(formData.get("invoiceReference")),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/career");
  revalidatePath("/analytics");
}

export async function saveFitnessLog(formData: FormData) {
  const user = await requireUser();
  const date = dateFromForm(formData);

  await prisma.fitnessLog.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: {
      wakeUpTime: optionalString(formData.get("wakeUpTime")),
      sleepTime: optionalString(formData.get("sleepTime")),
      workoutType: optionalString(formData.get("workoutType")),
      durationMinutes: Math.max(0, toNumber(formData.get("durationMinutes"))),
      steps: Math.max(0, toNumber(formData.get("steps"))),
      waterLiters: toNumber(formData.get("waterLiters")),
      cleanFood: isChecked(formData, "cleanFood"),
      noJunk: isChecked(formData, "noJunk"),
      noAlcoholSmoking: isChecked(formData, "noAlcoholSmoking"),
      weightKg: optionalString(formData.get("weightKg")) ? toNumber(formData.get("weightKg")) : null,
      notes: optionalString(formData.get("notes"))
    },
    create: {
      userId: user.id,
      date,
      wakeUpTime: optionalString(formData.get("wakeUpTime")),
      sleepTime: optionalString(formData.get("sleepTime")),
      workoutType: optionalString(formData.get("workoutType")),
      durationMinutes: Math.max(0, toNumber(formData.get("durationMinutes"))),
      steps: Math.max(0, toNumber(formData.get("steps"))),
      waterLiters: toNumber(formData.get("waterLiters")),
      cleanFood: isChecked(formData, "cleanFood"),
      noJunk: isChecked(formData, "noJunk"),
      noAlcoholSmoking: isChecked(formData, "noAlcoholSmoking"),
      weightKg: optionalString(formData.get("weightKg")) ? toNumber(formData.get("weightKg")) : null,
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/fitness");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function saveFiveThievesRating(formData: FormData) {
  const user = await requireUser();
  const date = dateFromForm(formData);
  const thief = enumValue<FiveThief>(formData.get("thief"), FiveThief.MOH);

  await prisma.fiveThievesRating.upsert({
    where: { userId_date_thief: { userId: user.id, date, thief } },
    update: {
      rating: clamp(toNumber(formData.get("rating"), 1), 1, 5),
      trigger: optionalString(formData.get("trigger")),
      correctiveAction: optionalString(formData.get("correctiveAction")),
      sikhPrincipleUsed: optionalString(formData.get("sikhPrincipleUsed"))
    },
    create: {
      userId: user.id,
      date,
      thief,
      rating: clamp(toNumber(formData.get("rating"), 1), 1, 5),
      trigger: optionalString(formData.get("trigger")),
      correctiveAction: optionalString(formData.get("correctiveAction")),
      sikhPrincipleUsed: optionalString(formData.get("sikhPrincipleUsed"))
    }
  });

  revalidatePath("/fitness");
  revalidatePath("/analytics");
}

export async function createSevaAction(formData: FormData) {
  const user = await requireUser();

  await prisma.sevaAction.create({
    data: {
      userId: user.id,
      type: optionalString(formData.get("type")) ?? "Seva",
      date: dateFromForm(formData),
      durationMinutes: optionalString(formData.get("durationMinutes")) ? toNumber(formData.get("durationMinutes")) : null,
      valueAmount: optionalString(formData.get("valueAmount")) ? toNumber(formData.get("valueAmount")) : null,
      privateNotes: optionalString(formData.get("privateNotes")),
      anonymous: isChecked(formData, "anonymous")
    }
  });

  revalidatePath("/fitness");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createWeeklyReview(formData: FormData) {
  const user = await requireUser();
  const requestedStart = optionalString(formData.get("weekStart"));
  const weekStart = requestedStart ? parseDateInput(requestedStart) : startOfWeek();
  const weekEnd = optionalString(formData.get("weekEnd")) ? parseDateInput(String(formData.get("weekEnd"))) : endOfWeek(weekStart);

  await prisma.weeklyReview.upsert({
    where: { userId_weekStart: { userId: user.id, weekStart } },
    update: {
      weekEnd,
      livedTruthfully: optionalString(formData.get("livedTruthfully")),
      didNaamSimran: optionalString(formData.get("didNaamSimran")),
      earnedHonestly: optionalString(formData.get("earnedHonestly")),
      served: optionalString(formData.get("served")),
      reducedAttachment: optionalString(formData.get("reducedAttachment")),
      builtCareer: optionalString(formData.get("builtCareer")),
      improveNextWeek: optionalString(formData.get("improveNextWeek")),
      scoreAverage: optionalString(formData.get("scoreAverage")) ? toNumber(formData.get("scoreAverage")) : null
    },
    create: {
      userId: user.id,
      weekStart,
      weekEnd,
      livedTruthfully: optionalString(formData.get("livedTruthfully")),
      didNaamSimran: optionalString(formData.get("didNaamSimran")),
      earnedHonestly: optionalString(formData.get("earnedHonestly")),
      served: optionalString(formData.get("served")),
      reducedAttachment: optionalString(formData.get("reducedAttachment")),
      builtCareer: optionalString(formData.get("builtCareer")),
      improveNextWeek: optionalString(formData.get("improveNextWeek")),
      scoreAverage: optionalString(formData.get("scoreAverage")) ? toNumber(formData.get("scoreAverage")) : null
    }
  });

  revalidatePath("/reviews");
}

export async function createMonthlyReview(formData: FormData) {
  const user = await requireUser();
  const month = optionalString(formData.get("month"))
    ? parseDateInput(`${String(formData.get("month"))}-01`)
    : startOfMonth();

  await prisma.monthlyReview.upsert({
    where: { userId_month: { userId: user.id, month } },
    update: {
      totalDeepWorkHours: toNumber(formData.get("totalDeepWorkHours")),
      totalSimranMinutes: Math.max(0, toNumber(formData.get("totalSimranMinutes"))),
      totalNitnemDays: Math.max(0, toNumber(formData.get("totalNitnemDays"))),
      totalSevaActions: Math.max(0, toNumber(formData.get("totalSevaActions"))),
      totalOutreach: Math.max(0, toNumber(formData.get("totalOutreach"))),
      totalRevenue: toNumber(formData.get("totalRevenue")),
      emotionalRelapseCount: Math.max(0, toNumber(formData.get("emotionalRelapseCount"))),
      strongestHabit: optionalString(formData.get("strongestHabit")),
      weakestHabit: optionalString(formData.get("weakestHabit")),
      nextMonthCommitment: optionalString(formData.get("nextMonthCommitment"))
    },
    create: {
      userId: user.id,
      month,
      totalDeepWorkHours: toNumber(formData.get("totalDeepWorkHours")),
      totalSimranMinutes: Math.max(0, toNumber(formData.get("totalSimranMinutes"))),
      totalNitnemDays: Math.max(0, toNumber(formData.get("totalNitnemDays"))),
      totalSevaActions: Math.max(0, toNumber(formData.get("totalSevaActions"))),
      totalOutreach: Math.max(0, toNumber(formData.get("totalOutreach"))),
      totalRevenue: toNumber(formData.get("totalRevenue")),
      emotionalRelapseCount: Math.max(0, toNumber(formData.get("emotionalRelapseCount"))),
      strongestHabit: optionalString(formData.get("strongestHabit")),
      weakestHabit: optionalString(formData.get("weakestHabit")),
      nextMonthCommitment: optionalString(formData.get("nextMonthCommitment"))
    }
  });

  revalidatePath("/reviews");
  revalidatePath("/analytics");
}

export async function createGurbaniContent(formData: FormData) {
  await requireUser();

  await prisma.gurbaniContent.create({
    data: {
      title: optionalString(formData.get("title")) ?? "Untitled content",
      category: optionalString(formData.get("category")) ?? "Library",
      gurmukhiText: optionalString(formData.get("gurmukhiText")),
      transliteration: optionalString(formData.get("transliteration")),
      englishMeaning: optionalString(formData.get("englishMeaning")),
      verifiedSourceUrl: optionalString(formData.get("verifiedSourceUrl")),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/library");
}

export async function createPlaylistLink(formData: FormData) {
  await requireUser();

  await prisma.playlistLink.create({
    data: {
      gurbaniContentId: optionalString(formData.get("gurbaniContentId")),
      title: optionalString(formData.get("title")) ?? "Playlist link",
      url: optionalString(formData.get("url")) ?? "https://example.com",
      category: optionalString(formData.get("category")),
      notes: optionalString(formData.get("notes"))
    }
  });

  revalidatePath("/library");
}

export async function deleteUserRecord(model: string, id: string, path = "/dashboard") {
  const user = await requireUser();
  const where = { id, userId: user.id };

  switch (model) {
    case "dailyLog":
      await prisma.dailyLog.deleteMany({ where });
      break;
    case "pathCompletion":
      await prisma.pathCompletion.deleteMany({ where });
      break;
    case "simranSession":
      await prisma.simranSession.deleteMany({ where });
      break;
    case "careerTask":
      await prisma.careerTask.deleteMany({ where });
      break;
    case "fitnessLog":
      await prisma.fitnessLog.deleteMany({ where });
      break;
    case "emotionalTrigger":
      await prisma.emotionalTrigger.deleteMany({ where });
      break;
    case "sevaAction":
      await prisma.sevaAction.deleteMany({ where });
      break;
    case "fiveThievesRating":
      await prisma.fiveThievesRating.deleteMany({ where });
      break;
    case "weeklyReview":
      await prisma.weeklyReview.deleteMany({ where });
      break;
    case "monthlyReview":
      await prisma.monthlyReview.deleteMany({ where });
      break;
    case "journalEntry":
      await prisma.journalEntry.deleteMany({ where });
      break;
    case "revenueLog":
      await prisma.revenueLog.deleteMany({ where });
      break;
    case "outreachLog":
      await prisma.outreachLog.deleteMany({ where });
      break;
    case "skillPracticeLog":
      await prisma.skillPracticeLog.deleteMany({ where });
      break;
    default:
      throw new Error("Unsupported model");
  }

  revalidatePath(path);
}

export async function getDefaultDate() {
  return todayInputDate();
}
