"use client";

import type { FormEvent, ReactNode } from "react";
import type { TripPreferences } from "@/types";

const paces: TripPreferences["pace"][] = ["relaxed", "moderate", "packed"];

type TripFormProps = {
  preferences: TripPreferences;
  groupSize: number;
  onPreferencesChange: (next: TripPreferences) => void;
  onGroupSizeChange: (size: number) => void;
  onSubmit: () => void;
};

export function TripForm({
  preferences,
  groupSize,
  onPreferencesChange,
  onGroupSizeChange,
  onSubmit,
}: TripFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function update<K extends keyof TripPreferences>(
    key: K,
    value: TripPreferences[K],
  ) {
    onPreferencesChange({ ...preferences, [key]: value });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="space-y-5">
        <Field label="Destination">
          <input
            required
            value={preferences.destination}
            onChange={(event) => update("destination", event.target.value)}
            placeholder="Kyoto, Japan"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Days">
            <input
              type="number"
              min={1}
              max={4}
              value={preferences.durationDays}
              onChange={(event) =>
                update("durationDays", Number(event.target.value))
              }
              className={inputClass}
            />
          </Field>
          <Field label="Budget (USD)">
            <input
              type="number"
              min={50}
              step={10}
              value={preferences.totalBudget}
              onChange={(event) =>
                update("totalBudget", Number(event.target.value))
              }
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Group size">
          <input
            type="number"
            min={1}
            max={12}
            value={groupSize}
            onChange={(event) => onGroupSizeChange(Number(event.target.value))}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-teal-100/70">
            {groupSize <= 1 ? "Solo traveler" : `Group of ${groupSize}`}
          </p>
        </Field>

        <fieldset>
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
                  onClick={() => update("pace", pace)}
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
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-200"
      >
        Generate itinerary
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-teal-100/40 focus:border-amber-300/70 focus:bg-white/14";
