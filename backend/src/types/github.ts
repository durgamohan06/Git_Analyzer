export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  company: string | null;
  created_at: string;
  html_url: string;
  blog: string | null;
  twitter_username: string | null;
  hireable: boolean | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  homepage: string | null;
  topics?: string[];
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

export interface GitHubAccountAge {
  days: number;
  label: string;
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

export interface GitHubDashboardData {
  profile: GitHubProfileOverview;
  repositories: GitHubRepositorySummary[];
  topLanguages: GitHubLanguageSummary[];
  repoSummary: GitHubRepositorySummaryStats;
}
