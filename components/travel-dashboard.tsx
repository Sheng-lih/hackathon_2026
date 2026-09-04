"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Itinerary, TripPreferences } from "@/types";
import { ActivityCard } from "@/components/activity-card";
import { DisruptionBar } from "@/components/disruption-bar";
import { TripForm } from "@/components/trip-form";
import {
  applyFatigueReplan,
  applyRainReplan,
  buildItinerary,
} from "@/lib/mock-itinerary";

const initialPreferences: TripPreferences = {
  destination: "Kyoto",
  durationDays: 4,
  totalBudget: 800,
  travelerType: "group",
  pace: "moderate",
  dietaryRestrictions: [],
};

export function TravelDashboard() {
  const [preferences, setPreferences] = useState<TripPreferences>(initialPreferences);
  const [groupSize, setGroupSize] = useState(2);
  const [itinerary, setItinerary] = useState<Itinerary>(() =>
    buildItinerary(initialPreferences.destination, initialPreferences.durationDays),
  );
  const [alert, setAlert] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const remainingBudget = preferences.totalBudget - itinerary.totalEstimatedCost;
  const travelerLabel =
    groupSize <= 1 ? "Solo" : `Group · ${groupSize}`;

  const dayCountLabel = useMemo(
    () => `${itinerary.dailyPlans.length}-day plan`,
    [itinerary.dailyPlans.length],
  );

  function generate() {
    const next: TripPreferences = {
      ...preferences,
      travelerType: groupSize <= 1 ? "solo" : "group",
    };
    setPreferences(next);
    setItinerary(buildItinerary(next.destination, next.durationDays));
    setAlert(
      `New ${next.pace} plan for ${next.destination} · ${travelerLabel.toLowerCase()}.`,
    );
    setFormOpen(false);
  }

  function replanRain() {
    setItinerary((current) => applyRainReplan(current));
    setAlert(
      "Unexpected rain: outdoor stops moved indoors. Costs and tags updated.",
    );
  }

  function replanFatigue() {
    setItinerary((current) => applyFatigueReplan(current));
    setAlert(
      "High fatigue: strenuous stops dropped and remaining days slowed down.",
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] text-stone-900">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden w-[340px] shrink-0 flex-col bg-[#0f3d3e] px-6 py-8 text-white lg:flex">
          <Brand />
          <div className="mt-10 flex-1">
            <TripForm
              preferences={preferences}
              groupSize={groupSize}
              onPreferencesChange={setPreferences}
              onGroupSizeChange={setGroupSize}
              onSubmit={generate}
            />
          </div>
          <p className="mt-8 text-xs leading-relaxed text-teal-100/60">
            Mock planner — itineraries are generated from local sample data, not a live model.
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
                <MetaChip>{dayCountLabel}</MetaChip>
                <MetaChip>{travelerLabel}</MetaChip>
                <MetaChip className="capitalize">{preferences.pace} pace</MetaChip>
                <MetaChip>
                  Est. ${itinerary.totalEstimatedCost}
                  <span className="ml-1 text-stone-400">
                    / ${preferences.totalBudget}
                  </span>
                </MetaChip>
                <MetaChip
                  className={
                    remainingBudget >= 0 ? "text-teal-800" : "text-rose-700"
                  }
                >
                  {remainingBudget >= 0
                    ? `$${remainingBudget} remaining`
                    : `$${Math.abs(remainingBudget)} over budget`}
                </MetaChip>
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

          <DisruptionBar
            alert={alert}
            onRain={replanRain}
            onFatigue={replanFatigue}
            onDismiss={() => setAlert(null)}
          />

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {itinerary.dailyPlans.map((day) => {
              const dayCost = day.activities.reduce(
                (sum, activity) => sum + activity.cost,
                0,
              );
              return (
                <div key={day.dayNumber} className="min-w-0">
                  <div className="mb-3 flex items-end justify-between">
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
                  <div className="space-y-3">
                    {day.activities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
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
            <TripForm
              preferences={preferences}
              groupSize={groupSize}
              onPreferencesChange={setPreferences}
              onGroupSizeChange={setGroupSize}
              onSubmit={generate}
            />
          </div>
        </div>
      ) : null}
    </div>
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

function MetaChip({
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
