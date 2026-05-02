"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Shield, Stethoscope } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "Verified dentists" },
  { icon: Shield, label: "Secure dental booking flow" },
  { icon: Stethoscope, label: "Top dental clinics" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-4 sm:px-6 md:justify-between">
        {items.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 text-secondary"
          >
            <Icon className="h-8 w-8 text-primary" aria-hidden />
            <span className="font-medium">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
