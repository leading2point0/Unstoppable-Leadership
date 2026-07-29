"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export interface LeadMeasurePoint {
  date: string;
  actual: number;
}

export function LeadMeasureChart({ data, unit }: { data: LeadMeasurePoint[]; unit?: string }) {
  if (data.length === 0) {
    return <p className="text-slate text-sm">No entries yet. Log your first measurement below.</p>;
  }

  return (
    <div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--color-slate)" />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-slate)" width={36} />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                fontSize: 12,
              }}
              formatter={(value) => [`${value}${unit ? ` ${unit}` : ""}`, "Actual"]}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">
        Data table: {data.map((d) => `${d.date}: ${d.actual}${unit ? ` ${unit}` : ""}`).join("; ")}
      </p>
    </div>
  );
}
