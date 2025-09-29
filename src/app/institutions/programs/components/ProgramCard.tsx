"use client";
import { Program, InstitutionAssessment } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  program: Program;
  assessment?: Record<string, boolean>; // map check_code -> value
  onDetail: (program: Program) => void;
  onApply: (id: number) => void;
}

export default function ProgramCard({
  program,
  onDetail,
  onApply,
  assessment = {}, // default ke object kosong
}: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row bg-[var(--card)] bg-opacity-40 backdrop-blur-md rounded-[var(--radius-xl)] shadow-lg hover:shadow-[0_0_20px_var(--accent)] transition-transform transform hover:-translate-y-1">
      <div className="md:w-1/2 w-full relative">
        <img
          src={program.flyer}
          alt={program.title}
          className="w-full h-48 md:h-full object-cover rounded-t-[var(--radius-xl)] md:rounded-l-[var(--radius-xl)] md:rounded-tr-none border-[var(--border)]"
        />
      </div>

      <div className="md:w-1/2 w-full p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-[var(--foreground)]">
            {program.title}
          </h3>
          <p className="text-[var(--muted-foreground)] text-sm my-2 line-clamp-3">
            {program.description}
          </p>
          <p className="text-[var(--secondary-foreground)] text-sm">
            Vendor: {program.vendor_name || "-"}
          </p>
          <p className="text-[var(--secondary-foreground)] text-sm">
            Status: {program.status === "active" ? "Open" : "Closed"}
          </p>

          <div className="mt-2">
            <strong className="text-[var(--foreground)]">Syarat:</strong>
            <ul className="list-disc ml-5 space-y-1">
              {program.required_checks.map((check) => (
                <li
                  key={check.id}
                  className="flex items-center gap-2 text-[var(--foreground)]"
                >
                  <span>{check.label || check.code}</span>
                  {assessment?.[check.code] ? (
                    <span className="text-[var(--primary)] font-bold">(✔)</span>
                  ) : (
                    <span className="text-[var(--danger)] font-bold">(✘)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => router.push(`programs/${program.slug}`)}
            className="flex-1 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--accent)] text-[var(--primary-foreground)] rounded-[var(--radius-md)] font-semibold transition"
          >
            Detail
          </button>

          <button
            onClick={() => onApply(program.id)}
            disabled={program.applied || program.status !== "active"}
            className={`flex-1 px-4 py-2 rounded-[var(--radius-md)] font-semibold transition ${
              program.applied || program.status !== "active"
                ? "bg-[var(--muted)] cursor-not-allowed text-[var(--muted-foreground)]"
                : "bg-[var(--accent)] hover:bg-[var(--primary)] text-[var(--accent-foreground)]"
            }`}
          >
            {program.applied ? "Applied" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
