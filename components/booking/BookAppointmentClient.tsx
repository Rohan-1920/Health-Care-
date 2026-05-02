"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { BookingSteps } from "@/components/booking/BookingSteps";
import { CalendarSkeleton } from "@/components/booking/CalendarSkeleton";
import { TimeSlots } from "@/components/booking/TimeSlots";
import { MotionButton } from "@/components/shared/MotionButton";
import { Button } from "@/components/ui/button";
import { mockDoctors } from "@/lib/constants";
import type { TimeSlot } from "@/lib/types";
import { useBooking } from "@/hooks/useBooking";

const BookingCalendar = dynamic(
  () => import("@/components/booking/Calendar").then((mod) => mod.Calendar),
  { ssr: false, loading: () => <CalendarSkeleton /> },
);

const demoSlots: TimeSlot[] = [
  { id: "1", start: "09:00", end: "09:20", available: true },
  { id: "2", start: "09:30", end: "09:50", available: true },
  { id: "3", start: "10:00", end: "10:20", available: false },
  { id: "4", start: "11:00", end: "11:20", available: true },
];

export function BookAppointmentClient() {
  const params = useSearchParams();
  const doctorId = params.get("doctor");
  const {
    doctor,
    date,
    slot,
    step,
    selectDoctor,
    selectDate,
    selectSlot,
    setStep,
    canConfirm,
    reset,
  } = useBooking();

  const [month, setMonth] = useState(() => new Date());

  useEffect(() => {
    if (!doctorId) return;
    const d = mockDoctors.find((x) => x.id === doctorId);
    if (d) selectDoctor(d);
  }, [doctorId, selectDoctor]);

  const doctorOptions = useMemo(() => mockDoctors, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-urdu text-3xl font-semibold text-secondary">Appointment book karein</h1>
          <p className="mt-1 text-muted-foreground">Doctor, date aur slot choose karein.</p>
        </div>
        <Button variant="outline" type="button" onClick={reset}>
          Reset
        </Button>
      </div>

      <BookingSteps step={step} />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Doctor
            <select
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              value={doctor?.id ?? ""}
              onChange={(e) => {
                const d = doctorOptions.find((x) => x.id === e.target.value);
                selectDoctor(d ?? null);
              }}
            >
              <option value="">Select…</option>
              {doctorOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty}
                </option>
              ))}
            </select>
          </label>

          {doctor && (
            <>
              <Suspense fallback={<CalendarSkeleton />}>
                <BookingCalendar
                  value={date}
                  onChange={selectDate}
                  month={month}
                  onMonthChange={setMonth}
                />
              </Suspense>
              {date && (
                <TimeSlots
                  slots={demoSlots}
                  selectedId={slot?.id ?? null}
                  onSelect={selectSlot}
                />
              )}
            </>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground">Doctor:</span> {doctor?.name ?? "—"}
            </li>
            <li>
              <span className="text-foreground">Date:</span>{" "}
              {date ? date.toLocaleDateString() : "—"}
            </li>
            <li>
              <span className="text-foreground">Slot:</span>{" "}
              {slot ? `${slot.start}–${slot.end}` : "—"}
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <MotionButton>
              <Button
                type="button"
                disabled={!canConfirm}
                onClick={() => {
                  if (!canConfirm) {
                    toast.error("Please fill all required fields");
                    return;
                  }
                  setStep("confirm");
                }}
              >
                Confirm step
              </Button>
            </MotionButton>
            <MotionButton>
              <Button variant="secondary" asChild>
                <Link href="/patient/dashboard">Dashboard</Link>
              </Button>
            </MotionButton>
          </div>
          {step === "confirm" && canConfirm && (
            <p className="mt-4 rounded-md bg-primary-light p-3 text-sm text-secondary">
              Demo flow complete — backend integrate karte waqt yahan payment / SMS hooks lagayein.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
