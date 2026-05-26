import type { DeveloperInsightsResult } from "@/lib/analytics";
import { AnalyticsCard } from "./AnalyticsCard";

interface InsightsPanelProps {
  insights: DeveloperInsightsResult;
}

function confidenceBadge(confidence: "high" | "medium" | "low") {
  if (confidence === "high") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  if (confidence === "medium") {
    return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
  }

  return "border-amber-400/30 bg-amber-400/10 text-amber-200";
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <AnalyticsCard
      title="Developer insights"
      subtitle="AI-style interpretation of repository signals"
      rightSlot={
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          Rule-based engine
        </div>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {insights.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {insights.insights.map((insight) => (
          <article
            key={insight.id}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/25"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-white">
                {insight.title}
              </h4>
              <span
                className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${confidenceBadge(insight.confidence)}`}
              >
                {insight.confidence}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {insight.description}
            </p>
          </article>
        ))}
      </div>
    </AnalyticsCard>
  );
}
