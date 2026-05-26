import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PopularityChartDatum } from "@/lib/analytics";
import { AnalyticsCard } from "./AnalyticsCard";

interface RepositoryPopularityChartProps {
  data: PopularityChartDatum[];
}

export function RepositoryPopularityChart({
  data,
}: RepositoryPopularityChartProps) {
  const hasData = data.length > 0;

  return (
    <AnalyticsCard title="Popularity" subtitle="Stars vs forks by repository">
      {hasData ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 12, left: -8, bottom: 24 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.18)"
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={52}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  background: "rgba(2, 6, 23, 0.88)",
                }}
              />
              <Bar
                dataKey="stars"
                fill="#22d3ee"
                radius={[6, 6, 0, 0]}
                isAnimationActive
                animationDuration={900}
              />
              <Bar
                dataKey="forks"
                fill="#818cf8"
                radius={[6, 6, 0, 0]}
                isAnimationActive
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-400">
          No repository popularity data to display.
        </div>
      )}
    </AnalyticsCard>
  );
}
