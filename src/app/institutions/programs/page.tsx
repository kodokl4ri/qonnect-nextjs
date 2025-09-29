"use client";
import React, { useEffect, useState } from "react";
import { Program, InstitutionAssessment, Institution } from "@/types";
import {
  fetchPrograms,
  fetchInstitutionAssessments,
  useApplyProgram,
  fetchInstitution,
} from "@/lib/api";
import ProgramCard from "./components/ProgramCard";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assessments, setAssessments] = useState<InstitutionAssessment[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [filters, setFilters] = useState<{
    program_type?: string;
    status?: string;
  }>({});
  const [loading, setLoading] = useState(true); // mulai loading true
  const [error, setError] = useState<string | null>(null);
  const { applyProgram, loading: applying } = useApplyProgram();
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ Ambil LPQ yang login
        const lpqs = await fetchInstitution();
        if (!lpqs || lpqs.length === 0) throw new Error("LPQ tidak ditemukan");

        const lpq = lpqs[0];
        setInstitution(lpq);

        // 2️⃣ Ambil assessments LPQ
        const assessmentsData = await fetchInstitutionAssessments(lpq.id);
        setAssessments(assessmentsData);

        // 3️⃣ Ambil semua program
        const programsData = await fetchPrograms();
        const mapped: Program[] = programsData.map((p) => ({
          ...p,
          status: p.status === "active" ? "active" : "inactive",
          applied: false,
          application_id: null,
        }));
        setPrograms(mapped);
        setFilteredPrograms(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal load data LPQ / assessment / program");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const assessmentsMap: Record<number, Record<string, boolean>> = {};
  assessments.forEach((a) => {
    const programId = a.required_check.program; // ini number
    if (!assessmentsMap[programId]) assessmentsMap[programId] = {};
    assessmentsMap[programId][a.required_check.code] = a.value;
  });

  // Apply program
  const handleApply = async (programId: number) => {
    if (applying) return;
    try {
      const res = await applyProgram(programId);

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, applied: true, application_id: res.id }
            : p
        )
      );
      setFilteredPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, applied: true, application_id: res.id }
            : p
        )
      );

      alert("Program berhasil diapply!");
    } catch (err) {
      alert(`Gagal apply program: ${(err as Error).message}`);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: {
    program_type?: string;
    status?: string;
  }) => {
    setFilters(newFilters);

    let filtered = [...programs];
    if (newFilters.program_type) {
      filtered = filtered.filter(
        (p) => p.program_type === newFilters.program_type
      );
    }
    if (newFilters.status) {
      filtered = filtered.filter((p) =>
        newFilters.status === "open"
          ? p.status === "active"
          : p.status === "inactive"
      );
    }

    setFilteredPrograms(filtered);
  };

  if (loading) return <p className="text-white">Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 pt-8 md:pt-16">
      <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wide">
        Programs
      </h2>

      {/* Filter */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="px-4 py-2 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 transition"
          value={filters.program_type || ""}
          onChange={(e) =>
            handleFilterChange({
              ...filters,
              program_type: e.target.value || undefined,
            })
          }
        >
          <option value="">All Types</option>
          <option value="education">Education</option>
          <option value="social">Social</option>
        </select>

        <select
          className="px-4 py-2 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 transition"
          value={filters.status || ""}
          onChange={(e) =>
            handleFilterChange({
              ...filters,
              status: e.target.value || undefined,
            })
          }
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((p) => (
          <ProgramCard
            key={p.id}
            program={p}
            onDetail={setSelectedProgram}
            onApply={handleApply}
            assessment={assessmentsMap[p.id] || {}} // Hanya map untuk program ini
          />
        ))}
      </div>

      {/* Modal Detail */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-3xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative shadow-2xl">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-3xl font-extrabold text-white mb-2">
              {selectedProgram.title}
            </h3>
            <p className="text-gray-400 mb-2">
              Vendor: {selectedProgram.vendor_name || "-"}
            </p>
            <p className="text-gray-300 mb-4">{selectedProgram.description}</p>

            <img
              src={selectedProgram.flyer}
              alt={selectedProgram.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            <p className="text-gray-400 mb-2">
              Valid: {selectedProgram.valid_from} - {selectedProgram.valid_to}
            </p>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-1">
                Required Checks:
              </h4>
              <ul className="list-disc list-inside text-gray-300">
                {selectedProgram.required_checks.map((c) => (
                  <li key={c.id}>{c.code}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-1">
                Required Reports:
              </h4>
              <ul className="list-disc list-inside text-gray-300">
                {selectedProgram.required_reports.map((r) => (
                  <li key={r.id}>
                    {r.label} ({r.report_type}, min {r.min_files} file)
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                handleApply(selectedProgram.id);
                setSelectedProgram(null);
              }}
              disabled={
                selectedProgram.applied || selectedProgram.status !== "active"
              }
              className={`w-full py-3 rounded-2xl font-bold transition ${
                selectedProgram.applied || selectedProgram.status !== "active"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {selectedProgram.applied ? "Applied" : "Apply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
