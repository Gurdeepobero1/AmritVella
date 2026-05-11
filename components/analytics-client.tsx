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
            className="focus-ring rounded-full bg-card px-4 py-2 text-sm font-bold text-navy-950 data-[active=true]:bg-navy-950 data-[active=true]:text-white"
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
          <CartesianGrid strokeDasharray="3 3" stroke="#dadad3" />
          <XAxis dataKey="date" stroke="#62625b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#62625b" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dadad3", color: "#000000" }} />
          <Line type="monotone" dataKey="score" stroke="#e60023" strokeWidth={3} dot={false} />
        </LineChart>
      </ChartCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Simran minutes and career hours">
          <BarChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dadad3" />
            <XAxis dataKey="date" stroke="#62625b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#62625b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dadad3", color: "#000000" }} />
            <Bar dataKey="simranMinutes" fill="#e60023" />
            <Bar dataKey="careerHours" fill="#62625b" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Outreach, triggers, seva">
          <BarChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dadad3" />
            <XAxis dataKey="date" stroke="#62625b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#62625b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dadad3", color: "#000000" }} />
            <Bar dataKey="outreach" fill="#e60023" />
            <Bar dataKey="triggers" fill="#9e0a0a" />
            <Bar dataKey="seva" fill="#103c25" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Revenue history">
          <LineChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dadad3" />
            <XAxis dataKey="date" stroke="#62625b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#62625b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dadad3", color: "#000000" }} />
            <Line type="monotone" dataKey="revenue" stroke="#e60023" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Five thieves and fitness consistency">
          <LineChart data={filteredActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dadad3" />
            <XAxis dataKey="date" stroke="#62625b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#62625b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dadad3", color: "#000000" }} />
            <Line type="monotone" dataKey="fiveThievesAvg" stroke="#9e0a0a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fitness" stroke="#103c25" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-card p-4 text-navy-950">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-steel-500">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-[-0.03em]">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="rounded-[16px] border border-hairline bg-paper p-4 text-navy-950">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
