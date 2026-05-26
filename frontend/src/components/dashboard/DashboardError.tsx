interface DashboardErrorProps {
  message: string;
  code?: string;
  onRetry: () => void;
}

export function DashboardError({
  message,
  code,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-2xl shadow-rose-950/10">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-200/80">
        Search failed
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Unable to load profile
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-100/90">
        {message}
      </p>
      {code ? (
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-rose-200/70">
          {code}
        </p>
      ) : null}
      <button
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl border border-rose-300/30 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
        type="button"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
