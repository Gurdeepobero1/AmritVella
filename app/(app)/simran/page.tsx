import { createSimranSession } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { todayInputDate, toDateInput } from "@/lib/date";
import { SimranTracker } from "@/components/simran-tracker";
import { Card, CardHeader, EmptyState, PageHeader } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function SimranPage() {
  const user = await requireUser();
  const sessions = await prisma.simranSession.findMany({
    where: { userId: user.id },
    orderBy: { startTime: "desc" },
    take: 12
  });

  return (
    <div>
      <PageHeader
        title="Simran Counter"
        description="Use timer mode, mala count, custom count, silent mode, optional vibration, and a post-session reflection."
      />
      <SimranTracker action={createSimranSession} defaultDate={todayInputDate()} />

      <Card className="mt-5 overflow-hidden">
        <CardHeader title="Recent simran history" description="Every session is stored with count, time, emotion, and reflection." />
        <div className="space-y-2 p-4 sm:p-5">
          {sessions.length ? (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-card px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-navy-950">
                    {session.mode} · {session.durationMinutes} min · {session.count} count
                  </div>
                  <div className="text-xs text-steel-500">{toDateInput(session.date)}</div>
                </div>
                <DeleteButton model="simranSession" id={session.id} path="/simran" />
              </div>
            ))
          ) : (
            <EmptyState>No simran sessions yet.</EmptyState>
          )}
        </div>
      </Card>
    </div>
  );
}
