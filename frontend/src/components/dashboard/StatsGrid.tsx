import { formatCompactNumber } from "@/lib/formatters";
import type {
  GitHubProfileOverview,
  GitHubRepositorySummaryStats,
} from "@/types/github";

interface StatsGridProps {
  profile: GitHubProfileOverview;
  repoSummary: GitHubRepositorySummaryStats;
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-cyan-950/10 transition hover:-translate-y-0.5 hover:border-cyan-400/30">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
}

export function StatsGrid({ profile, repoSummary }: StatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Followers"
        value={formatCompactNumber(profile.followers)}
        detail="People watching the profile."
      />
      <StatCard
        label="Following"
        value={formatCompactNumber(profile.following)}
        detail="Accounts followed by the user."
      />
      <StatCard
        label="Public repos"
        value={formatCompactNumber(profile.publicRepos)}
        detail="Repositories visible on GitHub."
      />
      <StatCard
        label="Account age"
        value={profile.accountAge.label}
        detail={`${profile.accountAge.days} total days`}
      />
      <StatCard
        label="Total stars"
        value={formatCompactNumber(repoSummary.totalStars)}
        detail="Across public repositories."
      />
      <StatCard
        label="Total forks"
        value={formatCompactNumber(repoSummary.totalForks)}
        detail="Community forks across repos."
      />
    </section>
  );
}
