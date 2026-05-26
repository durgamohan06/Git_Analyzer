import {
  buildActivityTimeline,
  buildCreationTrends,
  buildDeveloperInsights,
  buildDeveloperStats,
  buildLanguageChartData,
  buildPopularityChartData,
  buildRecentlyUpdatedRepositories,
} from "@/lib/analytics";
import type { GitHubDashboardData } from "@/types/github";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RepositoryList } from "@/components/dashboard/RepositoryList";
import { DeveloperStatsCards } from "./DeveloperStatsCards";
import { InsightsPanel } from "./InsightsPanel";
import { LanguageDistributionChart } from "./LanguageDistributionChart";
import { RecentUpdatesList } from "./RecentUpdatesList";
import { RepositoryActivityCharts } from "./RepositoryActivityCharts";
import { RepositoryPopularityChart } from "./RepositoryPopularityChart";

interface AnalyticsDashboardProps {
  dashboard: GitHubDashboardData;
}

export function AnalyticsDashboard({ dashboard }: AnalyticsDashboardProps) {
  const languageData = buildLanguageChartData(dashboard.topLanguages);
  const popularityData = buildPopularityChartData(dashboard.repositories);
  const timelineData = buildActivityTimeline(dashboard.repositories);
  const creationTrendData = buildCreationTrends(dashboard.repositories);
  const recentUpdates = buildRecentlyUpdatedRepositories(dashboard.repositories);
  const statsData = buildDeveloperStats(dashboard);
  const insights = buildDeveloperInsights(dashboard);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProfileCard profile={dashboard.profile} />
        <InsightsPanel insights={insights} />
      </div>

      <DeveloperStatsCards stats={statsData} />

      <div className="grid gap-6 xl:grid-cols-2">
        <LanguageDistributionChart data={languageData} />
        <RepositoryPopularityChart data={popularityData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <RepositoryActivityCharts
          timelineData={timelineData}
          creationTrendData={creationTrendData}
        />
        <RecentUpdatesList repositories={recentUpdates} />
      </div>

      <RepositoryList repositories={dashboard.repositories} />
    </div>
  );
}
