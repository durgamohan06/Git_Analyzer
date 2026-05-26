import type {
  GitHubDashboardData,
  GitHubLanguageSummary,
  GitHubRepositorySummary,
} from "@/types/github";

export interface LanguageChartDatum {
  name: string;
  value: number;
  percentage: number;
}

export interface PopularityChartDatum {
  name: string;
  stars: number;
  forks: number;
}

export interface TimelineChartDatum {
  label: string;
  updates: number;
}

export interface CreationTrendDatum {
  label: string;
  repos: number;
}

export interface DeveloperStat {
  label: string;
  value: string;
  detail: string;
}

export interface DeveloperInsight {
  id: string;
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
}

export interface DeveloperInsightsResult {
  badges: string[];
  insights: DeveloperInsight[];
}

function safeDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeTopic(topic: string) {
  return topic.trim().toLowerCase();
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export function buildLanguageChartData(
  languages: GitHubLanguageSummary[],
): LanguageChartDatum[] {
  const total = languages.reduce((sum, item) => sum + item.count, 0);

  if (!total) {
    return [];
  }

  return languages.map((language) => ({
    name: language.language,
    value: language.count,
    percentage: Number(((language.count / total) * 100).toFixed(1)),
  }));
}

export function buildPopularityChartData(
  repositories: GitHubRepositorySummary[],
): PopularityChartDatum[] {
  return repositories.slice(0, 8).map((repository) => ({
    name: repository.name,
    stars: repository.stars,
    forks: repository.forks,
  }));
}

export function buildActivityTimeline(
  repositories: GitHubRepositorySummary[],
): TimelineChartDatum[] {
  const now = new Date();
  const months = 6;
  const entries = Array.from({ length: months }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - index - 1),
      1,
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en", { month: "short" }),
      updates: 0,
    };
  });

  const monthMap = new Map(entries.map((entry) => [entry.key, entry]));

  for (const repository of repositories) {
    const date = safeDate(repository.pushedAt || repository.updatedAt);

    if (!date) {
      continue;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const target = monthMap.get(key);

    if (target) {
      target.updates += 1;
    }
  }

  return entries.map((entry) => ({
    label: entry.label,
    updates: entry.updates,
  }));
}

export function buildCreationTrends(
  repositories: GitHubRepositorySummary[],
): CreationTrendDatum[] {
  const years = new Map<string, number>();

  for (const repository of repositories) {
    const createdAt = safeDate(repository.createdAt);

    if (!createdAt) {
      continue;
    }

    const year = String(createdAt.getFullYear());
    years.set(year, (years.get(year) ?? 0) + 1);
  }

  return Array.from(years.entries())
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .slice(-6)
    .map(([label, repos]) => ({ label, repos }));
}

export function buildDeveloperStats(
  dashboard: GitHubDashboardData,
): DeveloperStat[] {
  const totalRepos = dashboard.repoSummary.totalRepos;
  const averageStars =
    totalRepos > 0 ? dashboard.repoSummary.totalStars / totalRepos : 0;
  const followerRatio =
    dashboard.profile.following > 0
      ? dashboard.profile.followers / dashboard.profile.following
      : dashboard.profile.followers;

  return [
    {
      label: "Total stars",
      value: String(dashboard.repoSummary.totalStars),
      detail: "Across all public repositories",
    },
    {
      label: "Total forks",
      value: String(dashboard.repoSummary.totalForks),
      detail: "Total community forks",
    },
    {
      label: "Avg repo stars",
      value: averageStars.toFixed(1),
      detail: "Stars per repository",
    },
    {
      label: "Most used language",
      value: dashboard.topLanguages[0]?.language ?? "N/A",
      detail: "Based on public repo count",
    },
    {
      label: "Repository count",
      value: String(totalRepos),
      detail: "Mapped in this dashboard",
    },
    {
      label: "Follower ratio",
      value: `${followerRatio.toFixed(2)}x`,
      detail: "Followers / Following",
    },
  ];
}

