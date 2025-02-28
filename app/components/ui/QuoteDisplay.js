"use client";
import { motion } from "framer-motion";

export function QuoteDisplay({ quote }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-gray-300 italic mb-12 text-center"
    >
      "{quote}"
    </motion.p>
  );
} 