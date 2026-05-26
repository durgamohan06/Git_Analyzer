import { useState } from "react";

interface CompareBarProps {
  onCompare: (a: string, b: string) => void;
  isLoading?: boolean;
}

export function CompareBar({ onCompare, isLoading }: CompareBarProps) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex w-full gap-2">
        <input
          className="flex-1 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/15"
          placeholder="Username A"
          value={left}
          onChange={(e) => setLeft(e.target.value)}
        />
        <input
          className="flex-1 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/15"
          placeholder="Username B"
          value={right}
          onChange={(e) => setRight(e.target.value)}
        />
      </div>

      <div>
        <button
          className="ml-0 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition-smooth hover:bg-cyan-500/14"
          type="button"
          disabled={isLoading}
          onClick={() => onCompare(left, right)}
        >
          Compare
        </button>
      </div>
    </div>
  );
}
