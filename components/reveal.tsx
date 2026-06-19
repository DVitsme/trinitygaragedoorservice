"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper — replaces the dc-runtime IntersectionObserver `.reveal` behavior
 * with Motion's `whileInView` (fade + 16px rise, once).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
