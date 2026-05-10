"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { bestStreak } from "@/lib/metrics";

type DailyPoint = {
  date: string;
  score: number;
  sikh: number;
  career: number;
  emotional: number;
  fitness: number;
  seva: number;
  relapse: number;
  missed: boolean;
};

type ActivityPoint = {
  date: string;
  simranMinutes: number;
  careerHours: number;
  cadCamHours: number;
  outreach: number;
  revenue: number;
  triggers: number;
  seva: number;
  fitness: number;
  fiveThievesAvg: number;
};

export function AnalyticsClient({
  daily,
  activity,
  currentStreak
}: {
  daily: DailyPoint[];
  activity: ActivityPoint[];
  currentStreak: number;
}) {
  const [filter, setFilter] = useState("30");

  const cutoff = useMemo(() => {
    if (filter === "all") return null;
    const date = new Date();
    date.setDate(date.getDate() - Number(filter));
    return date.toISOString().slice(0, 10);
  }, [filter]);

  const filteredDaily = useMemo(() => daily.filter((item) => !cutoff || item.date >= cutoff), [daily, cutoff]);
  const filteredActivity = useMemo(() => activity.filter((item) => !cutoff || item.date >= cutoff), [activity, cutoff]);
  const best = bestStreak(
    daily.map((item) => ({
      date: new Date(`${item.date}T00:00:00.000Z`),
      totalScore: item.score,
      missedDay: item.missed
    }))
  );
  const relapseCount = filteredDaily.reduce((sum, item) => sum + item.relapse, 0);
  const missedDays = filteredDaily.filter((item) => item.missed).length;
  const avgScore = filteredDaily.length
    ? Math.round(filteredDaily.reduce((sum, item) => sum + item.score, 0) / filteredDaily.length)
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          ["7", "Last 7 days"],
          ["30", "Last 30 days"],
          ["90", "Quarter"],
          ["365", "Year"],
          ["all", "All time"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            data-active={filter === value}
            className="focus-ring rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-steel-100 data-[active=true]:border-saffron-500 data-[active=true]:bg-saffron-500 data-[active=true]:text-navy-950"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Average score" value={avgScore} />
        <MiniStat label="Current streak" value={currentStreak} />
        <MiniStat label="Best streak" value={best} />
        <MiniStat label="Relapses / missed" value={`${relapseCount} / ${missedDays}`} />
      </div>

      <ChartCard title="Daily score trend">
        <LineChart data={filteredDaily}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#aab7c5" tick={{ fontSize: 11 }} />
          <YAxis stroke="#aab7c5" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
          <Line type="monotone" dataKey="score" stroke="#f2a51a" strokeWidth={3} dot={false} />
        </LineChart>
      </ChartCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Simran minutes and career hours">
          <BarChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <YAxis stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
            <Bar dataKey="simranMinutes" fill="#f2a51a" />
            <Bar dataKey="careerHours" fill="#aab7c5" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Outreach, triggers, seva">
          <BarChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <YAxis stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
            <Bar dataKey="outreach" fill="#f2a51a" />
            <Bar dataKey="triggers" fill="#ef4444" />
            <Bar dataKey="seva" fill="#22c55e" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Revenue history">
          <LineChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <YAxis stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
            <Line type="monotone" dataKey="revenue" stroke="#f2a51a" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Five thieves and fitness consistency">
          <LineChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <YAxis stroke="#aab7c5" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#07111f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }} />
            <Line type="monotone" dataKey="fiveThievesAvg" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fitness" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-white">
      <div className="text-xs uppercase tracking-[0.16em] text-steel-300">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-white">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
