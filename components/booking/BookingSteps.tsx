"use client";

import { Check } from "lucide-react";

import type { BookingStep } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";

const steps: { id: BookingStep; label: string }[] = [
  { id: "doctor", label: "Doctor" },
  { id: "datetime", label: "Date & time" },
  { id: "confirm", label: "Confirm" },
];

interface BookingStepsProps {
  step: BookingStep;
}

export function BookingSteps({ step }: BookingStepsProps) {
  const idx = steps.findIndex((s) => s.id === step);

  return (
    <ol className="flex flex-wrap items-center gap-2 md:gap-4">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium",
                done && "border-primary bg-primary text-primary-foreground",
                active && !done && "border-primary text-primary",
                !active && !done && "border-muted text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span className={cn("text-sm", active ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="hidden h-px w-8 bg-border md:inline-block" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
