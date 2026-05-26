function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-800/80 ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <SkeletonBlock className="h-5 w-40" />
          <div className="mt-6 flex items-center gap-4">
            <SkeletonBlock className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-7 w-60" />
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-28" />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-56" />
      </div>

      <SkeletonBlock className="h-80" />
    </div>
  );
}
