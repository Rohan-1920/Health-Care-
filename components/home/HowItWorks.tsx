"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TabId = "find" | "book" | "visit";

const tabs: { id: TabId; label: string; Icon: typeof Search }[] = [
  { id: "find", label: "Find", Icon: Search },
  { id: "book", label: "Book", Icon: Calendar },
  { id: "visit", label: "Visit", Icon: Star },
];

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(
  target: number,
  durationMs: number,
  enabled: boolean,
  decimals: number,
  onComplete?: () => void,
) {
  const [display, setDisplay] = useState(0);
  const firedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled) return;
    firedRef.current = false;
    let start: number | null = null;
    let frame = 0;

    const step = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      const v = target * easeOutCubic(t);
      const rounded =
        decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.floor(v);
      setDisplay(rounded);
      if (t < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setDisplay(target);
        if (!firedRef.current) {
          firedRef.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, durationMs, decimals]);

  return display;
}

function StatCard({
  Icon,
  target,
  durationMs,
  decimals,
  suffix,
  prefix,
  label,
  enabled,
  format,
}: {
  Icon: typeof Search;
  target: number;
  durationMs: number;
  decimals: number;
  suffix?: string;
  prefix?: string;
  label: string;
  enabled: boolean;
  format?: (n: number) => string;
}) {
  const [pctDone, setPctDone] = useState(false);
  const isPercent = suffix === "%";
  const countTarget = isPercent ? 100 : target;
  const n = useCountUp(countTarget, durationMs, enabled, decimals, () => {
    if (isPercent) setPctDone(true);
  });

  let text: string;
  if (format) text = format(n);
  else if (isPercent) text = `${Math.round(n)}${pctDone || n >= 100 ? "%" : ""}`;
  else if (target >= 1000) text = `${n.toLocaleString("en-US")}+`;
  else text = String(n);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-sm"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
        <Icon className="h-6 w-6 text-teal-600" aria-hidden />
      </div>
      <p className="mt-4 text-4xl font-bold text-teal-600">
        {prefix}
        {text}
        {!isPercent && suffix ? suffix : null}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function FeatureBullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MiniStars({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-0.5 text-amber-400", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
    </div>
  );
}

function MockFindCard() {
  const rows = [
    { name: "Dr. James Carter", rating: "4.9", dot: "bg-emerald-500" },
    { name: "Dr. Sarah Mitchell", rating: "4.8", dot: "bg-emerald-500" },
    { name: "Dr. Michael Brown", rating: "4.7", dot: "bg-amber-400" },
  ];
  return (
    <div className="rounded-2xl border-l-4 border-teal-400 bg-white p-4 shadow-lg">
      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">New York</div>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2">
            <span className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{r.name}</p>
              <p className="text-xs text-muted-foreground">General Dentistry</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700">{r.rating}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className={cn("ml-auto h-2 w-2 rounded-full", r.dot)} title="Availability" />
                <span className="text-[10px] text-emerald-600">Available</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700">
        View 47 more dentists →
      </button>
    </div>
  );
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

function MockBookCard() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <span className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Dr. James Carter</p>
          <p className="text-xs text-muted-foreground">General Dentistry</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-1">
        {days.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold",
              i === 2 ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-500",
            )}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { t: "9:00 AM", style: "bg-teal-600 text-white border-teal-600" },
          { t: "9:30 AM", style: "border border-slate-200 text-slate-700" },
          { t: "10:00 AM", style: "border border-slate-200 text-slate-700" },
          { t: "2:00 PM", style: "border border-slate-200 text-slate-700" },
          { t: "3:30 PM", style: "border border-slate-200 bg-slate-100 text-slate-400 line-through" },
          { t: "4:00 PM", style: "border border-slate-200 text-slate-700" },
        ].map((slot) => (
          <span
            key={slot.t}
            className={cn(
              "rounded-full px-2 py-2 text-center text-[11px] font-medium",
              slot.style,
            )}
          >
            {slot.t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-2">
        <span className="rounded-full bg-teal-600 px-5 py-2 text-xs font-semibold text-white">
          Confirm Booking
        </span>
        <span className="text-xs font-medium text-emerald-600">Free cancellation</span>
      </div>
    </div>
  );
}

function MockVisitCard() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <div className="flex flex-col items-center pt-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
        >
          <Check className="h-7 w-7 stroke-[3]" aria-hidden />
        </motion.div>
        <p className="mt-4 text-lg font-bold text-slate-800">Appointment Confirmed!</p>
        <span className="mt-2 rounded-full bg-teal-50 px-4 py-1 text-sm font-semibold text-teal-700">
          #DNT-2847
        </span>
      </div>
      <div className="my-5 border-t border-slate-100" />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Doctor</dt>
          <dd className="font-medium text-slate-800">Dr. James Carter</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Date</dt>
          <dd className="font-medium text-slate-800">Monday, March 15</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time</dt>
          <dd className="font-medium text-slate-800">9:00 AM</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Clinic</dt>
          <dd className="max-w-[60%] text-right font-medium text-slate-800">Bright Smile Dental, New York</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col items-center border-t border-slate-50 pt-4">
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Rate your visit</p>
      </div>
    </div>
  );
}

