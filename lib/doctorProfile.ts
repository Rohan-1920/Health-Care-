import type { Doctor } from "@/lib/types";
import { dentalServices } from "@/lib/constants";

export interface ProfileReview {
  id: string;
  doctorId: string;
  patientLabel: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface EducationItem {
  year: string;
  degree: string;
  institution: string;
}

export const PROFILE_REVIEWS: ProfileReview[] = [
  {
    id: "r1",
    doctorId: "dr-1",
    patientLabel: "Anonymous Patient",
    rating: 5,
    date: "Mar 12, 2026",
    comment:
      "Very smooth visit — the dentist explained everything clearly and the front desk team was friendly and professional.",
    verified: true,
  },
  {
    id: "r2",
    doctorId: "dr-1",
    patientLabel: "Patient A.K.",
    rating: 5,
    date: "Feb 28, 2026",
    comment: "Scaling and polishing were done professionally. Highly recommended.",
    verified: true,
  },
  {
    id: "r3",
    doctorId: "dr-1",
    patientLabel: "Anonymous Patient",
    rating: 4,
    date: "Jan 15, 2026",
    comment: "Root canal ke baad follow-up instructions clear mil gayin.",
    verified: false,
  },
  {
    id: "r4",
    doctorId: "dr-2",
    patientLabel: "Anonymous Patient",
    rating: 5,
    date: "Mar 2, 2026",
    comment: "Whitening results exceeded my expectations and the process was comfortable.",
    verified: true,
  },
  {
    id: "r5",
    doctorId: "dr-2",
    patientLabel: "Patient S.M.",
    rating: 4,
    date: "Feb 10, 2026",
    comment: "The veneers consultation was thorough and easy to understand.",
    verified: true,
  },
];

export function getReviewsForDoctor(doctorId: string): ProfileReview[] {
  const direct = PROFILE_REVIEWS.filter((r) => r.doctorId === doctorId);
  if (direct.length) return direct;
  return PROFILE_REVIEWS.slice(0, 3).map((r, i) => ({
    ...r,
    id: `${doctorId}-${r.id}-${i}`,
    doctorId,
  }));
}

export function getRatingDistribution(
  avgRating: number,
  _totalReviews: number,
): { stars: number; pct: number }[] {
  const bump = Math.round((Math.min(5, Math.max(3, avgRating)) - 4.2) * 12);
  const rows = [
    { stars: 5 as const, pct: Math.min(92, Math.max(52, 72 + bump)) },
    { stars: 4 as const, pct: Math.min(28, Math.max(8, 18 - Math.floor(bump / 3))) },
    { stars: 3 as const, pct: Math.max(2, 7 - Math.floor(bump / 4)) },
    { stars: 2 as const, pct: 2 },
    { stars: 1 as const, pct: 1 },
  ];
  const sum = rows.reduce((s, r) => s + r.pct, 0);
  rows[0].pct += 100 - sum;
  return rows;
}

export function defaultEducation(): EducationItem[] {
  return [
    {
      year: "2008",
      degree: "DDS",
      institution: "University of Toronto Faculty of Dentistry",
    },
    {
      year: "2013",
      degree: "FRCD(C) — General Practice",
      institution: "Royal College of Dentists of Canada",
    },
    {
      year: "2016",
      degree: "Advanced Clinical Fellowship",
      institution: "Canadian dental continuing education programme",
    },
  ];
}

export function dentalServicesForDoctor(doctor: Doctor): string[] {
  if (doctor.services.length) return doctor.services;
  return [...dentalServices].slice(0, 5);
}

export function bioParagraphs(doctor: Doctor): string[] {
  return [
    `${doctor.name} provides comprehensive dental care at ${doctor.hospital} in ${doctor.city}. With ${doctor.experience}+ years of clinical experience, they focus on preventive and restorative treatments.`,
    "Patients receive transparent treatment plans, clear guidance, and structured follow-up so recovery and maintenance stay on track.",
    "If you have previous X-rays or dental records, bring them to your visit — it helps make the consultation more focused and efficient.",
  ];
}

export function clinicAddress(doctor: Doctor): string {
  return `${doctor.hospital}, Main Campus, ${doctor.city}, Canada`;
}

export function googleMapsUrl(doctor: Doctor): string {
  const q = encodeURIComponent(`${doctor.hospital} ${doctor.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
