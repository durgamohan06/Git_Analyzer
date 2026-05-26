import type { DeveloperStat } from "@/lib/analytics";

interface DeveloperStatsCardsProps {
  stats: DeveloperStat[];
}

export function DeveloperStatsCards({ stats }: DeveloperStatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="group rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-cyan-950/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900/85"
        >
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-slate-400">{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}
