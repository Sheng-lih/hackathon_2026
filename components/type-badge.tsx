import type { Activity } from "@/types";

const styles: Record<Activity["type"], string> = {
  indoor:
    "bg-sky-50 text-sky-800 ring-sky-200/80",
  outdoor:
    "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  food: "bg-amber-50 text-amber-900 ring-amber-200/80",
};

const labels: Record<Activity["type"], string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  food: "Food",
};

export function TypeBadge({ type }: { type: Activity["type"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
