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
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-white sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-navy-950/50 p-5 text-center">
          <div className="text-sm uppercase tracking-[0.18em] text-steel-300">Waheguru counter</div>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="focus-ring mt-5 h-44 w-44 rounded-full border border-saffron-500/60 bg-saffron-500 text-5xl font-semibold text-navy-950 shadow-soft transition active:scale-95"
          >
            {count}
          </button>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setCount((value) => value + 108)}
              className="focus-ring rounded-md border border-white/10 px-3 py-2 text-sm text-steel-100"
            >
              +108
            </button>
            <button
              type="button"
              onClick={() => setCount(0)}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-steel-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-white/10 bg-navy-950/50 p-5">
            <div className="text-sm uppercase tracking-[0.18em] text-steel-300">Timer</div>
            <div className="mt-3 text-5xl font-semibold tabular-nums text-white">
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
                  className="focus-ring rounded-md border border-white/10 px-3 py-2 text-sm text-steel-100 data-[active=true]:border-saffron-500 data-[active=true]:text-saffron-500"
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
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(40);
                }}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-steel-100"
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
            <input type="hidden" name="count" value={count} />
            <input type="hidden" name="durationMinutes" value={Math.max(1, Math.round((preset * 60 - remaining) / 60))} />
            <input type="hidden" name="startTime" value={startedAt} />
            <input ref={endRef} type="hidden" name="endTime" value={new Date().toISOString()} readOnly />
            <label className="block">
              <span className="text-sm font-medium text-steel-100">Date</span>
              <input className={darkInputClass} name="date" type="date" defaultValue={defaultDate} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-steel-100">Mode</span>
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
                <span className="text-sm font-medium text-steel-100">Emotion before</span>
                <input className={darkInputClass} name="emotionBefore" placeholder="Restless, angry, numb" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-steel-100">Emotion after</span>
                <input className={darkInputClass} name="emotionAfter" placeholder="Quiet, steady, clear" />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-steel-100">Post-session reflection</span>
              <textarea className={darkInputClass} name="reflection" rows={3} />
            </label>
            <button className="focus-ring rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-navy-950" type="submit">
              Save simran session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
