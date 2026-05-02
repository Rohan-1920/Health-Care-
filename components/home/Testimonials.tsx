"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const quotes = [
  {
    name: "Hannah B.",
    city: "Vancouver",
    text: "I found an amazing dentist in Vancouver within minutes. The booking was so easy and the clinic was excellent!",
  },
  {
    name: "Jonathan S.",
    city: "Calgary",
    text: "Finally a proper dental booking platform for Canada. No more calling clinics and waiting on hold.",
  },
  {
    name: "Sara M.",
    city: "Toronto",
    text: "Booked a root canal appointment late at night. Got confirmed instantly. Highly recommended!",
  },
  {
    name: "Mike R.",
    city: "Montreal",
    text: "The dentist profiles are very detailed. I could read reviews before choosing. Very trustworthy.",
  },
  {
    name: "Ashley K.",
    city: "Ottawa",
    text: "SehatBook is exactly what Canada needed. Clean, fast and actually works!",
  },
  {
    name: "David T.",
    city: "Halifax",
    text: "Reminder text before my appointment was a great touch. Will definitely use again for my family.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-2 flex justify-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <h2 className="text-center text-3xl font-bold text-secondary md:text-4xl">Patients Love SehatBook</h2>
        <p className="mt-2 text-center text-muted-foreground">Join thousands of happy patients across Canada</p>

        <div className="mt-10 overflow-hidden">
          <motion.div className="flex gap-4" animate={{ x: `-${index * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }}>
            {quotes.map((q) => (
              <motion.figure
                key={q.name}
                className="min-w-full rounded-2xl border border-border bg-white p-6 shadow-md md:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.75rem)]"
              >
                <Quote className="h-12 w-12 text-teal-200" aria-hidden />
                <div className="mt-3 flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 italic text-slate-700">&ldquo;{q.text}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                      {q.name
                        .split(" ")
                        .slice(0, 2)
                        .map((s) => s[0])
                        .join("")}
                    </span>
                    <span className="text-sm text-muted-foreground">{q.name} · {q.city}</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Verified Patient</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {quotes.map((_, dot) => (
            <button key={dot} type="button" aria-label={`Go to testimonial ${dot + 1}`} onClick={() => setIndex(dot)} className={`h-2.5 w-2.5 rounded-full ${index === dot ? "bg-teal-600" : "bg-slate-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
