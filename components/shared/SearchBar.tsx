"use client";

import { MapPin } from "lucide-react";

import { MotionButton } from "@/components/shared/MotionButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/lib/types";

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onSubmit?: () => void;
}

export function SearchBar({ filters, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] sm:flex-row sm:items-center sm:rounded-full sm:border-slate-200 sm:py-1 sm:pl-4 sm:pr-1",
      )}
    >
      <label className="flex min-h-[52px] flex-1 cursor-text items-center gap-3 px-3 sm:min-h-0 sm:px-2">
        <span className="sr-only">Address</span>
        <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="text"
          name="address"
          autoComplete="street-address"
          placeholder="Enter your address"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          aria-label="Enter your address"
          className="w-full border-0 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground sm:py-2.5 sm:text-sm md:text-base"
        />
      </label>

      <div className="flex shrink-0 sm:w-auto">
        <MotionButton>
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover sm:h-11 sm:min-w-[158px]"
          >
            Find a dentist
          </Button>
        </MotionButton>
      </div>
    </form>
  );
}
