"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedId: string | null;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlots({ slots, selectedId, onSelect }: TimeSlotsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-foreground">Available slots</h3>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.id}
            type="button"
            variant={selectedId === slot.id ? "default" : "outline"}
            size="sm"
            disabled={!slot.available}
            className={cn(!slot.available && "opacity-50")}
            onClick={() => onSelect(slot)}
          >
            {slot.start} – {slot.end}
          </Button>
        ))}
      </div>
    </div>
  );
}
