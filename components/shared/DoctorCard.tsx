"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  MapPin,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import { MotionButton } from "@/components/shared/MotionButton";
import { Button } from "@/components/ui/button";
import { formatCad } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

const AVATAR_TINTS = [
  "bg-teal-100",
  "bg-cyan-100",
  "bg-emerald-100",
  "bg-sky-100",
  "bg-teal-50",
  "bg-cyan-50",
] as const;

function avatarTintForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h + name.charCodeAt(i) * (i + 1)) % AVATAR_TINTS.length;
  }
  return AVATAR_TINTS[h];
}

function StarRow({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 shrink-0",
            i < filled
              ? "fill-rating text-rating"
              : "fill-transparent text-muted-foreground/35",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const tint = avatarTintForName(doctor.name);
  const moreServices = doctor.services.length - 2;

  return (
    <motion.article
      initial={false}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn("overflow-hidden rounded-2xl border-0 bg-white shadow-md")}
    >
      <div className="relative bg-teal-50 p-4">
        <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${doctor.availableToday ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {doctor.availableToday ? "Available Today" : "Next: Tomorrow"}
        </span>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-2 ring-teal-200",
              tint,
            )}
          >
            <Image
              src={doctor.image}
              alt={`${doctor.name}, Dentist at ${doctor.hospital}`}
              width={80}
              height={80}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODAnIGhlaWdodD0nODAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzgwJyBoZWlnaHQ9JzgwJyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary/80" aria-hidden />
              <span>{doctor.hospital}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/80" aria-hidden />
              <span>{doctor.city}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StarRow rating={doctor.rating} />
          <span className="text-sm font-semibold text-slate-700">{doctor.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          <Briefcase className="h-3.5 w-3.5" />
          {doctor.experience} yrs experience
        </p>
        <div className="flex flex-wrap gap-2">
          {doctor.services.slice(0, 2).map((service) => (
            <span key={service} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
              {service}
            </span>
          ))}
          {moreServices > 0 ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">+{moreServices} more</span> : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border p-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Est. visit range</p>
          <p className="text-lg font-bold leading-tight text-teal-700">
            {formatCad(doctor.feeMin)}
            <span className="mx-1 font-normal text-slate-400">–</span>
            {formatCad(doctor.feeMax)}
          </p>
        </div>
        <MotionButton>
          <Button className="rounded-full bg-primary px-5 hover:bg-primary-hover" asChild>
            <Link href={`/book/${doctor.id}`}>Book Now</Link>
          </Button>
        </MotionButton>
      </div>
    </motion.article>
  );
}
