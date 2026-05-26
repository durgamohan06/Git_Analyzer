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
          className="group rounded-3xl border border-white/10 bg-slate-900/70 p-6 min-h-[108px] shadow-xl shadow-cyan-950/10 transition-smooth card-hover hover:border-cyan-300/30 hover:bg-slate-900/85"
        >
          <p className="text-[11px] uppercase tracking-widest text-slate-500">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white leading-tight">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-slate-400">{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}
