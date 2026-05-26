import type { PropsWithChildren, ReactNode } from "react";

interface AnalyticsCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  subtitle,
  rightSlot,
  className,
  children,
}: AnalyticsCardProps) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur ${className ?? ""}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {title}
          </p>
          {subtitle ? (
            <h3 className="mt-2 text-lg font-semibold text-white">
              {subtitle}
            </h3>
          ) : null}
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}
