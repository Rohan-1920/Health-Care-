"use client";

import { CalendarHeart, Heart, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { SearchBar } from "@/components/shared/SearchBar";
import { useSearch } from "@/hooks/useSearch";

const HERO_ROTATING_LINES = [
  "Open weekends",
  "Near your workplace",
  "Same day appointments",
  "Top rated and verified",
  "Insurance friendly care",
] as const;

export function HeroSection() {
  const router = useRouter();
  const { filters, updateFilters } = useSearch();
  const clipRaw = useId();
  const clipId = `hero-photo-arc-${clipRaw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [rotateIndex, setRotateIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRotateIndex((prev) => (prev + 1) % HERO_ROTATING_LINES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    const trimmed = filters.query.trim();
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.push(qs ? `/doctors?${qs}` : "/doctors");
  };

  return (
    <section
      className="relative isolate min-h-[min(92vh,900px)] w-full overflow-x-clip bg-white pb-14 pt-10 md:pb-20 md:pt-12 lg:pb-28 lg:pt-8"
      aria-labelledby="hero-heading"
    >
      {/* Convex left arc = circle clip; center thoda right bahar (reference jaisa smooth bow) */}
      <svg
        width={1}
        height={1}
        className="pointer-events-none absolute overflow-hidden opacity-0"
        aria-hidden
        focusable={false}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <circle cx="1.1" cy="0.5" r="0.9" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-8 md:px-8 lg:grid-cols-[minmax(0,440px)_minmax(320px,1fr)] lg:gap-6 lg:gap-x-10 lg:pb-4 lg:pt-2 lg:[grid-template-rows:1fr] lg:min-h-[min(86vh,820px)]">
        {/* Left copy — reference jaisa safed block */}
        <div className="relative z-20 order-2 flex w-full flex-col justify-center py-4 lg:order-1 lg:max-w-[480px] lg:py-16 xl:py-20">
          <h1
            id="hero-heading"
            className="text-4xl font-bold leading-[1.08] tracking-tight text-[#4a6572] md:text-[2.75rem] md:leading-[1.06] lg:text-5xl xl:text-[3.25rem]"
          >
            Find your dentists
          </h1>

          <p
            className="mt-3 min-h-[3.25rem] bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent md:min-h-[3.5rem] md:text-[2.75rem] md:leading-[1.06] lg:min-h-[4rem] lg:text-5xl xl:min-h-[4.25rem] xl:text-[3.25rem]"
            aria-live="polite"
            key={rotateIndex}
          >
            {HERO_ROTATING_LINES[rotateIndex]}
          </p>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-600 md:text-[17px] md:leading-[1.65]">
            Opencare is a curated network of top rated dentists. Find one perfect for you and book online instantly.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar filters={filters} onChange={updateFilters} onSubmit={handleSearchSubmit} />
          </div>
        </div>

        {/* Right: tall photo, bleed toward viewport edge + reference-style pills */}
        <div className="relative order-1 min-h-[260px] w-full pb-6 lg:order-2 lg:min-h-[min(82vh,800px)] lg:pb-0">
          <div
            className="
              relative mx-auto h-[300px] max-w-[460px] pt-2
              sm:h-[360px] sm:max-w-[520px]
              lg:absolute lg:bottom-14 lg:left-0 lg:right-[calc((min(100vw,80rem)-100vw)/2)] lg:top-8
              lg:mx-0 lg:h-auto lg:max-w-none lg:pt-0
            "
          >
            <div
              className="relative h-full w-full shadow-[0_24px_70px_-24px_rgba(15,118,110,0.35)] lg:min-h-[min(88vh,840px)]"
              style={{
                clipPath: `url(#${clipId})`,
                WebkitClipPath: `url(#${clipId})`,
              }}
            >
              <div className="relative h-full min-h-[280px] w-full lg:min-h-[min(88vh,840px)]">
                <Image
                  src="/images/hero-dental.png"
                  alt="Patient smiling during a gentle dental exam"
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="(max-width: 1024px) 95vw, 55vw"
                  priority
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-700/[0.06] via-transparent to-transparent"
              />
            </div>

            {/* Floating badges — reference layout, bilkul static */}
            <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
              <div className="absolute right-[10%] top-[11%] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-medium text-[#4a6572] shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80">
                <CalendarHeart className="h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                <span className="whitespace-nowrap">Instant online booking</span>
              </div>
              <div className="absolute left-[6%] top-[44%] flex max-w-[240px] items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-medium text-[#4a6572] shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80">
                <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                <span className="leading-snug">Exclusively 5-star dentists</span>
              </div>
              <div className="absolute bottom-[14%] right-[12%] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-medium text-[#4a6572] shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80">
                <Heart className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
                <span className="whitespace-nowrap">Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Chat"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-xl shadow-teal-900/25 ring-4 ring-white hover:bg-teal-700"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </button>
    </section>
  );
}
