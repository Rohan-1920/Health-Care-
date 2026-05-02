"use client";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/shared/MotionButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooking } from "@/hooks/useBooking";
import { formatCad } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

const concerns = [
  "Routine Checkup",
  "Teeth Cleaning",
  "Toothache / Pain",
  "Braces Consultation",
  "Root Canal",
  "Teeth Whitening",
  "Extraction",
  "Implants",
  "Other",
] as const;

const relations = ["Parent", "Spouse", "Child", "Sibling", "Other"] as const;
const periods = ["morning", "afternoon", "evening"] as const;
type DayPeriod = (typeof periods)[number];

const slotMap: Record<DayPeriod, { time: string; full?: boolean }[]> = {
  morning: [
    { time: "09:00 AM" },
    { time: "09:30 AM" },
    { time: "10:00 AM", full: true },
    { time: "10:30 AM" },
    { time: "11:00 AM" },
    { time: "11:30 AM", full: true },
  ],
  afternoon: [
    { time: "01:00 PM" },
    { time: "01:30 PM", full: true },
    { time: "02:00 PM" },
    { time: "02:30 PM" },
    { time: "03:00 PM" },
    { time: "03:30 PM", full: true },
  ],
  evening: [
    { time: "05:00 PM" },
    { time: "05:30 PM" },
    { time: "06:00 PM", full: true },
    { time: "06:30 PM" },
    { time: "07:00 PM" },
    { time: "07:30 PM" },
  ],
};

const schema = z
  .object({
    fullName: z.string().min(3, "Full name kam az kam 3 characters hona chahiye"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    dentalConcern: z.enum(concerns),
    notes: z.string().max(300, "Notes max 300 characters").optional().or(z.literal("")),
    patientType: z.enum(["myself", "family"]),
    familyMemberName: z.string().optional(),
    relation: z.string().optional(),
    firstVisit: z.boolean().default(false),
  })
  .superRefine((v, ctx) => {
    if (v.patientType === "family") {
      if (!v.familyMemberName || v.familyMemberName.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: ["familyMemberName"], message: "Family member name required hai" });
      }
      if (!v.relation || v.relation.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: ["relation"], message: "Relation required hai" });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

function getCalendarDays(month: Date) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const arr: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    arr.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return arr;
}

function Stepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const labels = ["Date & Time", "Your Details", "Confirm"] as const;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <ol className="grid grid-cols-3 gap-3 sm:gap-6">
        {labels.map((label, idx) => {
          const n = (idx + 1) as 1 | 2 | 3;
          const isCompleted = n < currentStep;
          const isActive = n === currentStep;

          return (
            <li key={label} className="flex flex-col items-center">
              <div className="flex w-full items-center justify-center">
                {idx > 0 ? (
                  <span className={cn("mr-2 h-1 flex-1 rounded-full", n <= currentStep ? "bg-primary" : "bg-border")} />
                ) : (
                  <span className="mr-2 hidden flex-1 sm:block" />
                )}

                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    (isActive || isCompleted) && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : n}
                </span>

                {idx < 2 ? (
                  <span className={cn("ml-2 h-1 flex-1 rounded-full", n < currentStep ? "bg-primary" : "bg-border")} />
                ) : (
                  <span className="ml-2 hidden flex-1 sm:block" />
                )}
              </div>
              <p className="mt-2 text-center text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SuccessCard({ doctor, date, slot }: { doctor: Doctor; date: Date | null; slot: string | null }) {
  useEffect(() => {
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center shadow-lg">
      <motion.svg viewBox="0 0 60 60" className="mx-auto h-16 w-16" initial="hidden" animate="show">
        <motion.circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="#0d9488"
          strokeWidth="3"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M18 31l8 8 16-16"
          fill="none"
          stroke="#0d9488"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.svg>

      <h2 className="mt-4 text-2xl font-bold text-emerald-700">Appointment Confirmed!</h2>
      <div className="mt-3 inline-flex rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary">#DNT-2847</div>
      <p className="mt-3 text-sm text-emerald-900">{doctor.name}</p>
      <p className="text-sm text-emerald-900">{date ? format(date, "EEEE, MMMM d, yyyy") : "-"} · {slot ?? "-"}</p>
      <p className="mt-2 text-sm text-emerald-800">We&apos;ll send a reminder before your visit.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <MotionButton>
          <Button asChild className="flex-1">
            <Link href="/dashboard">View in Dashboard</Link>
          </Button>
        </MotionButton>
        <MotionButton>
          <Button variant="ghost" asChild className="flex-1">
            <Link href="/doctors">Book Another Appointment</Link>
          </Button>
        </MotionButton>
      </div>
    </div>
  );
}

export function DoctorBookingFlow({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const { selectedDate, selectedSlot, patientDetails, currentStep, isConfirmed, dispatch } = useBooking();

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [period, setPeriod] = useState<DayPeriod>("morning");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const prevStep = useRef(currentStep);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: patientDetails?.fullName ?? "",
      phone: patientDetails?.phone ?? "",
      dentalConcern: patientDetails?.dentalConcern ?? "Routine Checkup",
      notes: patientDetails?.notes ?? "",
      patientType: patientDetails?.patientType ?? "myself",
      familyMemberName: patientDetails?.familyMemberName ?? "",
      relation: patientDetails?.relation ?? "",
      firstVisit: patientDetails?.firstVisit ?? false,
    },
  });

  const watchType = useWatch({ control: form.control, name: "patientType" });
  const watchFirstVisit = useWatch({ control: form.control, name: "firstVisit" });
  const watchNotes = useWatch({ control: form.control, name: "notes" }) ?? "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const goStep = (next: 1 | 2 | 3) => {
    setDirection(next > prevStep.current ? 1 : -1);
    prevStep.current = next;
    dispatch({ type: "GO_TO_STEP", payload: next });
  };

  const days = useMemo(() => getCalendarDays(month), [month]);
  const today = startOfDay(new Date());
  const slots = slotMap[period];
  const consultationFee = Math.round((doctor.feeMin + doctor.feeMax) / 2);

  const onDetailsContinue = form.handleSubmit(
    (values) => {
      dispatch({ type: "SET_DETAILS", payload: values });
      goStep(3);
    },
    () => {
      toast.error("Please fill all required fields");
    },
  );

  const onConfirm = async () => {
    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      dispatch({ type: "CONFIRM_BOOKING" });
      toast.success("Appointment confirmed!", { description: "Booking ref: #DNT-2847" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <SuccessCard doctor={doctor} date={selectedDate} slot={selectedSlot} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-secondary">Book Appointment</h1>
      <p className="mt-1 text-sm text-muted-foreground">{doctor.name} · {doctor.hospital}</p>

      <Stepper currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.section
          key={currentStep}
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          {currentStep === 1 ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <button type="button" className="rounded-md border border-border p-2 hover:bg-muted" onClick={() => setMonth((m) => subMonths(m, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-lg font-semibold text-secondary">{format(month, "MMMM yyyy")}</h2>
                <button type="button" className="rounded-md border border-border p-2 hover:bg-muted" onClick={() => setMonth((m) => addMonths(m, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const isPast = isBefore(startOfDay(day), today);
                  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const inMonth = isSameMonth(day, month);
                  const isToday = isSameDay(day, today);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={isPast}
                      onClick={() => dispatch({ type: "SET_DATE", payload: day })}
                      className={cn(
                        "h-10 w-10 justify-self-center rounded-full text-sm transition-all duration-200",
                        !inMonth && "text-muted-foreground/35",
                        isPast && "pointer-events-none bg-muted text-muted-foreground/50",
                        !isPast && !selected && "hover:ring-2 hover:ring-primary/60",
                        selected && "bg-primary text-primary-foreground",
                        isToday && !selected && "ring-2 ring-primary",
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedDate ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6">
                      <Tabs value={period} onValueChange={(v) => setPeriod(v as DayPeriod)}>
                        <TabsList className="h-auto w-full rounded-xl border border-border bg-muted/40 p-1">
                          <TabsTrigger value="morning" className="flex-1">Morning ☀</TabsTrigger>
                          <TabsTrigger value="afternoon" className="flex-1">Afternoon</TabsTrigger>
                          <TabsTrigger value="evening" className="flex-1">Evening</TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {slots.map((s) => {
                          const selected = selectedSlot === s.time;
                          return (
                            <button
                              key={s.time}
                              type="button"
                              disabled={Boolean(s.full)}
                              onClick={() => dispatch({ type: "SET_SLOT", payload: s.time })}
                              className={cn(
                                "rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-200",
                                s.full && "cursor-not-allowed border-transparent bg-muted text-muted-foreground",
                                !s.full && !selected && "border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground",
                                !s.full && selected && "border-primary bg-primary text-primary-foreground",
                              )}
                            >
                              {s.time}{s.full ? " · Full" : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-7 flex justify-end">
                <Button
                  type="button"
                  disabled={!selectedDate || !selectedSlot}
                  className="gap-2"
                  onClick={() => goStep(2)}
                >
                  Continue →
                </Button>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <form className="space-y-4" onSubmit={onDetailsContinue}>
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-secondary">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <motion.input id="fullName" whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }} {...form.register("fullName")} className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 outline-none ring-ring focus:ring-2" />
                </div>
                {form.formState.errors.fullName ? <p role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">{form.formState.errors.fullName.message}</p> : null}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-secondary">Phone</label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm">🇨🇦 +1</span>
                  <motion.input id="phone" whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }} {...form.register("phone")} className="w-full rounded-r-lg border border-input bg-background px-3 py-2.5 outline-none ring-ring focus:ring-2" placeholder="5551234567" />
                </div>
                {form.formState.errors.phone ? <p role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p> : null}
              </div>

              <div>
                <label htmlFor="dentalConcern" className="mb-1 block text-sm font-medium text-secondary">Dental Concern</label>
                <select id="dentalConcern" {...form.register("dentalConcern")} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none ring-ring focus:ring-2">
                  {concerns.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-secondary">
                <input type="checkbox" {...form.register("firstVisit")} className="h-4 w-4 rounded border-border text-primary" />
                First visit
              </label>

              <AnimatePresence>
                {watchFirstVisit ? (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      Please arrive 10 minutes early to complete a new patient form at the clinic.
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-secondary">Notes</label>
                <motion.textarea id="notes" whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }} {...form.register("notes")} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none ring-ring focus:ring-2" />
                <p className="mt-1 text-right text-xs text-muted-foreground">{watchNotes.length}/300</p>
                {form.formState.errors.notes ? <p role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">{form.formState.errors.notes.message}</p> : null}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-secondary">Patient Type</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {([
                    ["myself", "Myself"],
                    ["family", "Family Member"],
                  ] as const).map(([value, label]) => {
                    const checked = watchType === value;
                    return (
                      <label key={value} className={cn("cursor-pointer rounded-xl border p-3 text-sm font-medium transition-colors", checked ? "border-primary bg-primary-light" : "border-border hover:bg-muted") }>
                        <input type="radio" value={value} className="sr-only" {...form.register("patientType")} />
                        {label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {watchType === "family" ? (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="familyMemberName" className="mb-1 block text-sm font-medium text-secondary">Family Member Name</label>
                        <motion.input id="familyMemberName" whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }} {...form.register("familyMemberName")} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none ring-ring focus:ring-2" />
                        {form.formState.errors.familyMemberName ? <p role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">{form.formState.errors.familyMemberName.message}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="relation" className="mb-1 block text-sm font-medium text-secondary">Relation</label>
                        <select id="relation" {...form.register("relation")} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none ring-ring focus:ring-2">
                          <option value="">Select relation</option>
                          {relations.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {form.formState.errors.relation ? <p role="alert" aria-live="polite" className="mt-1 text-xs text-red-600">{form.formState.errors.relation.message}</p> : null}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => goStep(1)}>Back</Button>
                <Button type="submit" disabled={!form.formState.isValid}>Continue →</Button>
              </div>
            </form>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary-light">
                    <Image src={doctor.image} alt={doctor.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-secondary">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                  </div>
                  <button type="button" className="text-sm text-primary hover:underline" onClick={() => router.push("/doctors")}>Change</button>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="inline-flex items-center gap-2 text-secondary"><Calendar className="h-4 w-4 text-primary" /> {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "-"}</p>
                      <p className="inline-flex items-center gap-2 text-muted-foreground"><Clock3 className="h-4 w-4 text-primary" /> {selectedSlot ?? "-"}</p>
                    </div>
                    <button type="button" className="text-sm text-primary hover:underline" onClick={() => goStep(1)}>Change</button>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-secondary">{patientDetails?.fullName ?? "-"}</p>
                      <p className="text-muted-foreground">{patientDetails?.phone ?? "-"}</p>
                      <p className="text-muted-foreground">{patientDetails?.dentalConcern ?? "-"}</p>
                    </div>
                    <button type="button" className="text-sm text-primary hover:underline" onClick={() => goStep(2)}>Edit</button>
                  </div>
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Consultation Fee</span><span className="font-semibold text-secondary">{formatCad(consultationFee)}</span></div>
                  <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Pay at Clinic</span>
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{formatCad(consultationFee)}</span></div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button className="h-12 w-full text-base" onClick={onConfirm} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                </Button>
              </motion.div>
            </div>
          ) : null}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
