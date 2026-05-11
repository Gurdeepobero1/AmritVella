"use client";

import { useEffect, useRef, useState } from "react";
import { TimerReset } from "lucide-react";
import { emergencyChecklist } from "@/lib/constants";
import { darkInputClass } from "@/components/ui/primitives";

export function EmergencyMode({
  action,
  triggers
}: {
  action: (formData: FormData) => Promise<void>;
  triggers: { id: string; label: string }[];
}) {
  const [breathing, setBreathing] = useState(5 * 60);
  const [lock, setLock] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const startedAt = useRef(new Date().toISOString());
  const completedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setBreathing((value) => Math.max(0, value - 1));
      setLock((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const breathingText = `${Math.floor(breathing / 60)}:${(breathing % 60).toString().padStart(2, "0")}`;
  const lockText = `${Math.floor(lock / 60)}:${(lock % 60).toString().padStart(2, "0")}`;

  return (
    <div className="rounded-[16px] border border-hairline bg-paper p-4 text-navy-950 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.02em]">Emergency mode</h2>
          <p className="mt-1 text-sm text-steel-500">Breathe first, do Simran, write privately, delay contact.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            startedAt.current = new Date().toISOString();
            setBreathing(5 * 60);
            setLock(30 * 60);
            setRunning(true);
          }}
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
        >
          <TimerReset className="h-4 w-4" />
          Start emergency mode
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[32px] bg-navy-950 p-4 text-white">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Breathing timer</div>
          <div className="mt-2 text-4xl font-bold tabular-nums tracking-[-0.05em]">{breathingText}</div>
        </div>
        <div className="rounded-[32px] bg-card p-4">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-steel-500">Contact delay lock</div>
          <div className="mt-2 text-4xl font-bold tabular-nums tracking-[-0.05em]">{lockText}</div>
          <div className="mt-1 text-sm text-steel-500">{lock === 0 ? "Delay complete. Decide calmly." : "Do not contact yet."}</div>
        </div>
      </div>

      <form
        action={action}
        onSubmit={() => {
          if (completedRef.current) completedRef.current.value = new Date().toISOString();
        }}
        className="mt-5 grid gap-4"
      >
        <input type="hidden" name="startedAt" value={startedAt.current} readOnly />
        <input ref={completedRef} type="hidden" name="completedAt" value={new Date().toISOString()} readOnly />
        <label className="block">
          <span className="text-sm font-semibold text-navy-950">Attach to recent trigger</span>
          <select className={darkInputClass} name="triggerId" defaultValue="">
            <option value="">No trigger selected</option>
            {triggers.map((trigger) => (
              <option key={trigger.id} value={trigger.id}>
                {trigger.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          {emergencyChecklist.map((item) => (
            <label key={item} className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
              <input className="mt-1 h-4 w-4 accent-saffron-500" type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-navy-950">Private unsent message box</span>
          <textarea className={darkInputClass} name="notes" rows={5} placeholder="Write it here. Do not send while triggered." />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
            <input className="mt-1 h-4 w-4 accent-saffron-500" name="wroteUnsentMessage" type="checkbox" />
            <span>Wrote unsent message</span>
          </label>
          <label className="flex gap-2 rounded-[16px] bg-card px-3 py-2 text-sm text-navy-950">
            <input className="mt-1 h-4 w-4 accent-saffron-500" name="contactedPersonAfter" type="checkbox" disabled={lock > 0} />
            <span>Contacted person after delay</span>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-navy-950">Final decision</span>
          <input className={darkInputClass} name="finalDecision" placeholder="Waited, prayed, did not contact, contacted respectfully..." />
        </label>
        <button className="focus-ring rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white" type="submit">
          Save emergency usage
        </button>
      </form>
    </div>
  );
}
