export interface GitHubAccountAge {
  days: number;
  label: string;
}

export interface GitHubProfileOverview {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  location: string | null;
  company: string | null;
  htmlUrl: string;
  blog: string | null;
  twitterUsername: string | null;
  hireable: boolean | null;
  createdAt: string;
  accountAge: GitHubAccountAge;
}

export interface GitHubRepositorySummary {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  archived: boolean;
  fork: boolean;
  homepage: string | null;
  topics: string[];
}

export interface GitHubLanguageSummary {
  language: string;
  count: number;
}

export interface GitHubRepositorySummaryStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  topRepo: {
    name: string;
    stars: number;
  } | null;
  recentRepo: {
    name: string;
    updatedAt: string;
  } | null;
}

export interface GitHubDashboardData {
  profile: GitHubProfileOverview;
  repositories: GitHubRepositorySummary[];
  topLanguages: GitHubLanguageSummary[];
  repoSummary: GitHubRepositorySummaryStats;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