function TabPanelShell({
  step,
  title,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  mockup,
}: {
  step: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  mockup: ReactNode;
}) {
  return (
    <div className="grid min-h-[380px] gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
      <div className="relative">
        <span
          className="pointer-events-none absolute -left-2 -top-4 select-none text-7xl font-bold leading-none text-teal-100 md:-left-4 md:-top-8 md:text-8xl"
          aria-hidden
        >
          {step}
        </span>
        <div className="relative">
          <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
          <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{description}</p>
          <FeatureBullets items={bullets} />
          <Link
            href={ctaHref}
            className="mt-6 inline-flex rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
      <div className="order-first lg:order-none">{mockup}</div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabId>("find");
  const [statsTriggered, setStatsTriggered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setStatsTriggered(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tabContent = useCallback(() => {
    switch (activeTab) {
      case "find":
        return (
          <TabPanelShell
            step="01"
            title="Find the dentist that's right for you."
            description="Our smart search, designed to understand what matters most to you, matches you with the perfect dental provider in your area."
            bullets={[
              "Filter by location, rating and availability",
              "Read verified patient reviews",
              "Compare fees before you book",
            ]}
            ctaLabel="Start Your Search"
            ctaHref="/doctors"
            mockup={<MockFindCard />}
          />
        );
      case "book":
        return (
          <TabPanelShell
            step="02"
            title="Booking is a breeze."
            description="You're just a click away from booking with confidence. No phone calls, no waiting. Select your slot and confirm in seconds."
            bullets={[
              "See real-time available slots",
              "Instant confirmation — no phone tag",
              "Free cancellation up to 2 hours before",
            ]}
            ctaLabel="Book an Appointment"
            ctaHref="/doctors"
            mockup={<MockBookCard />}
          />
        );
      case "visit":
        return (
          <TabPanelShell
            step="03"
            title="Feel refreshed, feel rewarded."
            description="Not only will your visit change how you feel about going to the dentist — you'll leave with a healthier smile and peace of mind."
            bullets={[
              "Verified, top-rated dental professionals",
              "Leave a review to help other patients",
              "Earn rewards for referring friends",
            ]}
            ctaLabel="Find a Dentist"
            ctaHref="/doctors"
            mockup={<MockVisitCard />}
          />
        );
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="w-full bg-surface py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate={sectionInView ? "show" : "hidden"}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-teal-600">Why SehatBook</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800">Curated options, better choices.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            We spent thousands of hours vetting dentists all over America so you can easily find and book a nearby
            dentist that&apos;s perfect for you.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={sectionInView ? "show" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-12 flex flex-col items-center"
        >
          <div
            role="tablist"
            aria-label="How it works steps"
            className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full bg-gray-100 p-1.5"
          >
            {tabs.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  id={`how-tab-${id}`}
                  aria-controls={`how-panel-${id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors md:px-6",
                    active ? "text-teal-600" : "text-slate-500 hover:text-slate-600",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 w-full" id={`how-panel-${activeTab}`} role="tabpanel" aria-labelledby={`how-tab-${activeTab}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {tabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="my-16 border-t border-slate-200/80" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate={sectionInView ? "show" : "hidden"}
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            Icon={Search}
            target={50000}
            durationMs={2000}
            decimals={0}
            label="Dentists Vetted"
            enabled={statsTriggered}
          />
          <StatCard
            Icon={Calendar}
            target={1000000}
            durationMs={2500}
            decimals={0}
            label="Appointments Booked"
            enabled={statsTriggered}
          />
          <StatCard
            Icon={Star}
            target={4.9}
            durationMs={1500}
            decimals={1}
            label="Average Rating"
            enabled={statsTriggered}
            format={(n) => n.toFixed(1)}
          />
          <StatCard
            Icon={DollarSign}
            target={100}
            durationMs={1000}
            decimals={0}
            suffix="%"
            label="Free to Use"
            enabled={statsTriggered}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="mt-16 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          Every dentist on SehatBook is:
        </motion.p>

        <motion.div
          initial="hidden"
          animate={sectionInView ? "show" : "hidden"}
          variants={containerVariants}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              Icon: ShieldCheck,
              iconWrap: "bg-blue-50 text-blue-600",
              title: "License Verified",
              desc: "We verify every dentist's state license before they join our network.",
            },
            {
              Icon: Star,
              iconWrap: "bg-amber-50 text-amber-600",
              title: "Patient Reviewed",
              desc: "Real reviews from verified patients who have visited the practice.",
            },
            {
              Icon: Clock,
              iconWrap: "bg-teal-50 text-teal-600",
              title: "Always Available",
              desc: "Up-to-date availability so you only see dentists who can see you.",
            },
            {
              Icon: CreditCard,
              iconWrap: "bg-green-50 text-green-600",
              title: "Insurance Friendly",
              desc: "Filter by your insurance plan to find dentists who accept your coverage.",
            },
          ].map((b) => (
            <motion.div
              key={b.title}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full [&_svg]:stroke-[2.25]",
                  b.iconWrap,
                )}
              >
                <b.Icon className="h-5 w-5" aria-hidden />
              </div>
              <h4 className="mt-3 font-semibold text-slate-800">{b.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="absolute bottom-6 left-1/2 h-5 w-[200px] -translate-x-1/2 rounded-full bg-teal-200 opacity-40 blur-xl" />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-[1]"
            >
              <div
                className="relative h-[480px] w-[240px] rounded-[2.5rem] border-[8px] border-slate-700 bg-slate-800 p-3 shadow-2xl"
              >
                <div className="absolute left-1/2 top-3 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-slate-700" />
                <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white">
                  <div className="flex items-center gap-2 bg-teal-600 px-4 py-3 text-white">
                    <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 2C8.5 2 6 4.2 6 7v3c0 2.5 2 4 3 4.5V19h6v-4.5c1-.5 3-2 3-4.5V7c0-2.8-2.5-5-6-5z"
                        fill="currentColor"
                        opacity="0.95"
                      />
                      <path d="M9 19h6v2H9v-2z" fill="currentColor" />
                    </svg>
                    <span className="text-sm font-semibold">SehatBook</span>
                  </div>
                  <div className="flex-1 space-y-3 overflow-hidden bg-slate-50 p-3">
                    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                      <div className="flex gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                          JC
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800">Dr. James Carter</p>
                          <p className="text-xs text-muted-foreground">New York, NY</p>
                          <MiniStars className="mt-1" />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between px-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-7 w-7 rounded-full border text-[10px] font-medium leading-7 text-center",
                              i === 2 ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 text-slate-500",
                            )}
                          >
                            {i + 12}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-full bg-teal-600 py-2 text-xs font-semibold text-white"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-around border-t border-slate-200 bg-slate-100 py-2">
                    {[Search, Calendar, Star, ShieldCheck].map((Ic, i) => (
                      <Ic key={i} className="h-4 w-4 text-slate-400" aria-hidden />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border-2 border-teal-100 bg-teal-50 p-8 shadow-sm"
          >
            <svg className="h-12 w-12 text-teal-600" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2C8.5 2 6 4.2 6 7v3c0 2.5 2 4 3 4.5V19h6v-4.5c1-.5 3-2 3-4.5V7c0-2.8-2.5-5-6-5z"
                fill="currentColor"
              />
              <path d="M9 19h6v2H9v-2z" fill="currentColor" />
            </svg>
            <h3 className="mt-4 text-2xl font-bold text-slate-800">Not sure what you need?</h3>
            <p className="mt-2 text-muted-foreground">
              Answer 3 quick questions and we&apos;ll match you with the perfect dentist — for free.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                "Which city are you in?",
                "What service do you need?",
                "When do you want to visit?",
              ].map((q, i) => (
                <li
                  key={q}
                  className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2.5 text-sm text-muted-foreground shadow-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
            <Link
              href="/quiz"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-4 text-base font-semibold text-white transition hover:bg-teal-700"
            >
              Take the Quiz
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">Takes 30 seconds — completely free</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
