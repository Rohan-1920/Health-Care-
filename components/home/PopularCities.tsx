"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cities = [
  ["Toronto", "240+", "from-teal-500 to-cyan-500"],
  ["Vancouver", "190+", "from-teal-600 to-emerald-500"],
  ["Montreal", "140+", "from-cyan-500 to-teal-500"],
  ["Calgary", "120+", "from-emerald-500 to-teal-600"],
  ["Ottawa", "90+", "from-teal-500 to-green-500"],
  ["Halifax", "85+", "from-teal-600 to-cyan-400"],
  ["Edmonton", "110+", "from-cyan-500 to-emerald-500"],
  ["Mississauga", "95+", "from-teal-700 to-cyan-500"],
] as const;

export function PopularCities() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-secondary md:text-4xl">Dentists Across Canada</h2>
        <p className="mt-2 text-center text-muted-foreground">Find top-rated dental care in your city</p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cities.map(([city, count, gradient]) => (
            <motion.div key={city} whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(13,148,136,0.25)" }} transition={{ duration: 0.2 }}>
              <Link href={`/doctors?city=${city}`} className={`relative block aspect-video rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white`}>
                <p className="text-lg font-bold">{city}</p>
                <p className="mt-1 text-sm text-white/85">{count} Dentists</p>
                <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/doctors" className="inline-flex rounded-full border border-teal-200 px-5 py-2 text-sm text-teal-700 hover:bg-teal-50">
            View All Cities
          </Link>
        </div>
      </div>
    </section>
  );
}
