import type { Activity } from "@/types";
import { TypeBadge } from "@/components/type-badge";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="group rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_10px_30px_-18px_rgba(15,118,110,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
          {activity.timeSlot}
        </p>
        <TypeBadge type={activity.type} />
      </div>
      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-stone-900">
        {activity.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-stone-500">
        {activity.description}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
        <p className="truncate text-xs text-stone-500">{activity.location}</p>
        <div className="flex items-center gap-3">
          <FatigueDots score={activity.fatigueScore} />
          <p className="text-sm font-semibold tabular-nums text-stone-800">
            {activity.cost === 0 ? "Free" : `$${activity.cost}`}
          </p>
        </div>
      </div>
    </article>
  );
}

function FatigueDots({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5" title={`Fatigue ${score}/5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            index < score ? "bg-rose-400" : "bg-stone-200"
          }`}
        />
      ))}
    </span>
  );
}
