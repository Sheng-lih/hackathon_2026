"use client";

type DisruptionBarProps = {
  alert: string | null;
  onRain: () => void;
  onFatigue: () => void;
  onDismiss: () => void;
};

export function DisruptionBar({
  alert,
  onRain,
  onFatigue,
  onDismiss,
}: DisruptionBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-800">
            Live re-plan / disruption
          </p>
          <p className="mt-0.5 text-sm text-stone-600">
            Simulate a change and watch the day plan update.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRain}
            className="rounded-full bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            Unexpected rain
          </button>
          <button
            type="button"
            onClick={onFatigue}
            className="rounded-full bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-800"
          >
            High fatigue
          </button>
        </div>
      </div>

      {alert ? (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p>{alert}</p>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-950"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