function languageProfile(repositories: GitHubRepositorySummary[]) {
  const counts = new Map<string, number>();

  for (const repository of repositories) {
    const language = repository.language?.trim();

    if (!language) {
      continue;
    }

    counts.set(language, (counts.get(language) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    total,
    counts,
  };
}

export function buildDeveloperInsights(
  dashboard: GitHubDashboardData,
): DeveloperInsightsResult {
  const repositories = dashboard.repositories;
  const repoCount = repositories.length;
  const totalStars = dashboard.repoSummary.totalStars;
  const activeRecentRepos = repositories.filter((repository) => {
    const pushedAt = safeDate(repository.pushedAt || repository.updatedAt);

    if (!pushedAt) {
      return false;
    }

    const daysAgo = (Date.now() - pushedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 90;
  }).length;

  const { total: languageTotal, counts: languageCounts } =
    languageProfile(repositories);
  const topicSet = new Set(
    repositories.flatMap((repository) =>
      (repository.topics ?? []).map(normalizeTopic),
    ),
  );
  const nameSpace = repositories.map((repository) =>
    normalizeName(repository.name),
  );

  const insights: DeveloperInsight[] = [];
  const badges: string[] = [];

  const jsWeight =
    (languageCounts.get("TypeScript") ?? 0) +
    (languageCounts.get("JavaScript") ?? 0) +
    (languageCounts.get("TS") ?? 0);
  const backendWeight =
    (languageCounts.get("Go") ?? 0) +
    (languageCounts.get("Rust") ?? 0) +
    (languageCounts.get("Java") ?? 0) +
    (languageCounts.get("Python") ?? 0);
  const dataWeight =
    (languageCounts.get("Python") ?? 0) +
    (languageCounts.get("Jupyter Notebook") ?? 0) +
    (languageCounts.get("R") ?? 0);

  if (languageTotal > 0 && jsWeight / languageTotal >= 0.45) {
    badges.push("JavaScript ecosystem specialist");
    insights.push({
      id: "js-specialist",
      title: "JavaScript ecosystem specialist",
      description:
        "A significant share of repositories are JavaScript/TypeScript-centric, indicating strong front-end or full-stack JS expertise.",
      confidence: "high",
    });
  }

  if (languageTotal > 0 && backendWeight / languageTotal >= 0.45) {
    badges.push("Backend-focused engineer");
    insights.push({
      id: "backend-focus",
      title: "Backend-focused engineer",
      description:
        "Repository language distribution leans toward backend-oriented languages and systems programming stacks.",
      confidence: "medium",
    });
  }

  if (languageTotal > 0 && dataWeight / languageTotal >= 0.35) {
    badges.push("AI/data-oriented developer");
    insights.push({
      id: "ai-data",
      title: "AI/data-oriented developer",
      description:
        "Python and data-oriented tooling appear frequently, suggesting work in ML, analytics, or data engineering workflows.",
      confidence: "medium",
    });
  }

  const frontendSignals = [
    "react",
    "next",
    "nuxt",
    "ui",
    "frontend",
    "tailwind",
    "vue",
  ];
  const backendSignals = [
    "api",
    "server",
    "backend",
    "microservice",
    "grpc",
    "auth",
  ];
  const aiSignals = ["ml", "ai", "llm", "nlp", "data", "vector", "rag"];

  const topicString = Array.from(topicSet).join(" ");
  const nameString = nameSpace.join(" ");

  if (
    frontendSignals.some(
      (signal) => topicString.includes(signal) || nameString.includes(signal),
    )
  ) {
    badges.push("Frontend-focused developer");
    insights.push({
      id: "frontend-focus",
      title: "Frontend-focused developer",
      description:
        "Repository topics and naming patterns indicate strong interest in user interfaces, design systems, or front-end frameworks.",
      confidence: "medium",
    });
  }

  if (
    backendSignals.some(
      (signal) => topicString.includes(signal) || nameString.includes(signal),
    )
  ) {
    badges.push("API/platform contributor");
    insights.push({
      id: "platform-contributor",
      title: "API/platform contributor",
      description:
        "Naming and topic patterns highlight a focus on APIs, services, and backend platform architecture.",
      confidence: "low",
    });
  }

  if (
    aiSignals.some(
      (signal) => topicString.includes(signal) || nameString.includes(signal),
    )
  ) {
    badges.push("AI experimentation track");
    insights.push({
      id: "ai-signals",
      title: "AI experimentation track",
      description:
        "Project taxonomy suggests active exploration around AI, LLM, or data-intensive applications.",
      confidence: "low",
    });
  }

  if (repoCount >= 35 || totalStars >= 1000) {
    badges.push("Open-source heavy contributor");
    insights.push({
      id: "oss-heavy",
      title: "Open-source heavy contributor",
      description:
        "Repository volume and popularity indicate consistent public contribution and sustained open-source activity.",
      confidence: "high",
    });
  }

  if (activeRecentRepos >= 6) {
    badges.push("High recent activity");
    insights.push({
      id: "high-activity",
      title: "High recent activity",
      description:
        "Multiple repositories show push activity in the last 90 days, signaling an actively maintained portfolio.",
      confidence: "high",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "generalist",
      title: "Generalist engineering profile",
      description:
        "No single dominant specialization was detected, suggesting a balanced repository portfolio across different domains.",
      confidence: "low",
    });
    badges.push("Generalist profile");
  }

  return {
    badges: Array.from(new Set(badges)).slice(0, 6),
    insights: insights.slice(0, 6),
  };
}
