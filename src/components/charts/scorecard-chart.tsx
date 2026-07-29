"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface ScorecardPoint {
  week: number;
  score: number;
}

export function ScorecardChart({ data }: { data: ScorecardPoint[] }) {
  return (
    <div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" tickFormatter={(w) => `W${w}`} tick={{ fontSize: 12 }} stroke="var(--color-slate)" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="var(--color-slate)" width={28} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", fontSize: 12 }}
              formatter={(value) => [`${value} / 10`, "Score"]}
              labelFormatter={(w) => `Week ${w}`}
            />
            <Bar dataKey="score" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">
        Weekly score data table: {data.map((d) => `Week ${d.week}: ${d.score} out of 10`).join("; ")}
      </p>
    </div>
  );
}
