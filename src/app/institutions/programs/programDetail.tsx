"use client";
import { Program } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  program: Program;
  onApply: (programId: number) => void;
};

export default function ProgramDetail({ program, onApply }: Props) {
  const [applied, setApplied] = useState(program.applied || false);

  const handleApply = () => {
    onApply(program.id);
    setApplied(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 text-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-700"
    >
      <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
      <p className="text-gray-300 mb-2">{program.description}</p>
      <p className="text-sm text-gray-400">Type: {program.program_type}</p>
      <p className="text-sm text-gray-400">
        Status: {program.status === "active" ? "Open" : "Closed"}
      </p>
      <img
        src={program.flyer}
        alt={program.title}
        className="w-44 mt-4 rounded-md"
      />

      <button
        disabled={applied || program.status !== "active"}
        onClick={handleApply}
        className={`mt-4 px-5 py-2 rounded-xl font-semibold transition-colors ${
          applied || program.status !== "active"
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {applied ? "Applied" : "Apply"}
      </button>
    </motion.div>
  );
}
