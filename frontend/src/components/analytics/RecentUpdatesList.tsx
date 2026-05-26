import type { RecentUpdateDatum } from "@/lib/analytics";
import { AnalyticsCard } from "./AnalyticsCard";

interface RecentUpdatesListProps {
  repositories: RecentUpdateDatum[];
}

function formatRelativeDays(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const diffDays = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "1 day ago";
  }

  return `${diffDays} days ago`;
}

export function RecentUpdatesList({ repositories }: RecentUpdatesListProps) {
  return (
    <AnalyticsCard title="Recent activity" subtitle="Recently updated repositories">
      {repositories.length > 0 ? (
        <div className="space-y-3">
          {repositories.map((repository) => (
            <a
              key={repository.id}
              href={repository.url}
              rel="noreferrer"
              target="_blank"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/65 px-4 py-3 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white group-hover:text-cyan-200">
                  {repository.name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {repository.language ?? "Other"} · {repository.stars} stars
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {formatRelativeDays(repository.pushedAt || repository.updatedAt)}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-400">
          No recently updated repositories found.
        </div>
      )}
    </AnalyticsCard>
  );
}
