"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Activity, DayPlan, Itinerary, TripPreferences } from "@/types";

const initialPreferences: TripPreferences = {
  destination: "Kyoto",
  durationDays: 3,
  totalBudget: 800,
  travelerType: "group",
  pace: "moderate",
  dietaryRestrictions: [],
};

const mockPlans: DayPlan[] = [
  {
    dayNumber: 1,
    date: "Apr 12",
    activities: [
      {
        id: "d1-1",
        timeSlot: "8:30 AM",
        title: "Nishiki Market breakfast",
        description: "Street snacks and tea tasting along the covered arcade.",
        cost: 18,
        location: "Nishiki Market",
        type: "food",
        fatigueScore: 2,
      },
      {
        id: "d1-2",
        timeSlot: "10:30 AM",
        title: "Fushimi Inari hike",
        description: "Walk the vermilion torii gates toward the upper shrine.",
        cost: 0,
        location: "Fushimi Inari Taisha",
        type: "outdoor",
        fatigueScore: 4,
      },
      {
        id: "d1-3",
        timeSlot: "2:00 PM",
        title: "Gion walking circuit",
        description: "Hanamikoji street, Yasaka Shrine, and canal-side photos.",
        cost: 8,
        location: "Gion",
        type: "outdoor",
        fatigueScore: 3,
      },
      {
        id: "d1-4",
        timeSlot: "6:30 PM",
        title: "Kaiseki dinner",
        description: "Seasonal multi-course meal in a machiya dining room.",
        cost: 85,
        location: "Pontocho",
        type: "food",
        fatigueScore: 1,
      },
    ],
  },
  {
    dayNumber: 2,
    date: "Apr 13",
    activities: [
      {
        id: "d2-1",
        timeSlot: "9:00 AM",
        title: "Arashiyama bamboo grove",
        description: "Early walk through the grove before tour groups arrive.",
        cost: 0,
        location: "Arashiyama",
        type: "outdoor",
        fatigueScore: 3,
      },
      {
        id: "d2-2",
        timeSlot: "11:30 AM",
        title: "Tenryu-ji temple & garden",
        description: "UNESCO temple with a landscaped pond garden.",
        cost: 12,
        location: "Arashiyama",
        type: "outdoor",
        fatigueScore: 2,
      },
      {
        id: "d2-3",
        timeSlot: "3:00 PM",
        title: "Matcha workshop",
        description: "Whisk and taste ceremonial-grade matcha with wagashi.",
        cost: 28,
        location: "Sannenzaka",
        type: "indoor",
        fatigueScore: 1,
      },
      {
        id: "d2-4",
        timeSlot: "7:00 PM",
        title: "Tofu kaiseki",
        description: "Temple-style tofu courses with mountain vegetables.",
        cost: 42,
        location: "Sagano",
        type: "food",
        fatigueScore: 1,
      },
    ],
  },
  {
    dayNumber: 3,
    date: "Apr 14",
    activities: [
      {
        id: "d3-1",
        timeSlot: "9:30 AM",
        title: "Kiyomizu-dera",
        description: "Wooden terrace views over the city and hillside streets.",
        cost: 8,
        location: "Higashiyama",
        type: "outdoor",
        fatigueScore: 4,
      },
      {
        id: "d3-2",
        timeSlot: "1:00 PM",
        title: "Kyoto Railway Museum",
        description: "Historic trains, simulators, and a covered observation deck.",
        cost: 15,
        location: "Umekoji",
        type: "indoor",
        fatigueScore: 2,
      },
      {
        id: "d3-3",
        timeSlot: "4:00 PM",
        title: "Philosopher’s Path",
        description: "Canal walk lined with cherry trees and small shrines.",
        cost: 0,
        location: "Sakyo",
        type: "outdoor",
        fatigueScore: 3,
      },
      {
        id: "d3-4",
        timeSlot: "7:30 PM",
        title: "Ramen counter",
        description: "Late-night tonkotsu and gyoza in a 10-seat shop.",
        cost: 16,
        location: "Kawaramachi",
        type: "food",
        fatigueScore: 1,
      },
    ],
  },
];

