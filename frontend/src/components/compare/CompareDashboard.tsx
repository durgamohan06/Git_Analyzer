import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";
import type { GitHubCompareResponse } from "@/types/github";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DeveloperStatsCards } from "@/components/analytics/DeveloperStatsCards";
import { AnalyticsCard } from "@/components/analytics/AnalyticsCard";

interface CompareDashboardProps {
  data: GitHubCompareResponse;
}

function buildLanguageComparison(left: any, right: any) {
  const map = new Map<string, { a: number; b: number }>();

  (left?.topLanguages ?? []).forEach((l: any) => {
    map.set(l.language, { a: l.count, b: map.get(l.language)?.b ?? 0 });
  });

  (right?.topLanguages ?? []).forEach((l: any) => {
    const existing = map.get(l.language) ?? { a: 0, b: 0 };
    existing.b = l.count;
    map.set(l.language, existing);
  });

  return Array.from(map.entries()).map(([language, v]) => ({
    language,
    a: v.a,
    b: v.b,
  }));
}

export function CompareDashboard({ data }: CompareDashboardProps) {
  const left = data.left.success ? data.left.data : null;
  const right = data.right.success ? data.right.data : null;

  const languageData = buildLanguageComparison(left, right);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsCard
          title="Profile A"
          subtitle={left?.profile.username ?? "Unavailable"}
        >
          {left ? (
            <ProfileCard profile={left.profile} />
          ) : (
            <p className="text-sm text-slate-400">Profile not available</p>
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Profile B"
          subtitle={right?.profile.username ?? "Unavailable"}
        >
          {right ? (
            <ProfileCard profile={right.profile} />
          ) : (
            <p className="text-sm text-slate-400">Profile not available</p>
          )}
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-sm font-semibold text-white">
            Language comparison
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageData}
                margin={{ left: -12, right: 8, top: 8, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.08)"
                />
                <XAxis
                  dataKey="language"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip wrapperStyle={{ borderRadius: 12 }} />
                <Legend />
                <Bar
                  dataKey="a"
                  name="A"
                  fill="#22d3ee"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="b"
                  name="B"
                  fill="#818cf8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-sm font-semibold text-white">
            Stars vs Forks (total)
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    metric: "Stars",
                    a: left?.repoSummary.totalStars ?? 0,
                    b: right?.repoSummary.totalStars ?? 0,
                  },
                  {
                    metric: "Forks",
                    a: left?.repoSummary.totalForks ?? 0,
                    b: right?.repoSummary.totalForks ?? 0,
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.08)"
                />
                <XAxis dataKey="metric" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip wrapperStyle={{ borderRadius: 12 }} />
                <Bar dataKey="a" name="A" fill="#22d3ee" />
                <Bar dataKey="b" name="B" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsCard
          title="Counts & Followers"
          subtitle="Repo and follower comparison"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Public repos</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {left?.profile.publicRepos ?? "—"} /{" "}
                {right?.profile.publicRepos ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Followers</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {left?.profile.followers ?? "—"} /{" "}
                {right?.profile.followers ?? "—"}
              </p>
            </div>
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Top repositories" subtitle="Most starred repos">
          <div className="grid gap-3">
            <div>
              <p className="text-xs text-slate-400">A — Top repo</p>
              <p className="mt-1 text-sm text-white">
                {left?.repoSummary.topRepo?.name ?? "—"} (
                {left?.repoSummary.topRepo?.stars ?? 0})
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">B — Top repo</p>
              <p className="mt-1 text-sm text-white">
                {right?.repoSummary.topRepo?.name ?? "—"} (
                {right?.repoSummary.topRepo?.stars ?? 0})
              </p>
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <div>
        <h3 className="text-sm text-slate-400">AI-style insights</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <AnalyticsCard title="Insights" subtitle="Quick comparison insights">
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                {left && right
                  ? left.profile.publicRepos > right.profile.publicRepos
                    ? "A has more public repositories"
                    : "B has more public repositories"
                  : "Not enough data to compare repositories."}
              </li>
              <li>
                {left && right
                  ? left.profile.followers > right.profile.followers
                    ? "A has a larger follower base"
                    : "B has a larger follower base"
                  : "Follower data incomplete."}
              </li>
              <li>
                {left && right
                  ? left.repoSummary.totalStars > right.repoSummary.totalStars
                    ? "A has higher total stars"
                    : "B has higher total stars"
                  : "Star data incomplete."}
              </li>
              <li>
                {left && right
                  ? (left.topLanguages.length || 0) >
                    (right.topLanguages.length || 0)
                    ? "A exhibits broader language diversity"
                    : "B exhibits broader language diversity"
                  : "Language data incomplete."}
              </li>
            </ul>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}
