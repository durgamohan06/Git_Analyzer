interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchBarProps) {
  return (
    <form
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-400">
            GitHub username
          </span>
          <input
            autoComplete="off"
            className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 text-base text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Search a username like vercel or torvalds"
            spellCheck={false}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <button
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search profile"}
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Displaying profile insights, repository highlights, and language
        breakdowns.
      </p>
    </form>
  );
}