const rainSwaps: Record<string, Partial<Activity>> = {
  "d1-2": {
    title: "Fushimi sake tasting hall",
    description: "Covered kura visits and flights instead of the hillside hike.",
    location: "Fushimi",
    type: "indoor",
    fatigueScore: 1,
    cost: 22,
  },
  "d1-3": {
    title: "Gion folk craft museum",
    description: "Textiles, fans, and a tea room while the streets stay wet.",
    location: "Gion",
    type: "indoor",
    fatigueScore: 1,
    cost: 10,
  },
  "d2-1": {
    title: "Arashiyama monkey park café",
    description: "Indoor seating with grove views; skip the exposed trail.",
    location: "Arashiyama",
    type: "indoor",
    fatigueScore: 1,
    cost: 8,
  },
  "d2-2": {
    title: "Tenryu-ji cloud-dragon hall",
    description: "Stay under the temple roof and view the garden from corridors.",
    location: "Arashiyama",
    type: "indoor",
    fatigueScore: 1,
  },
  "d3-1": {
    title: "Kiyomizu treasure hall",
    description: "Indoor relics and covered cloisters; skip the open terrace.",
    location: "Higashiyama",
    type: "indoor",
    fatigueScore: 2,
  },
  "d3-3": {
    title: "Eikan-do indoor galleries",
    description: "Painted screens and a quiet hall instead of the canal path.",
    location: "Sakyo",
    type: "indoor",
    fatigueScore: 1,
    cost: 10,
  },
};

const badgeStyles: Record<Activity["type"], string> = {
  indoor: "bg-sky-50 text-sky-800 ring-sky-200/80",
  outdoor: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  food: "bg-amber-50 text-amber-900 ring-amber-200/80",
};

const paces: TripPreferences["pace"][] = ["relaxed", "moderate", "packed"];

function clonePlans(plans: DayPlan[]): DayPlan[] {
  return plans.map((day) => ({
    ...day,
    activities: day.activities.map((activity) => ({ ...activity })),
  }));
}

function sumCost(plans: DayPlan[]): number {
  return plans.reduce(
    (total, day) =>
      total + day.activities.reduce((sum, activity) => sum + activity.cost, 0),
    0,
  );
}

function buildItinerary(destination: string, durationDays: number): Itinerary {
  const dailyPlans = clonePlans(mockPlans).filter(
    (day) => day.dayNumber <= Math.min(Math.max(durationDays, 1), mockPlans.length),
  );
  return {
    tripName: `${destination} itinerary`,
    dailyPlans,
    totalEstimatedCost: sumCost(dailyPlans),
  };
}

function applyRainReplan(itinerary: Itinerary): Itinerary {
  const dailyPlans = clonePlans(itinerary.dailyPlans).map((day) => ({
    ...day,
    activities: day.activities.map((activity) => {
      const swap = rainSwaps[activity.id];
      if (swap) return { ...activity, ...swap };
      if (activity.type === "outdoor") {
        return { ...activity, type: "indoor" as const, fatigueScore: 1 };
      }
      return activity;
    }),
  }));
  return {
    ...itinerary,
    dailyPlans,
    totalEstimatedCost: sumCost(dailyPlans),
  };
}

function applyFatigueReplan(itinerary: Itinerary): Itinerary {
  const dailyPlans = clonePlans(itinerary.dailyPlans).map((day) => ({
    ...day,
    activities: day.activities
      .filter((activity) => activity.fatigueScore < 4)
      .map((activity) =>
        activity.fatigueScore >= 3
          ? {
              ...activity,
              title: `Easy ${activity.title.toLowerCase()}`,
              description: `${activity.description} Shortened to keep energy in reserve.`,
              fatigueScore: Math.max(1, activity.fatigueScore - 2),
            }
          : activity,
      ),
  }));
  return {
    ...itinerary,
    dailyPlans,
    totalEstimatedCost: sumCost(dailyPlans),
  };
}

