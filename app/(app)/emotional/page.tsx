import { createEmotionalTrigger, createEmergencyModeUsage } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { triggerTypes } from "@/lib/constants";
import { toDisplayDate } from "@/lib/date";
import { EmergencyMode } from "@/components/emergency-mode";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function EmotionalPage() {
  const user = await requireUser();
  const [triggers, usages] = await prisma.$transaction([
    prisma.emotionalTrigger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 15
    }),
    prisma.emergencyModeUsage.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 8
    })
  ]);

  return (
    <div>
      <PageHeader
        title="Emotional Control"
        description="Track triggers, reactions, lessons, and emergency-mode usage without turning pain into obsession."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <CardHeader title="Log emotional trigger" description="Use this when attachment, anger, fear, loneliness, lust, or pressure appears." />
          <form action={createEmotionalTrigger} className="space-y-4 p-4 sm:p-5">
            <Field label="Trigger type">
              <select className={inputClass} name="triggerType">
                {triggerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Intensity 1-10">
              <input className={inputClass} name="intensity" type="number" min="1" max="10" defaultValue="5" />
            </Field>
            <Field label="Response">
              <textarea className={inputClass} name="response" rows={3} placeholder="What happened, and how did you respond?" />
            </Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
                <input className="mt-1 h-4 w-4 accent-saffron-500" name="didReact" type="checkbox" />
                <span>I reacted instead of responding</span>
              </label>
              <label className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
                <input className="mt-1 h-4 w-4 accent-saffron-500" name="usedEmergencyMode" type="checkbox" />
                <span>I used emergency mode</span>
              </label>
            </div>
            <Field label="Lesson learned">
              <textarea className={inputClass} name="lessonLearned" rows={3} />
            </Field>
            <SubmitButton>Save trigger</SubmitButton>
          </form>
        </Card>

        <EmergencyMode
          action={createEmergencyModeUsage}
          triggers={triggers.map((trigger) => ({
            id: trigger.id,
            label: `${trigger.triggerType.replaceAll("_", " ")} · ${toDisplayDate(trigger.createdAt)}`
          }))}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Recent triggers" description="Stored trigger history with response quality." />
          <div className="space-y-2 p-4 sm:p-5">
            {triggers.length ? (
              triggers.map((trigger) => (
                <div key={trigger.id} className="flex items-center justify-between gap-3 rounded-[16px] bg-card px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-navy-950">
                      {trigger.triggerType.replaceAll("_", " ")} · intensity {trigger.intensity}
                    </div>
                    <div className="text-xs text-steel-500">{trigger.didReact ? "Reacted" : "Responded"} · {toDisplayDate(trigger.createdAt)}</div>
                  </div>
                  <DeleteButton model="emotionalTrigger" id={trigger.id} path="/emotional" />
                </div>
              ))
            ) : (
              <EmptyState>No emotional triggers logged yet.</EmptyState>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Emergency usage" description="Recorded emergency mode sessions." />
          <div className="space-y-2 p-4 sm:p-5">
            {usages.length ? (
              usages.map((usage) => (
                <div key={usage.id} className="rounded-[16px] bg-card px-3 py-2">
                  <div className="text-sm font-medium text-navy-950">{usage.finalDecision ?? "Emergency mode used"}</div>
                  <div className="text-xs text-steel-500">{toDisplayDate(usage.startedAt)}</div>
                </div>
              ))
            ) : (
              <EmptyState>No emergency mode usage saved yet.</EmptyState>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
