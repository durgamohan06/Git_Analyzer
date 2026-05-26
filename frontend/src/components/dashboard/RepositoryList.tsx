import { formatDate } from "@/lib/formatters";
import type { GitHubRepositorySummary } from "@/types/github";

interface RepositoryListProps {
  repositories: GitHubRepositorySummary[];
}

function RepoBadge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
            Repositories
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Recent highlights
          </h3>
        </div>
        <p className="text-sm text-slate-400">
          Showing top {Math.min(repositories.length, 6)} by stars
        </p>
      </div>

      {repositories.length > 0 ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {repositories.slice(0, 6).map((repository) => (
            <a
              key={repository.id}
              className="group rounded-3xl border border-slate-800 bg-slate-950/60 p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-950/80"
              href={repository.url}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
                    {repository.name}
                  </h4>
                  {repository.description ? (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {repository.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No description available.
                    </p>
                  )}
                </div>
                <RepoBadge>{repository.language ?? "Other"}</RepoBadge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <RepoBadge>{repository.stars} stars</RepoBadge>
                <RepoBadge>{repository.forks} forks</RepoBadge>
                <RepoBadge>{repository.issues} issues</RepoBadge>
                <RepoBadge>
                  Updated {formatDate(repository.updatedAt)}
                </RepoBadge>
                {repository.archived ? <RepoBadge>Archived</RepoBadge> : null}
                {repository.fork ? <RepoBadge>Fork</RepoBadge> : null}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-sm text-slate-400">
          No public repositories found for this account.
        </div>
      )}
    </section>
  );
}
