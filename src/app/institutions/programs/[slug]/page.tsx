"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Program, InstitutionAssessment } from "@/types";
import {
  fetchPrograms,
  fetchInstitutionAssessments,
  useApplyProgram,
  fetchInstitution,
} from "@/lib/api";

export default function ProgramDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [program, setProgram] = useState<Program | null>(null);
  const [assessments, setAssessments] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const { applyProgram, loading: applying } = useApplyProgram();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!slug) throw new Error("Program tidak ditemukan");

        // Ambil LPQ
        const lpqs = await fetchInstitution();
        if (!lpqs || lpqs.length === 0) throw new Error("LPQ tidak ditemukan");
        const lpq = lpqs[0];
        setInstitutionId(lpq.id);

        // Ambil program by slug
        const programs = await fetchPrograms();
        const prog = programs.find((p) => p.slug === slug);
        if (!prog) throw new Error("Program tidak ditemukan");
        setProgram({
          ...prog,
          status: prog.status === "active" ? "active" : "inactive",
        });

        // Ambil assessments LPQ untuk program ini
        const assessmentsData = await fetchInstitutionAssessments(lpq.id);
        const filtered = assessmentsData.filter(
          (a) => a.required_check.program === prog.id
        );

        const map: Record<number, boolean> = {};
        filtered.forEach((a) => {
          map[a.required_check.id] = a.value;
        });
        setAssessments(map);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleToggleAssessment = (checkId: number) => {
    setAssessments((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!institutionId || !program) return;
    try {
      const body = Object.entries(assessments).map(([checkId, value]) => ({
        institution: institutionId,
        required_check: Number(checkId),
        value,
      }));

      await Promise.all(
        body.map((b) =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(b),
          })
        )
      );

      alert("Assessment berhasil disubmit!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal submit assessment: " + err.message);
    }
  };

  const handleApply = async () => {
    if (!program) return;
    try {
      await applyProgram(program.id);
      alert("Program berhasil diapply!");
      router.refresh();
    } catch (err: any) {
      alert("Gagal apply program: " + err.message);
    }
  };

  if (loading)
    return <p className="text-white text-center mt-12">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-12">{error}</p>;
  if (!program) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-10">
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl border border-gray-700">
          <img
            src={program.flyer}
            alt={program.title}
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-black/60 to-transparent p-4 rounded-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {program.title}
            </h1>
            <p className="text-gray-300 mt-1">{program.vendor_name}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="text-gray-400 text-lg">
              Valid: {program.valid_from} - {program.valid_to}
            </p>
            <p className="text-gray-400 text-lg">
              Status:
              <span
                className={`ml-2 font-bold ${
                  program.status === "active"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {program.status === "active" ? "Open" : "Closed"}
              </span>
            </p>
          </div>
          <button
            onClick={handleApply}
            disabled={program.status !== "active" || applying}
            className={`mt-6 py-3 px-8 rounded-3xl font-bold text-white shadow-lg transition-all duration-300 ${
              program.status !== "active" || applying
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-teal-400 hover:from-teal-400 hover:to-green-500"
            }`}
          >
            {program.status === "active" ? "Apply Program" : "Closed"}
          </button>
        </div>
      </div>

      {/* Description */}
      <section className="bg-[var(--card)] backdrop-blur-md p-6 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4">Description</h2>
        <p className="text-gray-300 leading-relaxed">{program.description}</p>
      </section>

      {/* Required Checks */}
      <section className="bg-[var(--card)] backdrop-blur-md p-6 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4">
          Required Assessments
        </h2>
        <ul className="space-y-3">
          {program.required_checks.map((check) => (
            <li
              key={check.id}
              className="flex items-center justify-between gap-4 p-4 bg-gray-800 bg-opacity-30 rounded-2xl hover:bg-gray-700 transition duration-300"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!assessments[check.id]}
                  onChange={() => handleToggleAssessment(check.id)}
                  className="w-6 h-6 accent-green-400"
                />
                <span className="text-gray-200 font-medium">
                  {check.label || check.code}
                </span>
              </div>
              {assessments[check.id] && (
                <span className="text-green-400 font-bold text-lg">(✔)</span>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSubmitAssessment}
          className="mt-6 py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-3xl shadow-lg transition-all duration-300"
        >
          Submit Assessment
        </button>
      </section>

      {/* Required Reports */}
      <section className="bg-[var(--card)] backdrop-blur-md p-6 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4">Required Reports</h2>
        <ul className="grid md:grid-cols-2 gap-4">
          {program.required_reports.map((r) => (
            <li
              key={r.id}
              className="flex justify-between items-center p-4 bg-gray-800 bg-opacity-30 rounded-2xl hover:bg-gray-700 transition duration-300"
            >
              <div className="text-gray-200">
                {r.label} ({r.report_type}, min {r.min_files} file)
              </div>
              <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-lg">
                Upload
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
