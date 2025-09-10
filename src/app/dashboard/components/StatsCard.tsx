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
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 transition"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <p className="mt-2 text-3xl font-bold text-cyan-400">{String(value)}</p>
    </motion.div>
  );
}
