import { httpGet } from "./http";
import type { GitHubDashboardData } from "@/types/github";

export function searchGitHubUser(username: string) {
  return httpGet<GitHubDashboardData>(
    `/api/github/${encodeURIComponent(username)}`,
  );
}
