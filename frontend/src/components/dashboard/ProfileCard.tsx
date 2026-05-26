import { formatDate } from "@/lib/formatters";
import type { GitHubProfileOverview } from "@/types/github";

interface ProfileCardProps {
  profile: GitHubProfileOverview;
}

function MetaChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
      {label}
    </span>
  );
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <img
          alt={`${profile.username} avatar`}
          className="h-24 w-24 rounded-3xl border border-slate-700 object-cover shadow-lg shadow-cyan-950/20"
          src={profile.avatarUrl}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            GitHub profile
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {profile.name ?? profile.username}
              </h2>
              <p className="text-base text-slate-400">@{profile.username}</p>
            </div>
            <a
              className="text-sm text-cyan-300 transition hover:text-cyan-200"
              href={profile.htmlUrl}
              rel="noreferrer"
              target="_blank"
            >
              View on GitHub
            </a>
          </div>

          {profile.bio ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {profile.bio}
            </p>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No bio provided.</p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.location ? <MetaChip label={profile.location} /> : null}
            {profile.company ? <MetaChip label={profile.company} /> : null}
            <MetaChip label={`Joined ${formatDate(profile.createdAt)}`} />
            <MetaChip label={`Account age ${profile.accountAge.label}`} />
            {profile.hireable ? <MetaChip label="Hireable" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
