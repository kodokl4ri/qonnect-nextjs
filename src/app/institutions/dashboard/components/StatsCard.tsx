"use client";

import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  index,
}: {
  title: string;
  value: any;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-[0_0_20px_var(--accent)] transition"
    >
      <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
        {title}
      </h3>
      <p className="mt-2 text-3xl font-bold text-[var(--accent)]">
        {String(value)}
      </p>
    </motion.div>
  );
}
