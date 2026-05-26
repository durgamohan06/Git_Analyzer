import { httpGet } from "./http";
import type { GitHubDashboardData } from "@/types/github";

export function searchGitHubUser(username: string) {
  return httpGet<GitHubDashboardData>(
    `/api/github/${encodeURIComponent(username)}`,
  );
}

export function compareGitHubUsers(username1: string, username2: string) {
  return httpGet<unknown>(
    `/api/github/compare/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`,
  );
}
