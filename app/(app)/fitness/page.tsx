import { createSevaAction, saveFitnessLog, saveFiveThievesRating } from "@/lib/actions";
import { fiveThieves } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { parseDateInput, todayInputDate, toDateInput } from "@/lib/date";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function FitnessPage() {
  const user = await requireUser();
  const today = parseDateInput(todayInputDate());
  const [fitnessToday, fitnessLogs, thieves, seva] = await prisma.$transaction([
    prisma.fitnessLog.findUnique({ where: { userId_date: { userId: user.id, date: today } } }),
    prisma.fitnessLog.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 8 }),
    prisma.fiveThievesRating.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 12 }),
    prisma.sevaAction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 10 })
  ]);

  return (
    <div>
      <PageHeader
        title="Fitness, Five Thieves, Seva"
        description="Track body discipline, inner weaknesses, and private character actions as part of one path."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="Fitness log" description="Wake, sleep, workout, steps, water, food discipline, and weight." />
          <form action={saveFitnessLog} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Wake-up time">
                <input className={inputClass} name="wakeUpTime" type="time" defaultValue={fitnessToday?.wakeUpTime ?? ""} />
              </Field>
              <Field label="Sleep time">
                <input className={inputClass} name="sleepTime" type="time" defaultValue={fitnessToday?.sleepTime ?? ""} />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Workout type">
                <input className={inputClass} name="workoutType" defaultValue={fitnessToday?.workoutType ?? ""} placeholder="Walk, gym, mobility, sports" />
              </Field>
              <Field label="Duration minutes">
                <input className={inputClass} name="durationMinutes" type="number" min="0" defaultValue={fitnessToday?.durationMinutes ?? 0} />
              </Field>
              <Field label="Steps">
                <input className={inputClass} name="steps" type="number" min="0" defaultValue={fitnessToday?.steps ?? 0} />
              </Field>
              <Field label="Water liters">
                <input className={inputClass} name="waterLiters" type="number" min="0" step="0.1" defaultValue={fitnessToday?.waterLiters ? Number(fitnessToday.waterLiters) : 0} />
              </Field>
              <Field label="Weight kg">
                <input className={inputClass} name="weightKg" type="number" min="0" step="0.1" defaultValue={fitnessToday?.weightKg ? Number(fitnessToday.weightKg) : ""} />
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Check name="cleanFood" label="Clean food" checked={fitnessToday?.cleanFood} />
              <Check name="noJunk" label="No junk" checked={fitnessToday?.noJunk} />
              <Check name="noAlcoholSmoking" label="No alcohol/smoking" checked={fitnessToday?.noAlcoholSmoking} />
            </div>
            <Field label="Notes">
              <textarea className={inputClass} name="notes" rows={3} defaultValue={fitnessToday?.notes ?? ""} />
            </Field>
            <SubmitButton>Save fitness</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Five thieves rating" description="Daily 1-5 rating with trigger, correction, and Sikh principle used." />
          <form action={saveFiveThievesRating} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <Field label="Thief">
              <select className={inputClass} name="thief">
                {fiveThieves.map((thief) => (
                  <option key={thief.value} value={thief.value}>
                    {thief.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rating 1-5">
              <input className={inputClass} name="rating" type="number" min="1" max="5" defaultValue="3" />
            </Field>
            <Field label="Trigger">
              <input className={inputClass} name="trigger" />
            </Field>
            <Field label="Corrective action">
              <textarea className={inputClass} name="correctiveAction" rows={3} />
            </Field>
            <Field label="Sikh principle used">
              <input className={inputClass} name="sikhPrincipleUsed" placeholder="Naam, truth, humility, seva..." />
            </Field>
            <SubmitButton>Save rating</SubmitButton>
          </form>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Seva and karma action" description="Gurudwara seva, langar, family duty, teaching, donation, forgiveness, truthfulness." />
          <form action={createSevaAction} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <Field label="Type">
              <input className={inputClass} name="type" placeholder="Helping parents, langar seva, anonymous donation" required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Duration minutes">
                <input className={inputClass} name="durationMinutes" type="number" min="0" />
              </Field>
              <Field label="Value amount">
                <input className={inputClass} name="valueAmount" type="number" min="0" step="0.01" />
              </Field>
            </div>
            <label className="flex gap-2 rounded-[12px] bg-card px-3 py-2 text-sm text-navy-950">
              <input className="mt-1 h-4 w-4 accent-saffron-500" name="anonymous" type="checkbox" />
              <span>Anonymous</span>
            </label>
            <Field label="Private notes">
              <textarea className={inputClass} name="privateNotes" rows={3} />
            </Field>
            <SubmitButton>Save seva</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Recent fitness and seva history" description="Latest stored body, character, and five-thieves records." />
          <div className="grid gap-5 p-4 sm:p-5 sm:grid-cols-3">
            <History title="Fitness">
              {fitnessLogs.length ? (
                fitnessLogs.map((log) => (
                  <HistoryItem key={log.id} title={log.workoutType ?? "Fitness"} meta={`${toDateInput(log.date)} · ${log.durationMinutes}m`} model="fitnessLog" id={log.id} />
                ))
              ) : (
                <EmptyState>No fitness logs.</EmptyState>
              )}
            </History>
            <History title="Five thieves">
              {thieves.length ? (
                thieves.map((item) => (
                  <HistoryItem key={item.id} title={`${item.thief} · ${item.rating}/5`} meta={toDateInput(item.date)} model="fiveThievesRating" id={item.id} />
                ))
              ) : (
                <EmptyState>No ratings.</EmptyState>
              )}
            </History>
            <History title="Seva">
              {seva.length ? (
                seva.map((item) => (
                  <HistoryItem key={item.id} title={item.type} meta={toDateInput(item.date)} model="sevaAction" id={item.id} />
                ))
              ) : (
                <EmptyState>No seva actions.</EmptyState>
              )}
            </History>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Check({ name, label, checked }: { name: string; label: string; checked?: boolean }) {
  return (
    <label className="flex gap-2 rounded-[12px] bg-card px-3 py-2 text-sm text-navy-950">
      <input className="mt-1 h-4 w-4 accent-saffron-500" name={name} type="checkbox" defaultChecked={Boolean(checked)} />
      <span>{label}</span>
    </label>
  );
}

function History({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy-950">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function HistoryItem({ title, meta, model, id }: { title: string; meta: string; model: string; id: string }) {
  return (
    <div className="rounded-[12px] bg-card px-3 py-2">
      <div className="line-clamp-2 text-sm font-medium text-navy-950">{title}</div>
      <div className="mt-1 text-xs text-steel-500">{meta}</div>
      <div className="mt-2">
        <DeleteButton model={model} id={id} path="/fitness" />
      </div>
    </div>
  );
}
