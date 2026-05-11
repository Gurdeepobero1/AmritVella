import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { createJournalEntry, createPathCompletion, saveDailyLog, saveRoutineMode } from "@/lib/actions";
import {
  emotionalChecklist,
  journalPrompts,
  nitnemPathCatalog,
  pathNames,
  routineModeLabels,
  routinePaths
} from "@/lib/constants";
import { parseDateInput, todayInputDate, toDateInput } from "@/lib/date";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function DailyPage() {
  const user = await requireUser();
  const today = parseDateInput(todayInputDate());

  const [setting, dailyLog, todayPaths, recentPaths, recentJournals, simran, career, fitness, seva, triggers] = await prisma.$transaction([
    prisma.appSetting.findUnique({ where: { userId_key: { userId: user.id, key: "routineMode" } } }),
    prisma.dailyLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.pathCompletion.findMany({
      where: { userId: user.id, date: today },
      orderBy: { completedAt: "desc" }
    }),
    prisma.pathCompletion.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      take: 12
    }),
    prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.simranSession.findMany({ where: { userId: user.id, date: today } }),
    prisma.careerTask.findMany({ where: { userId: user.id, date: today } }),
    prisma.fitnessLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.sevaAction.findMany({ where: { userId: user.id, date: today } }),
    prisma.emotionalTrigger.findMany({ where: { userId: user.id, createdAt: { gte: today } } })
  ]);

  const routineMode = setting?.value === "INTERMEDIATE" || setting?.value === "FULL" ? setting.value : "BEGINNER";
  const activePaths = routinePaths[routineMode];
  const completedNames = new Set(todayPaths.map((path) => path.pathName));
  if (simran.length) completedNames.add("Waheguru Simran");
  const activeCompleted = activePaths.filter((path) => completedNames.has(path)).length;
  const careerHours = career.reduce((sum, task) => sum + Number(task.actualDuration ?? 0), 0);
  const suggestedScores = {
    sikh: Math.min(30, Math.round((activeCompleted / activePaths.length) * 30)),
    career: Math.min(30, Math.round((careerHours / 3) * 30)),
    emotional: triggers.some((trigger) => trigger.didReact) ? 12 : 20,
    fitness: fitness?.durationMinutes ? 10 : 0,
    seva: seva.length ? 10 : 0
  };
  const suggestedTotal = Object.values(suggestedScores).reduce((sum, value) => sum + value, 0);

  return (
    <div>
      <PageHeader
        title="Daily Sikh Routine"
        description="Store every path completion, emotional checklist entry, score, and journal note permanently."
      />

      <Card className="mb-5 overflow-hidden">
        <CardHeader
          title="Today's complete Nitnem board"
          description="All paths are visible here. The app stores completions only; verified Gurbani text can be added later in the library."
        />
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nitnemPathCatalog.map((path) => (
            <PathTile
              key={path.name}
              name={path.name}
              period={path.period}
              group={path.group}
              duration={path.defaultDuration}
              focus={path.focus}
              active={activePaths.includes(path.name)}
              completed={completedNames.has(path.name)}
            />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader title="Routine mode" description="Mode changes are stored per user in AppSetting." />
            <form action={saveRoutineMode} className="space-y-4 p-4 sm:p-5">
              <Field label="Active mode">
                <select className={inputClass} name="mode" defaultValue={routineMode}>
                  {Object.entries(routineModeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="rounded-[16px] bg-card px-4 py-3 text-sm font-semibold text-navy-950">
                {routinePaths[routineMode].join(" · ")}
              </div>
              <SubmitButton>Save mode</SubmitButton>
            </form>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Path completion" description="No Gurbani text is stored here, only completion history and notes." />
            <form action={createPathCompletion} className="grid gap-4 p-4 sm:p-5">
              <Field label="Date">
                <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
              </Field>
              <Field label="Path">
                <select className={inputClass} name="pathName">
                  {pathNames.map((path) => (
                    <option key={path} value={path}>
                      {path}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Duration minutes">
                <input className={inputClass} name="durationMinutes" type="number" min="0" defaultValue="15" />
              </Field>
              <Field label="Notes">
                <textarea className={inputClass} name="notes" rows={3} placeholder="Reflection, pronunciation focus, source reminder." />
              </Field>
              <SubmitButton>Log path</SubmitButton>
            </form>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader
            title="Daily score and emotional checklist"
            description="Score weights: Sikh discipline 30, career 30, emotional control 20, fitness 10, seva/character 10."
          />
          <form action={saveDailyLog} className="space-y-5 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Sikh discipline /30">
                <input className={inputClass} name="sikhDisciplineScore" type="number" min="0" max="30" defaultValue={dailyLog?.sikhDisciplineScore ?? suggestedScores.sikh} />
              </Field>
              <Field label="Career execution /30">
                <input className={inputClass} name="careerExecutionScore" type="number" min="0" max="30" defaultValue={dailyLog?.careerExecutionScore ?? suggestedScores.career} />
              </Field>
              <Field label="Emotional control /20">
                <input className={inputClass} name="emotionalControlScore" type="number" min="0" max="20" defaultValue={dailyLog?.emotionalControlScore ?? suggestedScores.emotional} />
              </Field>
              <Field label="Fitness /10">
                <input className={inputClass} name="fitnessScore" type="number" min="0" max="10" defaultValue={dailyLog?.fitnessScore ?? suggestedScores.fitness} />
              </Field>
              <Field label="Seva and character /10">
                <input className={inputClass} name="sevaCharacterScore" type="number" min="0" max="10" defaultValue={dailyLog?.sevaCharacterScore ?? suggestedScores.seva} />
              </Field>
              <Field label="Relapse count">
                <input className={inputClass} name="relapseCount" type="number" min="0" defaultValue={dailyLog?.relapseCount ?? 0} />
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {emotionalChecklist.map(([key, label]) => (
                <label key={key} className="flex items-start gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
                  <input className="mt-1 h-4 w-4 accent-saffron-500" name={key} type="checkbox" defaultChecked={Boolean(dailyLog?.[key])} />
                  <span>{label}</span>
                </label>
              ))}
              <label className="flex items-start gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
                <input className="mt-1 h-4 w-4 accent-saffron-500" name="missedDay" type="checkbox" defaultChecked={Boolean(dailyLog?.missedDay)} />
                <span>Mark as missed day</span>
              </label>
            </div>
            <Field label="Current streak snapshot">
              <input className={inputClass} name="currentStreakSnapshot" type="number" min="0" defaultValue={dailyLog?.currentStreakSnapshot ?? 0} />
            </Field>
            <Field label="Daily notes">
              <textarea className={inputClass} name="notes" rows={4} defaultValue={dailyLog?.notes ?? ""} />
            </Field>
            <div className="rounded-[16px] bg-card px-4 py-3 text-sm font-semibold text-navy-950">
              Suggested score from today&apos;s stored activity: {dailyLog?.totalScore ?? suggestedTotal}/100
            </div>
            <SubmitButton>Save daily log</SubmitButton>
          </form>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Journal entry" description="Use one of the discipline prompts or write your own." />
          <form action={createJournalEntry} className="space-y-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <Field label="Prompt">
              <select className={inputClass} name="prompt">
                {journalPrompts.map((prompt) => (
                  <option key={prompt} value={prompt}>
                    {prompt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Journal note">
              <textarea className={inputClass} name="content" rows={5} required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Mood">
                <input className={inputClass} name="mood" placeholder="Stable, restless, grateful" />
              </Field>
              <Field label="Tags">
                <input className={inputClass} name="tags" placeholder="attachment, work, seva" />
              </Field>
            </div>
            <SubmitButton>Save journal</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Recent history" description="Latest stored path and journal records." />
          <div className="space-y-5 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-semibold text-navy-950">Path completions</h3>
              <div className="mt-3 space-y-2">
                {recentPaths.length ? (
                  recentPaths.map((path) => (
                    <div key={path.id} className="flex items-center justify-between gap-3 rounded-[16px] bg-card px-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-navy-950">{path.pathName}</div>
                        <div className="text-xs text-steel-500">
                          {toDateInput(path.date)} · {path.durationMinutes} min
                        </div>
                      </div>
                      <DeleteButton model="pathCompletion" id={path.id} path="/daily" />
                    </div>
                  ))
                ) : (
                  <EmptyState>No path completions yet.</EmptyState>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-950">Journal entries</h3>
              <div className="mt-3 space-y-2">
                {recentJournals.length ? (
                  recentJournals.map((entry) => (
                    <div key={entry.id} className="rounded-[16px] bg-card px-3 py-2">
                      <div className="text-xs text-steel-500">{toDateInput(entry.date)}</div>
                      <p className="mt-1 line-clamp-3 text-sm text-navy-950">{entry.content}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState>No journal entries yet.</EmptyState>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PathTile({
  name,
  period,
  group,
  duration,
  focus,
  active,
  completed
}: {
  name: string;
  period: string;
  group: string;
  duration: number;
  focus: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <article className={`flex min-h-56 flex-col justify-between rounded-[16px] p-4 ${completed ? "bg-navy-950 text-white" : "bg-card text-navy-950"}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${completed ? "bg-white text-navy-950" : active ? "bg-navy-950 text-white" : "bg-white text-steel-500"}`}>
            {completed ? "Logged today" : active ? "Active mode" : "Full path"}
          </span>
          <span className={`text-xs font-bold ${completed ? "text-white/70" : "text-steel-500"}`}>{duration}m</span>
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-[-0.03em]">{name}</h2>
        <p className={`mt-1 text-sm font-semibold ${completed ? "text-white/70" : "text-steel-500"}`}>{group} - {period}</p>
        <p className={`mt-3 text-sm leading-5 ${completed ? "text-white/75" : "text-steel-500"}`}>{focus}</p>
      </div>
      <form action={createPathCompletion} className="mt-4">
        <input type="hidden" name="date" value={todayInputDate()} readOnly />
        <input type="hidden" name="pathName" value={name} readOnly />
        <input type="hidden" name="durationMinutes" value={duration} readOnly />
        <button
          className={`focus-ring w-full rounded-[16px] px-4 py-3 text-sm font-bold ${completed ? "bg-white text-navy-950" : "bg-saffron-500 text-white"}`}
        >
          {completed ? "Log another round" : "Mark complete"}
        </button>
      </form>
    </article>
  );
}
