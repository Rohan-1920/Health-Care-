"use client";

import { motion } from "framer-motion";

export function MotionButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
      {children}
    </motion.div>
  );
}
