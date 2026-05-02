"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";

import { DoctorCard } from "@/components/shared/DoctorCard";
import type { Doctor } from "@/lib/types";

interface FeaturedDentistsProps {
  doctors: Doctor[];
}

const listParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const trustItems = [
  { Icon: ShieldCheck, label: "Verified profiles" },
  { Icon: Sparkles, label: "Transparent fee ranges" },
  { Icon: CalendarClock, label: "Real availability signals" },
] as const;

export function FeaturedDoctors({ doctors }: FeaturedDentistsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      id="featured"
      aria-labelledby="featured-heading"
      className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-white py-16 md:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-32 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Featured dentists</p>
          <h2
            id="featured-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-800 md:text-4xl lg:text-[2.25rem] lg:leading-tight"
          >
            Book with dentists patients trust
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            Hand-picked, highly rated providers across Canada — clear fees, recent reviews, and booking without phone tag.
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {trustItems.map(({ Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-teal-600 sm:h-4 sm:w-4" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          variants={listParent}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {doctors.map((d) => (
            <motion.div key={d.id} variants={listItem} className="min-h-0">
              <DoctorCard doctor={d} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="/doctors"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700"
          >
            Browse all dentists
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/doctors"
            className="text-sm font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
          >
            Compare by city &amp; treatment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
