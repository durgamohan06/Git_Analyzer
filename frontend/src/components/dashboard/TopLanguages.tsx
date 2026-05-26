import type { GitHubLanguageSummary } from "@/types/github";

interface TopLanguagesProps {
  languages: GitHubLanguageSummary[];
}

export function TopLanguages({ languages }: TopLanguagesProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
            Top languages
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Language distribution
          </h3>
        </div>
      </div>

      {languages.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {languages.map((language) => (
            <span
              key={language.language}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/15"
            >
              {language.language} · {language.count}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">
          No primary languages detected in public repositories.
        </p>
      )}
    </section>
  );
}
