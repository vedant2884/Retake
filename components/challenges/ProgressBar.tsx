export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-graphite-400">
        <span>
          {completed} of {total} complete
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-graphite-800">
        <div
          className="h-full bg-signal-500 transition-[width] duration-slow ease-reveal"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
