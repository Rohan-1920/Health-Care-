"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function ForDentists() {
  return (
    <section className="bg-gradient-to-br from-teal-600 to-teal-800 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-sm uppercase tracking-widest text-white/90">For Dental Professionals</p>
          <h2 className="mt-3 text-4xl font-bold">Grow Your Practice with SehatBook</h2>
          <p className="mt-4 max-w-xl text-white/80">
            Join Canada&apos;s fastest-growing dental network and connect with patients actively looking for dental care in your city.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Free to join", "Verified patient leads", "Manage bookings online"].map((pill) => (
              <span key={pill} className="rounded-full bg-white px-3 py-1 text-sm text-teal-700">
                {pill}
              </span>
            ))}
          </div>
          <Link href="/doctor/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-teal-700 shadow transition hover:scale-[1.02] hover:shadow-lg">
            Join as a Dentist
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-sm underline">Learn more about how it works</p>
        </div>

        <div className="space-y-3 lg:col-span-2">
          {[
            ["2,400+", "New patients per month"],
            ["4.9 Stars", "Average dentist rating"],
            ["Under 2 minutes", "Average booking time"],
          ].map((item, index) => (
            <motion.div
              key={item[0]}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`rounded-xl bg-white p-4 text-teal-900 shadow ${index === 1 ? "ml-4" : ""} ${index === 2 ? "ml-8" : ""}`}
            >
              <p className="text-2xl font-bold text-teal-700">{item[0]}</p>
              <p className="text-sm text-slate-600">{item[1]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
