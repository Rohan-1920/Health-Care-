"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Map, X } from "lucide-react";

import { DoctorCard } from "@/components/shared/DoctorCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { MotionButton } from "@/components/shared/MotionButton";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { DoctorSortOption } from "@/lib/types";
import { useSearch } from "@/hooks/useSearch";

const SORT_OPTIONS: { value: DoctorSortOption; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "fee_asc", label: "Fee: Low–High" },
  { value: "fee_desc", label: "Fee: High–Low" },
  { value: "availability", label: "Availability" },
];

function DoctorsListingPageInner() {
  const searchParams = useSearchParams();
  const { state, dispatch, results, cityCounts, reset, filters, updateFilters } = useSearch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleResults = useMemo(() => results.slice(0, visibleCount), [results, visibleCount]);
  const activeChips = [
    ...state.selectedCities.map((city) => ({ label: city, type: "city" as const })),
    ...state.selectedServices.map((service) => ({ label: service, type: "service" as const })),
    ...(state.minRating ? [{ label: `${state.minRating}+ Stars`, type: "rating" as const }] : []),
  ];

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) dispatch({ type: "SET_QUERY", query: q });
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-[60vh] bg-surface pb-16">
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6">
          <SearchBar filters={filters} onChange={updateFilters} />
          <div>
            <h1 className="text-xl font-semibold text-secondary">Find a Dentist Near You</h1>
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <motion.span key={results.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-teal-700">
                {results.length}
              </motion.span>{" "}
              dentists in {state.selectedCities[0] ?? "Canada"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={`${chip.type}-${chip.label}`}
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700"
                onClick={() => {
                  if (chip.type === "city") dispatch({ type: "TOGGLE_CITY", city: chip.label });
                  if (chip.type === "service") dispatch({ type: "TOGGLE_SERVICE", service: chip.label });
                  if (chip.type === "rating") dispatch({ type: "SET_MIN_RATING", value: null });
                }}
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 text-sm font-medium text-secondary">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={state.sortBy}
              aria-label="Sort dentists"
              onChange={(e) =>
                dispatch({
                  type: "SET_SORT",
                  value: e.target.value as DoctorSortOption,
                })
              }
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="button" variant="outline" className="w-fit" onClick={() => setShowMap((s) => !s)}>
            <Map className="mr-2 h-4 w-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 pt-6 lg:px-6">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8">
            <FilterSidebar
              state={state}
              dispatch={dispatch}
              cityCounts={cityCounts}
              onReset={reset}
            />
          </div>
        </aside>

        <div className={`min-w-0 flex-1 space-y-5 ${showMap ? "lg:w-1/2" : ""}`}>
          <div className="flex justify-end lg:hidden">
            <MotionButton>
              <Button
                type="button"
                variant="outline"
                className="border-primary/40"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filters
              </Button>
            </MotionButton>
          </div>

          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
            {visibleResults.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </motion.div>

          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No dentists found"
              subtitle="Try adjusting your filters or search in another city"
              ctaText="Clear Filters"
              onCtaClick={reset}
            />
          ) : null}
          {visibleCount < results.length ? (
            <div className="pt-3 text-center">
              <MotionButton>
                <Button type="button" onClick={() => setVisibleCount((c) => c + 4)}>
                  Load More Dentists
                </Button>
              </MotionButton>
            </div>
          ) : null}
        </div>
        {showMap ? (
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-28 h-[70vh] rounded-2xl border border-border bg-slate-100 p-4">
              <p className="text-sm text-muted-foreground">Map View</p>
              <div className="mt-4 grid h-[calc(100%-2rem)] place-items-center rounded-xl bg-slate-200">
                <span className="text-teal-700">• • • dentist pins</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            <motion.button
              key="filters-backdrop"
              type="button"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-secondary/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="filters-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-[80] max-h-[88vh] overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-base font-semibold text-secondary">Filters</span>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="max-h-[calc(88vh-52px)] overflow-y-auto px-4 pb-8 pt-4">
                <FilterSidebar
                  state={state}
                  dispatch={dispatch}
                  cityCounts={cityCounts}
                  onApply={() => setMobileFiltersOpen(false)}
                  onReset={() => {
                    reset();
                    setMobileFiltersOpen(false);
                  }}
                  className="border-0 shadow-none"
                />
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function DoctorsListingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-surface" aria-hidden />}>
      <DoctorsListingPageInner />
    </Suspense>
  );
}
