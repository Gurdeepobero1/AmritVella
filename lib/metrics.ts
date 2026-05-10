import type {
  CareerTask,
  DailyLog,
  EmotionalTrigger,
  FitnessLog,
  PathCompletion,
  SevaAction,
  SimranSession
} from "@prisma/client";
import { routinePaths } from "@/lib/constants";
import { dateKey, todayInputDate } from "@/lib/date";

export function averageScore(logs: Pick<DailyLog, "totalScore">[]) {
  if (!logs.length) return 0;
  return Math.round(logs.reduce((sum, log) => sum + log.totalScore, 0) / logs.length);
}

export function currentStreak(logs: Pick<DailyLog, "date" | "totalScore" | "missedDay">[]) {
  const scored = new Map(logs.map((log) => [dateKey(log.date), log.totalScore > 0 && !log.missedDay]));
  let streak = 0;
  const cursor = new Date(`${todayInputDate()}T00:00:00.000Z`);

  while (scored.get(dateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export function bestStreak(logs: Pick<DailyLog, "date" | "totalScore" | "missedDay">[]) {
  const sorted = [...logs].sort((a, b) => a.date.getTime() - b.date.getTime());
  let best = 0;
  let current = 0;
  let previous: Date | null = null;

  for (const log of sorted) {
    if (log.totalScore <= 0 || log.missedDay) {
      current = 0;
      previous = log.date;
      continue;
    }
    const adjacent = previous ? dateKey(new Date(previous.getTime() + 24 * 60 * 60 * 1000)) === dateKey(log.date) : true;
    current = adjacent ? current + 1 : 1;
    best = Math.max(best, current);
    previous = log.date;
  }

  return best;
}

export function todayDashboardMetrics(input: {
  dailyLog?: DailyLog | null;
  paths: PathCompletion[];
  simran: SimranSession[];
  career: CareerTask[];
  fitness?: FitnessLog | null;
  seva: SevaAction[];
  triggers: EmotionalTrigger[];
  routineMode: "BEGINNER" | "INTERMEDIATE" | "FULL";
}) {
  const requiredPaths = routinePaths[input.routineMode];
  const completedNames = new Set(input.paths.map((path) => path.pathName));
  const nitnemCompleted = requiredPaths.filter((path) => completedNames.has(path)).length;
  const simranMinutes = input.simran.reduce((sum, item) => sum + item.durationMinutes, 0);
  const deepWorkHours = input.career.reduce((sum, item) => sum + Number(item.actualDuration ?? 0), 0);
  const score =
    input.dailyLog?.totalScore ??
    Math.min(30, Math.round((nitnemCompleted / requiredPaths.length) * 24) + (simranMinutes > 0 ? 6 : 0)) +
      Math.min(30, Math.round((deepWorkHours / 3) * 26)) +
      Math.max(0, 20 - input.triggers.filter((trigger) => trigger.didReact).length * 5) +
      (input.fitness?.durationMinutes ? 10 : 0) +
      (input.seva.length ? 10 : 0);

  const weakAreas = [
    { area: "Sikh discipline", value: input.dailyLog?.sikhDisciplineScore ?? nitnemCompleted },
    { area: "Career execution", value: input.dailyLog?.careerExecutionScore ?? deepWorkHours },
    { area: "Emotional control", value: input.dailyLog?.emotionalControlScore ?? (input.triggers.length ? 5 : 20) },
    { area: "Fitness", value: input.dailyLog?.fitnessScore ?? (input.fitness?.durationMinutes ? 10 : 0) },
    { area: "Seva/character", value: input.dailyLog?.sevaCharacterScore ?? input.seva.length }
  ].sort((a, b) => a.value - b.value);

  const weakestArea = weakAreas[0]?.area ?? "No data";
  const correctiveAction =
    weakestArea === "Sikh discipline"
      ? "Complete the next pending path before adding more tasks."
      : weakestArea === "Career execution"
        ? "Block one focused CAD/CAM or defence-sector work session."
        : weakestArea === "Emotional control"
          ? "Use emergency mode before any reactive message."
          : weakestArea === "Fitness"
            ? "Do a minimum walk or strength session today."
            : "Do one private seva or truthful character action.";

  return {
    score: Math.min(100, score),
    nitnemCompleted,
    nitnemTotal: requiredPaths.length,
    simranMinutes,
    deepWorkHours,
    emotionalControlStatus: input.triggers.some((trigger) => trigger.didReact) ? "Reactive moment logged" : "Stable",
    fitnessStatus: input.fitness?.durationMinutes ? "Training logged" : "Not logged",
    sevaStatus: input.seva.length ? "Seva logged" : "Not logged",
    weakestArea,
    correctiveAction
  };
}
