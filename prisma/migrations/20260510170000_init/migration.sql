-- CreateEnum
CREATE TYPE "SimranMode" AS ENUM ('TIMER', 'MALA', 'CUSTOM', 'SILENT');

-- CreateEnum
CREATE TYPE "CareerCategory" AS ENUM ('CAD_CAM', 'GD_T', 'DEFENCE_RESEARCH', 'OUTREACH', 'PORTFOLIO', 'EXAM_PREP', 'BUSINESS_DEV', 'READING');

-- CreateEnum
CREATE TYPE "CareerStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE', 'SKIPPED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "EmotionalTriggerType" AS ENUM ('ATTACHMENT', 'ANGER', 'FEAR', 'LONELINESS', 'LUST', 'FAMILY', 'WORK', 'CAREER', 'OTHER');

-- CreateEnum
CREATE TYPE "FiveThief" AS ENUM ('KAAM', 'KRODH', 'LOBH', 'MOH', 'AHANKAR');

-- CreateEnum
CREATE TYPE "OutreachStatus" AS ENUM ('PLANNED', 'SENT', 'FOLLOW_UP', 'WON', 'LOST', 'NO_RESPONSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sikhDisciplineScore" INTEGER NOT NULL DEFAULT 0,
    "careerExecutionScore" INTEGER NOT NULL DEFAULT 0,
    "emotionalControlScore" INTEGER NOT NULL DEFAULT 0,
    "fitnessScore" INTEGER NOT NULL DEFAULT 0,
    "sevaCharacterScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "noBegging" BOOLEAN NOT NULL DEFAULT false,
    "noEmotionalThreat" BOOLEAN NOT NULL DEFAULT false,
    "noAngryTexting" BOOLEAN NOT NULL DEFAULT false,
    "noCheckingObsessing" BOOLEAN NOT NULL DEFAULT false,
    "noStalking" BOOLEAN NOT NULL DEFAULT false,
    "noHookupLustAction" BOOLEAN NOT NULL DEFAULT false,
    "noLying" BOOLEAN NOT NULL DEFAULT false,
    "noManipulation" BOOLEAN NOT NULL DEFAULT false,
    "waitedBeforeReacting" BOOLEAN NOT NULL DEFAULT false,
    "acceptedRealityCalmly" BOOLEAN NOT NULL DEFAULT false,
    "relapseCount" INTEGER NOT NULL DEFAULT 0,
    "missedDay" BOOLEAN NOT NULL DEFAULT false,
    "currentStreakSnapshot" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "pathName" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimranSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "mode" "SimranMode" NOT NULL,
    "emotionBefore" TEXT,
    "emotionAfter" TEXT,
    "reflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimranSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "CareerCategory" NOT NULL,
    "plannedDuration" DECIMAL(6,2),
    "actualDuration" DECIMAL(6,2),
    "status" "CareerStatus" NOT NULL DEFAULT 'PLANNED',
    "date" DATE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FitnessLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "wakeUpTime" TEXT,
    "sleepTime" TEXT,
    "workoutType" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "steps" INTEGER NOT NULL DEFAULT 0,
    "waterLiters" DECIMAL(5,2),
    "cleanFood" BOOLEAN NOT NULL DEFAULT false,
    "noJunk" BOOLEAN NOT NULL DEFAULT false,
    "noAlcoholSmoking" BOOLEAN NOT NULL DEFAULT false,
    "weightKg" DECIMAL(6,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FitnessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalTrigger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerType" "EmotionalTriggerType" NOT NULL,
    "intensity" INTEGER NOT NULL,
    "response" TEXT,
    "didReact" BOOLEAN NOT NULL DEFAULT false,
    "usedEmergencyMode" BOOLEAN NOT NULL DEFAULT false,
    "lessonLearned" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionalTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyModeUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "wroteUnsentMessage" BOOLEAN NOT NULL DEFAULT false,
    "contactedPersonAfter" BOOLEAN NOT NULL DEFAULT false,
    "finalDecision" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyModeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SevaAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "durationMinutes" INTEGER,
    "valueAmount" DECIMAL(10,2),
    "privateNotes" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SevaAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiveThievesRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "thief" "FiveThief" NOT NULL,
    "rating" INTEGER NOT NULL,
    "trigger" TEXT,
    "correctiveAction" TEXT,
    "sikhPrincipleUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiveThievesRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "weekEnd" DATE NOT NULL,
    "livedTruthfully" TEXT,
    "didNaamSimran" TEXT,
    "earnedHonestly" TEXT,
    "served" TEXT,
    "reducedAttachment" TEXT,
    "builtCareer" TEXT,
    "improveNextWeek" TEXT,
    "scoreAverage" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "totalDeepWorkHours" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "totalSimranMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalNitnemDays" INTEGER NOT NULL DEFAULT 0,
    "totalSevaActions" INTEGER NOT NULL DEFAULT 0,
    "totalOutreach" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "emotionalRelapseCount" INTEGER NOT NULL DEFAULT 0,
    "strongestHabit" TEXT,
    "weakestHabit" TEXT,
    "nextMonthCommitment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "prompt" TEXT,
    "content" TEXT NOT NULL,
    "mood" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "clientSource" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "category" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "invoiceReference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "companyPerson" TEXT NOT NULL,
    "sector" TEXT,
    "contactMethod" TEXT NOT NULL,
    "messageSummary" TEXT,
    "followUpDate" DATE,
    "status" "OutreachStatus" NOT NULL DEFAULT 'PLANNED',
    "result" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillPracticeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "softwareUsed" TEXT NOT NULL,
    "skillCategory" TEXT NOT NULL,
    "projectName" TEXT,
    "hours" DECIMAL(6,2) NOT NULL,
    "outputLinkNote" TEXT,
    "difficulty" INTEGER,
    "whatImproved" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillPracticeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GurbaniContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gurmukhiText" TEXT,
    "transliteration" TEXT,
    "englishMeaning" TEXT,
    "verifiedSourceUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GurbaniContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistLink" (
    "id" TEXT NOT NULL,
    "gurbaniContentId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_userId_date_idx" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE INDEX "PathCompletion_userId_date_idx" ON "PathCompletion"("userId", "date");

-- CreateIndex
CREATE INDEX "PathCompletion_userId_pathName_idx" ON "PathCompletion"("userId", "pathName");

-- CreateIndex
CREATE INDEX "SimranSession_userId_date_idx" ON "SimranSession"("userId", "date");

-- CreateIndex
CREATE INDEX "CareerTask_userId_date_idx" ON "CareerTask"("userId", "date");

-- CreateIndex
CREATE INDEX "CareerTask_userId_category_idx" ON "CareerTask"("userId", "category");

-- CreateIndex
CREATE INDEX "FitnessLog_userId_date_idx" ON "FitnessLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FitnessLog_userId_date_key" ON "FitnessLog"("userId", "date");

-- CreateIndex
CREATE INDEX "EmotionalTrigger_userId_createdAt_idx" ON "EmotionalTrigger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "EmotionalTrigger_userId_triggerType_idx" ON "EmotionalTrigger"("userId", "triggerType");

-- CreateIndex
CREATE INDEX "EmergencyModeUsage_userId_startedAt_idx" ON "EmergencyModeUsage"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "SevaAction_userId_date_idx" ON "SevaAction"("userId", "date");

-- CreateIndex
CREATE INDEX "FiveThievesRating_userId_date_idx" ON "FiveThievesRating"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FiveThievesRating_userId_date_thief_key" ON "FiveThievesRating"("userId", "date", "thief");

-- CreateIndex
CREATE INDEX "WeeklyReview_userId_weekStart_idx" ON "WeeklyReview"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReview_userId_weekStart_key" ON "WeeklyReview"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "MonthlyReview_userId_month_idx" ON "MonthlyReview"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReview_userId_month_key" ON "MonthlyReview"("userId", "month");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_date_idx" ON "JournalEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "RevenueLog_userId_date_idx" ON "RevenueLog"("userId", "date");

-- CreateIndex
CREATE INDEX "OutreachLog_userId_date_idx" ON "OutreachLog"("userId", "date");

-- CreateIndex
CREATE INDEX "OutreachLog_userId_status_idx" ON "OutreachLog"("userId", "status");

-- CreateIndex
CREATE INDEX "SkillPracticeLog_userId_date_idx" ON "SkillPracticeLog"("userId", "date");

-- CreateIndex
CREATE INDEX "SkillPracticeLog_userId_skillCategory_idx" ON "SkillPracticeLog"("userId", "skillCategory");

-- CreateIndex
CREATE INDEX "GurbaniContent_category_idx" ON "GurbaniContent"("category");

-- CreateIndex
CREATE UNIQUE INDEX "GurbaniContent_title_category_key" ON "GurbaniContent"("title", "category");

-- CreateIndex
CREATE INDEX "PlaylistLink_category_idx" ON "PlaylistLink"("category");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_userId_key_key" ON "AppSetting"("userId", "key");

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathCompletion" ADD CONSTRAINT "PathCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimranSession" ADD CONSTRAINT "SimranSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerTask" ADD CONSTRAINT "CareerTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FitnessLog" ADD CONSTRAINT "FitnessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionalTrigger" ADD CONSTRAINT "EmotionalTrigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyModeUsage" ADD CONSTRAINT "EmergencyModeUsage_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "EmotionalTrigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyModeUsage" ADD CONSTRAINT "EmergencyModeUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SevaAction" ADD CONSTRAINT "SevaAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiveThievesRating" ADD CONSTRAINT "FiveThievesRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReview" ADD CONSTRAINT "WeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyReview" ADD CONSTRAINT "MonthlyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueLog" ADD CONSTRAINT "RevenueLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachLog" ADD CONSTRAINT "OutreachLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillPracticeLog" ADD CONSTRAINT "SkillPracticeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistLink" ADD CONSTRAINT "PlaylistLink_gurbaniContentId_fkey" FOREIGN KEY ("gurbaniContentId") REFERENCES "GurbaniContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSetting" ADD CONSTRAINT "AppSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
