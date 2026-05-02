"use client";

import {
  addDays,
  format,
  isSameDay,
  isWeekend,
  startOfToday,
} from "date-fns";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatCad } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

type Period = "morning" | "afternoon" | "evening";

const SLOT_DEFS: { label: string; period: Period; available: boolean }[] = [
  { label: "09:00 AM", period: "morning", available: true },
  { label: "09:30 AM", period: "morning", available: true },
  { label: "10:00 AM", period: "morning", available: false },
  { label: "02:00 PM", period: "afternoon", available: true },
  { label: "03:00 PM", period: "afternoon", available: true },
  { label: "04:00 PM", period: "afternoon", available: false },
  { label: "06:00 PM", period: "evening", available: true },
  { label: "06:30 PM", period: "evening", available: true },
];

function dayDisabled(date: Date): boolean {
  if (isWeekend(date)) return true;
  const d = date.getDate();
  return d % 9 === 0;
}

export function BookingWidget({
  doctor,
  className,
}: {
  doctor: Doctor;
  className?: string;
}) {
  const router = useRouter();
  const days = useMemo(() => {
    const start = startOfToday();
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, []);

  const defaultDay =
    days.find((d) => !dayDisabled(d)) ?? days[0] ?? startOfToday();

  const [selectedDay, setSelectedDay] = useState<Date>(defaultDay);
  const [period, setPeriod] = useState<Period>("morning");
  const [slot, setSlot] = useState<string | null>(null);
  const [videoOn, setVideoOn] = useState(false);

  const slotsForPeriod = SLOT_DEFS.filter((s) => s.period === period);

  const feeLabel = `${formatCad(doctor.feeMin)} per visit`;

  const confirm = () => {
    if (!slot || dayDisabled(selectedDay)) return;
    const dateStr = format(selectedDay, "yyyy-MM-dd");
    const qs = new URLSearchParams({
      date: dateStr,
      time: slot,
      ...(videoOn ? { video: "1" } : {}),
    });
    router.push(`/book/${doctor.id}?${qs.toString()}`);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-lg lg:sticky lg:top-24",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-secondary">Book an Appointment</h3>
      <p className="mt-2 text-sm font-bold text-primary">{feeLabel}</p>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Select date
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((d) => {
            const disabled = dayDisabled(d);
            const selected = isSameDay(d, selectedDay);
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedDay(d);
                  setSlot(null);
                }}
                className={cn(
                  "flex min-w-[4.25rem] flex-col items-center rounded-xl border px-2 py-2 text-center text-xs transition-colors duration-200",
                  disabled &&
                    "cursor-not-allowed border-transparent bg-muted text-muted-foreground opacity-50",
                  !disabled &&
                    !selected &&
                    "border-border bg-background text-secondary hover:border-primary hover:bg-primary-light/40",
                  !disabled &&
                    selected &&
                    "border-primary bg-primary text-primary-foreground shadow-sm",
                )}
              >
                <span className="font-semibold">{format(d, "EEE")}</span>
                <span className="tabular-nums">{format(d, "d")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Time
        </p>
        <div className="flex gap-2 rounded-lg bg-muted/50 p-1">
          {(
            [
              ["morning", "Morning"],
              ["afternoon", "Afternoon"],
              ["evening", "Evening"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setPeriod(key);
                setSlot(null);
              }}
              className={cn(
                "flex-1 rounded-md py-2 text-center text-xs font-semibold transition-colors duration-200",
                period === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {slotsForPeriod.map((s) => {
            const selected = slot === s.label;
            return (
              <button
                key={s.label}
                type="button"
                disabled={!s.available || dayDisabled(selectedDay)}
                onClick={() => s.available && setSlot(s.label)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
                  !s.available || dayDisabled(selectedDay)
                    ? "cursor-not-allowed bg-muted text-muted-foreground line-through opacity-60"
                    : selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-secondary hover:border-primary hover:bg-primary-light/30",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
          <Video className="h-4 w-4 text-primary" aria-hidden />
          Video Consultation Available
        </span>
        <Switch checked={videoOn} onCheckedChange={setVideoOn} />
      </div>

      <Button
        type="button"
        className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!slot || dayDisabled(selectedDay)}
        onClick={confirm}
      >
        Confirm Booking
      </Button>
    </div>
  );
}
