"use client";
import { useState } from "react";

interface ProgramFilterProps {
  onFilterChange: (filters: { program_type?: string; status?: string }) => void;
}

const ProgramFilter: React.FC<ProgramFilterProps> = ({ onFilterChange }) => {
  const [programType, setProgramType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleChange = () => {
    onFilterChange({
      program_type: programType || undefined,
      status: status || undefined,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={programType}
        onChange={(e) => {
          setProgramType(e.target.value);
          handleChange();
        }}
        className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
      >
        <option value="">All Types</option>
        <option value="education">Education</option>
        <option value="social">Social</option>
      </select>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          handleChange();
        }}
        className="p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
      >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

export default ProgramFilter;
