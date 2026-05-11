"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Vibrate } from "lucide-react";
import { simranModes } from "@/lib/constants";
import { darkInputClass } from "@/components/ui/primitives";

const presets = [5, 11, 21, 31, 60];

export function SimranTracker({
  action,
  defaultDate
}: {
  action: (formData: FormData) => Promise<void>;
  defaultDate: string;
}) {
  const [count, setCount] = useState(0);
  const [preset, setPreset] = useState(11);
  const [remaining, setRemaining] = useState(11 * 60);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");

  return (
    <div className="rounded-[16px] border border-hairline bg-paper p-4 text-navy-950 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-card p-5 text-center">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-steel-500">Waheguru counter</div>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="focus-ring mt-5 h-44 w-44 rounded-full bg-saffron-500 text-5xl font-bold text-white shadow-soft transition active:scale-95"
          >
            {count}
          </button>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setCount((value) => value + 108)}
              className="focus-ring rounded-[16px] bg-white px-3 py-2 text-sm font-bold text-navy-950"
            >
              +108
            </button>
            <button
              type="button"
              onClick={() => setCount(0)}
              className="focus-ring inline-flex items-center gap-2 rounded-[16px] bg-white px-3 py-2 text-sm font-bold text-navy-950"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div>
          <div className="rounded-[32px] bg-navy-950 p-5 text-white">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/65">Timer</div>
            <div className="mt-3 text-5xl font-bold tabular-nums tracking-[-0.05em] text-white">
              {minutes}:{seconds}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {presets.map((minutesValue) => (
                <button
                  key={minutesValue}
                  type="button"
                  onClick={() => {
                    setPreset(minutesValue);
                    setRemaining(minutesValue * 60);
                    setRunning(false);
                  }}
                  className="focus-ring rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white data-[active=true]:bg-white data-[active=true]:text-navy-950"
                  data-active={preset === minutesValue}
                >
                  {minutesValue}m
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!running) setStartedAt(new Date().toISOString());
                  setRunning((value) => !value);
                }}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(40);
                }}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-white/10 px-5 py-3 text-sm font-bold leading-none text-white"
              >
                <Vibrate className="h-4 w-4" />
                Tick
              </button>
            </div>
          </div>

          <form
            action={action}
            onSubmit={() => {
              if (endRef.current) endRef.current.value = new Date().toISOString();
            }}
            className="mt-4 grid gap-3"
          >
            <input type="hidden" name="count" value={count} readOnly />
            <input type="hidden" name="durationMinutes" value={Math.max(1, Math.round((preset * 60 - remaining) / 60))} readOnly />
            <input type="hidden" name="startTime" value={startedAt} readOnly />
            <input ref={endRef} type="hidden" name="endTime" value={new Date().toISOString()} readOnly />
            <label className="block">
              <span className="text-sm font-semibold text-navy-950">Date</span>
              <input className={darkInputClass} name="date" type="date" defaultValue={defaultDate} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-950">Mode</span>
              <select className={darkInputClass} name="mode" defaultValue="TIMER">
                {simranModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-navy-950">Emotion before</span>
                <input className={darkInputClass} name="emotionBefore" placeholder="Restless, angry, numb" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-navy-950">Emotion after</span>
                <input className={darkInputClass} name="emotionAfter" placeholder="Quiet, steady, clear" />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-navy-950">Post-session reflection</span>
              <textarea className={darkInputClass} name="reflection" rows={3} />
            </label>
            <button className="focus-ring rounded-[16px] bg-saffron-500 px-5 py-3 text-sm font-bold leading-none text-white" type="submit">
              Save simran session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