export default function Home() {
  const [preferences, setPreferences] = useState<TripPreferences>(initialPreferences);
  const [groupSize, setGroupSize] = useState(2);
  const [formOpen, setFormOpen] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary>(() =>
    buildItinerary(initialPreferences.destination, initialPreferences.durationDays),
  );

  const remaining = preferences.totalBudget - itinerary.totalEstimatedCost;
  const travelerLabel = groupSize <= 1 ? "Solo" : `Group · ${groupSize}`;
  const dayCountLabel = useMemo(
    () => `${itinerary.dailyPlans.length}-day plan`,
    [itinerary.dailyPlans.length],
  );

  function updatePreference<K extends keyof TripPreferences>(
    key: K,
    value: TripPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  async function generatePlan() {
    if (isGenerating) return;

    const next: TripPreferences = {
      ...preferences,
      travelerType: groupSize <= 1 ? "solo" : "group",
    };
    setPreferences(next);
    setIsGenerating(true);
    setAlert(null);
    setFormOpen(false);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: next, groupSize }),
      });
      const payload = (await response.json()) as Itinerary & { error?: string };
      if (!response.ok || payload.error || !payload.dailyPlans) {
        throw new Error(payload.error ?? "Could not generate an itinerary.");
      }
      setItinerary({
        tripName: payload.tripName,
        totalEstimatedCost: payload.totalEstimatedCost,
        dailyPlans: payload.dailyPlans,
      });
      setAlert(
        `Live plan from Gemini for ${next.destination} · ${next.pace} pace.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not reach the planner.";
      setAlert(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generatePlan();
  }

  function triggerRain() {
    setItinerary((current) => applyRainReplan(current));
    setAlert(
      "Live re-plan: unexpected rain. Outdoor stops were moved indoors and tags updated.",
    );
  }

  function triggerFatigue() {
    setItinerary((current) => applyFatigueReplan(current));
    setAlert(
      "Live re-plan: high fatigue. Strenuous stops were dropped and the remaining day was slowed down.",
    );
  }

  function renderIntakeForm() {
    return (
    <form onSubmit={onFormSubmit} className="flex h-full flex-col">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
          Destination
        </span>
        <input
          required
          value={preferences.destination}
          onChange={(event) => updatePreference("destination", event.target.value)}
          placeholder="Kyoto, Japan"
          className={inputClass}
        />
      </label>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
            Days
          </span>
          <input
            type="number"
            min={1}
            max={7}
            value={preferences.durationDays}
            onChange={(event) =>
              updatePreference("durationDays", Number(event.target.value))
            }
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
            Budget (USD)
          </span>
          <input
            type="number"
            min={50}
            step={10}
            value={preferences.totalBudget}
            onChange={(event) =>
              updatePreference("totalBudget", Number(event.target.value))
            }
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
          Group size
        </span>
        <input
          type="number"
          min={1}
          max={12}
          value={groupSize}
          onChange={(event) => setGroupSize(Number(event.target.value))}
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-teal-100/70">
          {groupSize <= 1 ? "Solo traveler" : `Group of ${groupSize}`}
        </p>
      </label>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
          Pace
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {paces.map((pace) => {
            const selected = preferences.pace === pace;
            return (
              <button
                key={pace}
                type="button"
                onClick={() => updatePreference("pace", pace)}
                className={`rounded-xl px-2 py-2 text-xs font-semibold capitalize transition ${
                  selected
                    ? "bg-white text-teal-900 shadow-sm"
                    : "bg-white/10 text-teal-50 hover:bg-white/16"
                }`}
              >
                {pace}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isGenerating}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
      >
        {isGenerating ? (
          <>
            <Spinner className="h-4 w-4 border-stone-800/30 border-t-stone-900" />
            Planning with Gemini…
          </>
        ) : (
          "Generate itinerary"
        )}
      </button>
    </form>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] text-stone-900">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden w-[340px] shrink-0 flex-col bg-[#0f3d3e] px-6 py-8 text-white lg:flex">
          <Brand />
          <div className="mt-10 flex-1">{renderIntakeForm()}</div>
          <p className="mt-8 text-xs leading-relaxed text-teal-100/60">
            Generate calls /api/plan and Gemini 2.5 Flash. A sample timeline stays
            on screen until the live itinerary arrives.
          </p>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-800">
                AI travel planner
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
                {itinerary.tripName}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>{dayCountLabel}</Chip>
                <Chip>{travelerLabel}</Chip>
                <Chip className="capitalize">{preferences.pace} pace</Chip>
                <Chip>
                  Est. ${itinerary.totalEstimatedCost}
                  <span className="ml-1 text-stone-400">
                    / ${preferences.totalBudget}
                  </span>
                </Chip>
                <Chip className={remaining >= 0 ? "text-teal-800" : "text-rose-700"}>
                  {remaining >= 0
                    ? `$${remaining} remaining`
                    : `$${Math.abs(remaining)} over budget`}
                </Chip>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="rounded-full bg-[#0f3d3e] px-4 py-2 text-sm font-semibold text-white lg:hidden"
            >
              Edit trip
            </button>
          </header>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-800">
                  Live re-plan / disruption
                </p>
                <p className="mt-0.5 text-sm text-stone-600">
                  Trigger a change and the timeline cards update in place.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={triggerRain}
                  className="rounded-full bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-800"
                >
                  Unexpected rain
                </button>
                <button
                  type="button"
                  onClick={triggerFatigue}
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
                  onClick={() => setAlert(null)}
                  className="shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-950"
                >
                  Dismiss
                </button>
              </div>
            ) : null}
          </section>

          <section className="relative mt-8 space-y-10">
            {isGenerating ? (
              <div
                role="status"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#f4efe6]/80 backdrop-blur-[2px]"
              >
                <Spinner className="h-9 w-9 border-teal-200 border-t-teal-800" />
                <p className="text-sm font-medium text-stone-600">
                  Building your live itinerary…
                </p>
              </div>
            ) : null}
            {itinerary.dailyPlans.map((day) => {
              const dayCost = day.activities.reduce(
                (sum, activity) => sum + activity.cost,
                0,
              );
              return (
                <div key={day.dayNumber}>
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                        {day.date ?? `Day ${day.dayNumber}`}
                      </p>
                      <h2 className="text-lg font-semibold text-stone-900">
                        Day {day.dayNumber}
                      </h2>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-stone-500">
                      ${dayCost}
                    </p>
                  </div>

                  <ol className="relative space-y-4 border-l border-teal-200/80 pl-6">
                    {day.activities.map((activity) => (
                      <li key={activity.id} className="relative">
                        <span className="absolute -left-[31px] top-5 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal-600 shadow-sm" />
                        <ActivityCard activity={activity} />
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </section>
        </main>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close trip form"
            className="absolute inset-0 bg-stone-900/40"
            onClick={() => setFormOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#0f3d3e] px-6 py-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm font-semibold text-teal-100"
              >
                Close
              </button>
            </div>
            {renderIntakeForm()}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Spinner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block animate-spin rounded-full border-2 ${className}`}
    />
  );
}

function Brand() {
  return (
    <div>
      <p className="text-lg font-semibold tracking-tight">Waypoint</p>
      <p className="text-xs text-teal-100/70">Day-by-day travel desk</p>
    </div>
  );
}

function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 ${className}`}
    >
      {children}
    </span>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_10px_30px_-18px_rgba(15,118,110,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
          {activity.timeSlot}
        </p>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ${badgeStyles[activity.type]}`}
        >
          {activity.type === "food"
            ? "Food"
            : activity.type === "indoor"
              ? "Indoor"
              : "Outdoor"}
        </span>
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
          <span className="flex items-center gap-0.5" title={`Fatigue ${activity.fatigueScore}/5`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index < activity.fatigueScore ? "bg-rose-400" : "bg-stone-200"
                }`}
              />
            ))}
          </span>
          <p className="text-sm font-semibold tabular-nums text-stone-800">
            {activity.cost === 0 ? "Free" : `$${activity.cost}`}
          </p>
        </div>
      </div>
    </article>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-teal-100/40 focus:border-amber-300/70 focus:bg-white/14";
