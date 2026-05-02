"use client";

import type { Dispatch } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  DOCTOR_FEE_SLIDER_MAX,
  DOCTOR_FEE_SLIDER_MIN,
  DOCTOR_FEE_SLIDER_STEP,
  dentalServices,
  canadianCities,
} from "@/lib/constants";
import type { DoctorSearchAction } from "@/hooks/useSearch";
import type { DoctorSearchState, GenderFilter } from "@/lib/types";

export interface FilterSidebarProps {
  state: DoctorSearchState;
  dispatch: Dispatch<DoctorSearchAction>;
  cityCounts: Record<string, number>;
  onApply?: () => void;
  onReset: () => void;
  className?: string;
}

function FeeDualRange({
  feeSliderMin,
  feeSliderMax,
  dispatch,
}: {
  feeSliderMin: number;
  feeSliderMax: number;
  dispatch: Dispatch<DoctorSearchAction>;
}) {
  const step = DOCTOR_FEE_SLIDER_STEP;
  const minBound = DOCTOR_FEE_SLIDER_MIN;
  const maxBound = DOCTOR_FEE_SLIDER_MAX;
  const minThumbForward = feeSliderMin >= feeSliderMax - step;

  const maxForMin = Math.max(minBound, feeSliderMax - step);
  const minForMax = Math.min(maxBound, feeSliderMin + step);

  return (
    <div className="relative pt-2 pb-1">
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted"
        aria-hidden
      />
      <input
        type="range"
        min={minBound}
        max={maxForMin}
        step={step}
        value={feeSliderMin}
        aria-label="Minimum fee"
        onChange={(e) =>
          dispatch({ type: "SET_FEE_MIN", value: Number(e.target.value) })
        }
        className={cn(
          "absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md",
          minThumbForward ? "z-[4]" : "z-[3]",
        )}
      />
      <input
        type="range"
        min={minForMax}
        max={maxBound}
        step={step}
        value={feeSliderMax}
        aria-label="Maximum fee"
        onChange={(e) =>
          dispatch({ type: "SET_FEE_MAX", value: Number(e.target.value) })
        }
        className={cn(
          "absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md",
          minThumbForward ? "z-[3]" : "z-[4]",
        )}
      />
    </div>
  );
}

export function FilterSidebar({
  state,
  dispatch,
  cityCounts,
  onApply,
  onReset,
  className,
}: FilterSidebarProps) {
  const ratingOptions: { label: string; value: number | null }[] = [
    { label: "4+ Stars", value: 4 },
    { label: "3+ Stars", value: 3 },
    { label: "Any", value: null },
  ];

  const genderOptions: { label: string; value: GenderFilter }[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Any", value: "any" },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col gap-8 rounded-2xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <section>
        <h3 className="text-sm font-semibold text-secondary">City</h3>
        <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
          {canadianCities.map((city) => {
            const checked = state.selectedCities.includes(city);
            const count = cityCounts[city] ?? 0;
            return (
              <li key={city}>
                <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1.5 hover:bg-muted/60">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => dispatch({ type: "TOGGLE_CITY", city })}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{city}</span>
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-secondary">Service</h3>
        <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
          {dentalServices.map((service) => {
            const checked = state.selectedServices.includes(service);
            return (
              <li key={service}>
                <label className="flex cursor-pointer items-start gap-2 rounded-lg px-1 py-1 hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => dispatch({ type: "TOGGLE_SERVICE", service })}
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm leading-snug text-foreground">{service}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-secondary">Fee range</h3>
        <p className="mt-2 text-sm font-semibold text-primary">
          CA${state.feeSliderMin.toLocaleString()} – CA${state.feeSliderMax.toLocaleString()}
        </p>
        <FeeDualRange
          feeSliderMin={state.feeSliderMin}
          feeSliderMax={state.feeSliderMax}
          dispatch={dispatch}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold text-secondary">Rating</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {ratingOptions.map((opt) => {
            const selected = state.minRating === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => dispatch({ type: "SET_MIN_RATING", value: opt.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background text-secondary hover:bg-muted",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-secondary">Gender</h3>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Gender">
          {genderOptions.map((opt) => {
            const selected = state.gender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => dispatch({ type: "SET_GENDER", value: opt.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background text-secondary hover:bg-muted",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-secondary">Availability</p>
          <p className="text-xs text-muted-foreground">Available Today only</p>
        </div>
        <Switch
          checked={state.availableTodayOnly}
          onCheckedChange={(v) => dispatch({ type: "SET_AVAILABLE_TODAY", value: v })}
          aria-label="Available today only"
        />
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => onApply?.()}
        >
          Apply Filters
        </Button>
        <button
          type="button"
          className="text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          onClick={onReset}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
}
