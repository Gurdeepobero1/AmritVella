import { createCareerTask, createOutreachLog, createRevenueLog, createSkillPracticeLog } from "@/lib/actions";
import { careerCategories, careerStatuses, outreachStatuses } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { todayInputDate, toDateInput } from "@/lib/date";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/delete-button";

export default async function CareerPage() {
  const user = await requireUser();
  const [tasks, skills, outreach, revenue] = await prisma.$transaction([
    prisma.careerTask.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 10 }),
    prisma.skillPracticeLog.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 8 }),
    prisma.outreachLog.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 8 }),
    prisma.revenueLog.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 8 })
  ]);

  return (
    <div>
      <PageHeader
        title="Career Execution"
        description="Track defence/CAD-CAM/design work, technical practice, outreach, business development, and revenue."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Career task" description="Plan and store daily deep work, research, portfolio, reading, outreach, or exam prep." />
          <form action={createCareerTask} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <Field label="Title">
              <input className={inputClass} name="title" placeholder="3-hour CAD/CAM fixture design block" required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Category">
                <select className={inputClass} name="category">
                  {careerCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select className={inputClass} name="status" defaultValue="PLANNED">
                  {careerStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Planned hours">
                <input className={inputClass} name="plannedDuration" type="number" min="0" step="0.25" defaultValue="3" />
              </Field>
              <Field label="Actual hours">
                <input className={inputClass} name="actualDuration" type="number" min="0" step="0.25" defaultValue="0" />
              </Field>
            </div>
            <Field label="Notes">
              <textarea className={inputClass} name="notes" rows={3} />
            </Field>
            <SubmitButton>Save task</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Skill practice log" description="CAD/CAM, GD&T, drawing, materials, manufacturing, and output tracking." />
          <form action={createSkillPracticeLog} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Software used">
                <input className={inputClass} name="softwareUsed" placeholder="SolidWorks, Fusion, Mastercam" required />
              </Field>
              <Field label="Skill category">
                <input className={inputClass} name="skillCategory" placeholder="CAD/CAM, GD&T, fixture design" required />
              </Field>
            </div>
            <Field label="Project name">
              <input className={inputClass} name="projectName" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Hours">
                <input className={inputClass} name="hours" type="number" min="0" step="0.25" defaultValue="1" />
              </Field>
              <Field label="Difficulty 1-10">
                <input className={inputClass} name="difficulty" type="number" min="1" max="10" />
              </Field>
            </div>
            <Field label="Output link / file note">
              <input className={inputClass} name="outputLinkNote" placeholder="Portfolio URL, local file note, drawing reference" />
            </Field>
            <Field label="What improved">
              <textarea className={inputClass} name="whatImproved" rows={3} />
            </Field>
            <SubmitButton>Save practice</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Outreach log" description="Track companies, vendors, defence-sector contacts, follow-ups, and results." />
          <form action={createOutreachLog} className="grid gap-4 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Date">
                <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
              </Field>
              <Field label="Follow-up date">
                <input className={inputClass} name="followUpDate" type="date" />
              </Field>
            </div>
            <Field label="Company / person contacted">
              <input className={inputClass} name="companyPerson" required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Sector">
                <input className={inputClass} name="sector" placeholder="Defence, manufacturing, aerospace" />
              </Field>
              <Field label="Contact method">
                <input className={inputClass} name="contactMethod" placeholder="Email, LinkedIn, call" required />
              </Field>
            </div>
            <Field label="Status">
              <select className={inputClass} name="status">
                {outreachStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message summary">
              <textarea className={inputClass} name="messageSummary" rows={3} />
            </Field>
            <Field label="Result / notes">
              <textarea className={inputClass} name="notes" rows={3} />
            </Field>
            <SubmitButton>Save outreach</SubmitButton>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Revenue log" description="Store monthly revenue history, paid/unpaid status, and references." />
          <form action={createRevenueLog} className="grid gap-4 p-4 sm:p-5">
            <Field label="Date">
              <input className={inputClass} name="date" type="date" defaultValue={todayInputDate()} />
            </Field>
            <Field label="Client / source">
              <input className={inputClass} name="clientSource" required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Amount">
                <input className={inputClass} name="amount" type="number" min="0" step="0.01" defaultValue="0" />
              </Field>
              <Field label="Category">
                <input className={inputClass} name="category" placeholder="CAD, CAM, design, consulting" />
              </Field>
            </div>
            <Field label="Invoice / reference">
              <input className={inputClass} name="invoiceReference" />
            </Field>
            <label className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
              <input className="mt-1 h-4 w-4 accent-saffron-500" name="paid" type="checkbox" />
              <span>Paid</span>
            </label>
            <Field label="Notes">
              <textarea className={inputClass} name="notes" rows={3} />
            </Field>
            <SubmitButton>Save revenue</SubmitButton>
          </form>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <CardHeader title="Recent career history" description="Latest task, practice, outreach, and revenue records." />
        <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-4">
          <HistoryColumn title="Tasks">
            {tasks.length ? (
              tasks.map((task) => (
                <HistoryItem key={task.id} title={task.title} meta={`${toDateInput(task.date)} · ${task.status}`} model="careerTask" id={task.id} />
              ))
            ) : (
              <EmptyState>No tasks yet.</EmptyState>
            )}
          </HistoryColumn>
          <HistoryColumn title="Skill practice">
            {skills.length ? (
              skills.map((skill) => (
                <HistoryItem key={skill.id} title={`${skill.softwareUsed} · ${skill.skillCategory}`} meta={`${toDateInput(skill.date)} · ${Number(skill.hours)}h`} model="skillPracticeLog" id={skill.id} />
              ))
            ) : (
              <EmptyState>No skill logs yet.</EmptyState>
            )}
          </HistoryColumn>
          <HistoryColumn title="Outreach">
            {outreach.length ? (
              outreach.map((item) => (
                <HistoryItem key={item.id} title={item.companyPerson} meta={`${toDateInput(item.date)} · ${item.status}`} model="outreachLog" id={item.id} />
              ))
            ) : (
              <EmptyState>No outreach yet.</EmptyState>
            )}
          </HistoryColumn>
          <HistoryColumn title="Revenue">
            {revenue.length ? (
              revenue.map((item) => (
                <HistoryItem key={item.id} title={item.clientSource} meta={`${toDateInput(item.date)} · ${Number(item.amount).toFixed(2)}`} model="revenueLog" id={item.id} />
              ))
            ) : (
              <EmptyState>No revenue yet.</EmptyState>
            )}
          </HistoryColumn>
        </div>
      </Card>
    </div>
  );
}

function HistoryColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy-950">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function HistoryItem({ title, meta, model, id }: { title: string; meta: string; model: string; id: string }) {
  return (
    <div className="rounded-[16px] bg-card px-3 py-2">
      <div className="line-clamp-2 text-sm font-medium text-navy-950">{title}</div>
      <div className="mt-1 text-xs text-steel-500">{meta}</div>
      <div className="mt-2">
        <DeleteButton model={model} id={id} path="/career" />
      </div>
    </div>
  );
}
