import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageChartDatum } from "@/lib/analytics";
import { AnalyticsCard } from "./AnalyticsCard";

interface LanguageDistributionChartProps {
  data: LanguageChartDatum[];
}

const COLORS = [
  "#22d3ee",
  "#06b6d4",
  "#0ea5e9",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
];

export function LanguageDistributionChart({
  data,
}: LanguageDistributionChartProps) {
  const hasData = data.length > 0;

  return (
    <AnalyticsCard
      title="Language analytics"
      subtitle="Language distribution"
      rightSlot={
        hasData ? (
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            {data.length} languages
          </span>
        ) : undefined
      }
    >
      {hasData ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={100}
                  paddingAngle={2}
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, payload) => [
                    `${value} repos (${payload?.payload?.percentage ?? 0}%)`,
                    "Count",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    background: "rgba(2, 6, 23, 0.88)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((entry, index) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {entry.name}
                </div>
                <p className="text-sm font-semibold text-cyan-200">
                  {entry.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-400">
          No language data available for charting.
        </div>
      )}
    </AnalyticsCard>
  );
}
