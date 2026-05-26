import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import type {
  GitHubDashboardData,
  GitHubLanguageSummary,
  GitHubProfileOverview,
  GitHubRepository,
  GitHubRepositorySummary,
  GitHubRepositorySummaryStats,
  GitHubUser,
} from "../types/github.js";

const GITHUB_API_BASE_URL = "https://api.github.com";

interface GitHubApiErrorBody {
  message?: string;
  documentation_url?: string;
}

function createHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Dev-Weekends-2",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
}

function buildTimeoutError() {
  return new AppError(504, "GitHub request timed out", "GITHUB_TIMEOUT");
}

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    env.GITHUB_API_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      headers: createHeaders(),
      signal: controller.signal,
    });

    if (response.status === 404) {
      throw new AppError(404, "GitHub user not found", "GITHUB_USER_NOT_FOUND");
    }

    if (response.status === 403) {
      const remaining = response.headers.get("x-ratelimit-remaining");

      if (remaining === "0") {
        throw new AppError(
          429,
          "GitHub rate limit exceeded",
          "GITHUB_RATE_LIMIT",
        );
      }
    }

    if (!response.ok) {
      let details: GitHubApiErrorBody | undefined;

      try {
        details = (await response.json()) as GitHubApiErrorBody;
      } catch {
        details = undefined;
      }

      throw new AppError(
        502,
        "Unable to fetch data from GitHub",
        "GITHUB_UPSTREAM_ERROR",
        details,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw buildTimeoutError();
    }

    throw new AppError(502, "Unable to reach GitHub", "GITHUB_NETWORK_ERROR");
  } finally {
    clearTimeout(timeoutId);
  }
}

function formatAccountAge(createdAt: string) {
  const createdDate = new Date(createdAt);
  const ageInDays = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const years = Math.floor(ageInDays / 365);
  const months = Math.floor((ageInDays % 365) / 30);
  const days = ageInDays % 30;
  const labelParts: string[] = [];

  if (years > 0) {
    labelParts.push(`${years}y`);
  }

  if (months > 0) {
    labelParts.push(`${months}mo`);
  }

  if (labelParts.length === 0) {
    labelParts.push(`${days}d`);
  }

  return {
    days: ageInDays,
    label: labelParts.join(" "),
  };
}

function mapProfile(profile: GitHubUser): GitHubProfileOverview {
  return {
    username: profile.login,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    followers: profile.followers,
    following: profile.following,
    publicRepos: profile.public_repos,
    location: profile.location,
    company: profile.company,
    htmlUrl: profile.html_url,
    blog: profile.blog,
    twitterUsername: profile.twitter_username,
    hireable: profile.hireable,
    createdAt: profile.created_at,
    accountAge: formatAccountAge(profile.created_at),
  };
}

function mapRepositories(
  repositories: GitHubRepository[],
): GitHubRepositorySummary[] {
  return repositories
    .slice()
    .sort((left, right) => {
      if (right.stargazers_count !== left.stargazers_count) {
        return right.stargazers_count - left.stargazers_count;
      }

      return (
        new Date(right.updated_at).getTime() -
        new Date(left.updated_at).getTime()
      );
    })
    .map((repository) => ({
      id: repository.id,
      name: repository.name,
      url: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      issues: repository.open_issues_count,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
      pushedAt: repository.pushed_at,
      archived: repository.archived,
      fork: repository.fork,
      homepage: repository.homepage,
      topics: repository.topics ?? [],
    }));
}

function buildLanguageSummary(repositories: GitHubRepositorySummary[]) {
  const languageCounts = new Map<string, number>();

  for (const repository of repositories) {
    if (!repository.language) {
      continue;
    }

    languageCounts.set(
      repository.language,
      (languageCounts.get(repository.language) ?? 0) + 1,
    );
  }

  return Array.from(languageCounts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 6) satisfies GitHubLanguageSummary[];
}

function buildRepositorySummary(repositories: GitHubRepositorySummary[]) {
  const totalStars = repositories.reduce(
    (sum, repository) => sum + repository.stars,
    0,
  );
  const totalForks = repositories.reduce(
    (sum, repository) => sum + repository.forks,
    0,
  );
  const totalIssues = repositories.reduce(
    (sum, repository) => sum + repository.issues,
    0,
  );
  const topRepo = repositories[0]
    ? {
        name: repositories[0].name,
        stars: repositories[0].stars,
      }
    : null;

  const recentRepo = repositories.length
    ? repositories.reduce<GitHubRepositorySummary | null>(
        (latest, repository) => {
          if (!latest) {
            return repository;
          }

          return new Date(repository.updatedAt).getTime() >
            new Date(latest.updatedAt).getTime()
            ? repository
            : latest;
        },
        null,
      )
    : null;

  return {
    totalRepos: repositories.length,
    totalStars,
    totalForks,
    totalIssues,
    topRepo,
    recentRepo: recentRepo
      ? {
          name: recentRepo.name,
          updatedAt: recentRepo.updatedAt,
        }
      : null,
  } satisfies GitHubRepositorySummaryStats;
}

export async function getGitHubUserDashboard(
  username: string,
): Promise<GitHubDashboardData> {
  const normalizedUsername = username.trim();

  const profile = await fetchGitHubJson<GitHubUser>(
    `/users/${encodeURIComponent(normalizedUsername)}`,
  );
  const repositories = await fetchGitHubJson<GitHubRepository[]>(
    `/users/${encodeURIComponent(normalizedUsername)}/repos?per_page=100&sort=updated&direction=desc`,
  );

  const mappedRepositories = mapRepositories(repositories);

  return {
    profile: mapProfile(profile),
    repositories: mappedRepositories,
    topLanguages: buildLanguageSummary(mappedRepositories),
    repoSummary: buildRepositorySummary(mappedRepositories),
  };
}
