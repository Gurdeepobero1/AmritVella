import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { createJournalEntry, createPathCompletion, saveDailyLog, saveRoutineMode } from "@/lib/actions";
import { emotionalChecklist, journalPrompts, pathNames, routineModeLabels, routinePaths } from "@/lib/constants";
import { parseDateInput, todayInputDate, toDateInput } from "@/lib/date";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function DailyPage() {
  const user = await requireUser();
  const today = parseDateInput(todayInputDate());

  const [setting, dailyLog, recentPaths, recentJournals] = await Promise.all([
    prisma.appSetting.findUnique({ where: { userId_key: { userId: user.id, key: "routineMode" } } }),
    prisma.dailyLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.pathCompletion.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      take: 12
    }),
    prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  const routineMode = setting?.value === "INTERMEDIATE" || setting?.value === "FULL" ? setting.value : "BEGINNER";

  return (
    <div>
      <PageHeader
        title="Daily Sikh Routine"
        description="Store every path completion, emotional checklist entry, score, and journal note permanently."
      />

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
              <div className="rounded-md bg-navy-950 px-3 py-3 text-sm text-steel-100">
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
                <input className={inputClass} name="sikhDisciplineScore" type="number" min="0" max="30" defaultValue={dailyLog?.sikhDisciplineScore ?? 0} />
              </Field>
              <Field label="Career execution /30">
                <input className={inputClass} name="careerExecutionScore" type="number" min="0" max="30" defaultValue={dailyLog?.careerExecutionScore ?? 0} />
              </Field>
              <Field label="Emotional control /20">
                <input className={inputClass} name="emotionalControlScore" type="number" min="0" max="20" defaultValue={dailyLog?.emotionalControlScore ?? 0} />
              </Field>
              <Field label="Fitness /10">
                <input className={inputClass} name="fitnessScore" type="number" min="0" max="10" defaultValue={dailyLog?.fitnessScore ?? 0} />
              </Field>
              <Field label="Seva and character /10">
                <input className={inputClass} name="sevaCharacterScore" type="number" min="0" max="10" defaultValue={dailyLog?.sevaCharacterScore ?? 0} />
              </Field>
              <Field label="Relapse count">
                <input className={inputClass} name="relapseCount" type="number" min="0" defaultValue={dailyLog?.relapseCount ?? 0} />
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {emotionalChecklist.map(([key, label]) => (
                <label key={key} className="flex items-start gap-2 rounded-md border border-navy-950/10 bg-white px-3 py-2 text-sm text-navy-950">
                  <input className="mt-1 h-4 w-4 accent-saffron-500" name={key} type="checkbox" defaultChecked={Boolean(dailyLog?.[key])} />
                  <span>{label}</span>
                </label>
              ))}
              <label className="flex items-start gap-2 rounded-md border border-navy-950/10 bg-white px-3 py-2 text-sm text-navy-950">
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
                    <div key={path.id} className="flex items-center justify-between gap-3 rounded-md border border-navy-950/10 bg-white px-3 py-2">
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
                    <div key={entry.id} className="rounded-md border border-navy-950/10 bg-white px-3 py-2">
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
