import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CreationTrendDatum, TimelineChartDatum } from "@/lib/analytics";
import { AnalyticsCard } from "./AnalyticsCard";

interface RepositoryActivityChartsProps {
  timelineData: TimelineChartDatum[];
  creationTrendData: CreationTrendDatum[];
}

export function RepositoryActivityCharts({
  timelineData,
  creationTrendData,
}: RepositoryActivityChartsProps) {
  return (
    <AnalyticsCard
      title="Activity"
      subtitle="Recent updates and creation trends"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <p className="mb-3 text-sm text-slate-400">Recent update timeline</p>
          {timelineData.some((item) => item.updates > 0) ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="activityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                      <stop
                        offset="95%"
                        stopColor="#22d3ee"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.18)"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
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
                  <Area
                    type="monotone"
                    dataKey="updates"
                    stroke="#22d3ee"
                    fillOpacity={1}
                    fill="url(#activityGradient)"
                    isAnimationActive
                    animationDuration={700}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-400">
              No recent update activity detected.
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm text-slate-400">
            Repository creation trend
          </p>
          {creationTrendData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={creationTrendData}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.18)"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="repos"
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive
                    animationDuration={700}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-400">
              Not enough creation history to draw trends.
            </div>
          )}
        </div>
      </div>
    </AnalyticsCard>
  );
}
