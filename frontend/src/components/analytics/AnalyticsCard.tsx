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
      className={`rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur transition-smooth ${className ?? ""}`}
      role="region"
      aria-label={title}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500">
            {title}
          </p>
          {subtitle ? (
            <h3 className="mt-2 text-lg font-semibold text-white leading-tight">
              {subtitle}
            </h3>
          ) : null}
        </div>
        <div className="ml-4 flex items-center">{rightSlot}</div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
