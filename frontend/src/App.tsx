import { useState } from "react";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SearchBar } from "@/components/search/SearchBar";
import { searchGitHubUser } from "@/services/github";
import { ApiError } from "@/services/http";
import type { GitHubDashboardData } from "@/types/github";

export default function App() {
  const [query, setQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState<GitHubDashboardData | null>(null);
  const [error, setError] = useState<{ code?: string; message: string } | null>(
    null,
  );

  async function runSearch(username: string) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setDashboard(null);
      setError({ message: "Enter a GitHub username to search." });
      return;
    }

    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d]))*$/i.test(trimmedUsername)) {
      setDashboard(null);
      setError({ message: "Enter a valid GitHub username." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastSearch(trimmedUsername);

    try {
      const data = await searchGitHubUser(trimmedUsername);
      setDashboard(data);
    } catch (caughtError) {
      setDashboard(null);

      if (caughtError instanceof ApiError) {
        if (caughtError.status === 429) {
          setError({
            code: caughtError.code,
            message: "GitHub rate limit exceeded. Please try again shortly.",
          });
        } else if (caughtError.status === 504) {
          setError({
            code: caughtError.code,
            message: "The request timed out. Retry the search.",
          });
        } else if (
          caughtError.status === 404 ||
          caughtError.code === "INVALID_USERNAME"
        ) {
          setError({
            code: caughtError.code,
            message: "That username was not found.",
          });
        } else {
          setError({ code: caughtError.code, message: caughtError.message });
        }
      } else {
        setError({ message: "Unable to load the profile right now." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur xl:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                GitHub Developer Search
              </p>
              <div className="max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Search any GitHub profile and unlock a premium intelligence
                  dashboard.
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
                  Inspect language mix, popularity patterns, activity velocity,
                  and AI-style insights from repository signals in one
                  responsive analytics layer.
                </p>
              </div>
            </div>

            <SearchBar
              isLoading={isLoading}
              value={query}
              onChange={setQuery}
              onSubmit={() => void runSearch(query)}
            />

            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <button
                className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 transition hover:border-cyan-400/40 hover:text-cyan-200"
                type="button"
                onClick={() => setQuery("vercel")}
              >
                vercel
              </button>
              <button
                className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 transition hover:border-cyan-400/40 hover:text-cyan-200"
                type="button"
                onClick={() => setQuery("torvalds")}
              >
                torvalds
              </button>
              <button
                className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 transition hover:border-cyan-400/40 hover:text-cyan-200"
                type="button"
                onClick={() => setQuery("gaearon")}
              >
                gaearon
              </button>
            </div>
          </div>
        </header>

        <section className="flex-1 py-8">
          {isLoading ? <DashboardSkeleton /> : null}

          {!isLoading && error ? (
            <DashboardError
              code={error.code}
              message={error.message}
              onRetry={() => void runSearch(lastSearch || query)}
            />
          ) : null}

          {!isLoading && !error && dashboard ? (
            <AnalyticsDashboard dashboard={dashboard} />
          ) : null}

          {!isLoading && !error && !dashboard ? (
            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/10">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  Overview
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  A fast profile intelligence panel
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Search a public GitHub username to see a compact dashboard
                  with repo summaries, language breakdowns, and the core account
                  metrics that matter first.
                </p>
              </div>

              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-sm leading-7 text-slate-400">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Try these
                </p>
                <ul className="mt-4 space-y-3">
                  <li>• vercel</li>
                  <li>• torvalds</li>
                  <li>• gaearon</li>
                </ul>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}
