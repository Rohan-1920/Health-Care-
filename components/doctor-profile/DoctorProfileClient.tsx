"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Check,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { BookingWidget } from "@/components/doctor-profile/BookingWidget";
import { DoctorCard } from "@/components/shared/DoctorCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockDoctors } from "@/lib/constants";
import {
  bioParagraphs,
  clinicAddress,
  defaultEducation,
  dentalServicesForDoctor,
  getRatingDistribution,
  getReviewsForDoctor,
  googleMapsUrl,
} from "@/lib/doctorProfile";
import type { Doctor } from "@/lib/types";

function RatingBars({ rows }: { rows: { stars: number; pct: number }[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.stars} className="flex items-center gap-3 text-sm">
          <span className="w-10 tabular-nums text-muted-foreground">
            {row.stars}★
          </span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${row.pct}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="w-10 text-right tabular-nums text-muted-foreground">
            {row.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function DoctorProfileClient({ doctor }: { doctor: Doctor }) {
  const [tab, setTab] = useState("about");
  const [reviewsShown, setReviewsShown] = useState(3);

  const reviews = useMemo(() => getReviewsForDoctor(doctor.id), [doctor.id]);
  const distribution = useMemo(
    () => getRatingDistribution(doctor.rating, doctor.reviewCount),
    [doctor.rating, doctor.reviewCount],
  );
  const education = defaultEducation();
  const services = dentalServicesForDoctor(doctor);
  const bio = bioParagraphs(doctor);
  const address = clinicAddress(doctor);
  const mapsUrl = googleMapsUrl(doctor);

  const similar = useMemo(
    () => mockDoctors.filter((d) => d.id !== doctor.id).slice(0, 3),
    [doctor.id],
  );

  const sortedLangs = useMemo(() => {
    const langs = [...doctor.languages];
    langs.sort((a, b) => {
      if (a === "English") return -1;
      if (b === "English") return 1;
      return a.localeCompare(b);
    });
    return langs;
  }, [doctor.languages]);

  return (
    <div className="min-h-screen bg-background pb-44 lg:pb-12">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary via-teal-600 to-teal-900 px-4 pb-12 pt-10 text-white sm:px-6 lg:pb-14 lg:pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex shrink-0 justify-center md:justify-start">
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full ring-4 ring-white shadow-xl">
              <Image
                src={doctor.image}
                alt={`${doctor.name}, Dentist at ${doctor.hospital}`}
                width={120}
                height={120}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgZmlsbD0nI2U1ZTdlYicvPjwvc3ZnPg=="
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{doctor.name}</h1>
            <div className="space-y-1 text-sm text-white/85">
              <p className="inline-flex items-center justify-center gap-2 md:justify-start">
                <Building2 className="h-4 w-4 shrink-0 text-white/90" aria-hidden />
                {doctor.hospital}
              </p>
              <p className="inline-flex items-center justify-center gap-2 md:justify-start">
                <MapPin className="h-4 w-4 shrink-0 text-white/90" aria-hidden />
                {doctor.city}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                {doctor.experience} Years Experience
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Check className="h-3.5 w-3.5 text-emerald-200" aria-hidden />
                Verified
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                {doctor.rating.toFixed(1)} Rating
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {sortedLangs.map((lang) => (
                <span
                  key={lang}
                  className={cn(
                    "rounded-full border border-white/35 px-3 py-1 text-xs font-semibold backdrop-blur-sm",
                    lang === "English" && "bg-white text-primary",
                  )}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10 lg:px-6">
        <div className="min-w-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1 sm:flex-nowrap">
              <TabsTrigger value="about" className="flex-1">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="location" className="flex-1">
                Location
              </TabsTrigger>
              <TabsTrigger value="similar" className="flex-1">
                Similar Dentists
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              {tab === "about" ? (
                <div className="space-y-10">
                  <div className="space-y-4 text-muted-foreground">
                    {bio.map((p, i) => (
                      <p key={i} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary">Education</h3>
                    <div className="relative mt-6 border-l-2 border-primary/40 pl-6">
                      {education.map((item, idx) => (
                        <div key={idx} className="relative pb-8 last:pb-0">
                          <span className="absolute -left-[31px] top-1 flex h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-primary/15" />
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            {item.year}
                          </p>
                          <p className="font-semibold text-secondary">{item.degree}</p>
                          <p className="text-sm text-muted-foreground">{item.institution}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary">Services offered</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "reviews" ? (
                <div className="space-y-8">
                  <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-5xl font-bold tabular-nums text-secondary">
                        {doctor.rating.toFixed(1)}{" "}
                        <span className="text-xl font-semibold text-muted-foreground">/ 5</span>
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Based on {doctor.reviewCount.toLocaleString()} reviews
                      </p>
                    </div>
                  </div>
                  <RatingBars rows={distribution} />

                  <div className="space-y-4">
                    {reviews.slice(0, reviewsShown).map((r) => (
                      <article
                        key={r.id}
                        className="rounded-xl border border-border bg-card p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-secondary">{r.patientLabel}</span>
                          {r.verified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                              Verified
                            </span>
                          ) : null}
                          <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                              key={i}
                              whileHover={{ scale: 1.12 }}
                              transition={{ duration: 0.2, delay: i * 0.05 }}
                              className="inline-flex"
                            >
                              <Star
                                className={cn(
                                  "h-4 w-4 transition-colors duration-200",
                                  i < r.rating
                                    ? "fill-rating text-rating hover:text-amber-400"
                                    : "fill-transparent text-muted-foreground/35 hover:text-amber-300",
                                )}
                                aria-hidden
                              />
                            </motion.span>
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                      </article>
                    ))}
                  </div>

                  {reviewsShown < reviews.length ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-primary hover:text-primary"
                      onClick={() => setReviewsShown((n) => Math.min(n + 3, reviews.length))}
                    >
                      Load More Reviews
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {tab === "location" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary">
                      <Building2 className="h-5 w-5 text-primary" aria-hidden />
                      {doctor.hospital}
                    </h3>
                    <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {address}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-secondary">
                      <Clock className="h-4 w-4 text-primary" aria-hidden />
                      Timings
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-border bg-muted/40">
                            <td className="px-4 py-3 font-medium text-secondary">Mon – Sat</td>
                            <td className="px-4 py-3 text-muted-foreground">9:00 AM – 5:00 PM</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium text-secondary">Sun</td>
                            <td className="px-4 py-3 text-muted-foreground">Closed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/40">
                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                      <MapPin className="h-10 w-10 text-muted-foreground" aria-hidden />
                      <p className="text-sm text-muted-foreground">Map preview</p>
                      <Button variant="outline" asChild>
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                          View on Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "similar" ? (
                <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
                  {similar.map((d) => (
                    <div key={d.id} className="min-w-[min(100%,420px)] max-w-md shrink-0 snap-start">
                      <DoctorCard doctor={d} />
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <p className="mt-10 text-center text-sm text-muted-foreground lg:text-left">
            <Link href="/patient/doctors" className="text-primary hover:underline">
              ← Sab dentists
            </Link>
          </p>
        </div>

        <aside className="hidden lg:block">
          <BookingWidget doctor={doctor} />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <BookingWidget doctor={doctor} className="border-0 p-0 shadow-none lg:sticky lg:top-24" />
      </div>
    </div>
  );
}
