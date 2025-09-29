import { Program, Institution, InstitutionAssessment } from "@/types";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

// ----------------------- Programs -----------------------
export const fetchPrograms = async (): Promise<Program[]> => {
  const csrfToken = Cookies.get("csrftoken") || "";

  const res = await fetch(`${API_BASE_URL}/api/programs/`, {
    credentials: "include",
    headers: { "X-CSRFToken": csrfToken },
  });

  if (!res.ok)
    throw new Error(`Failed to fetch programs, status: ${res.status}`);

  return res.json() as Promise<Program[]>;
};

// ----------------------- Institutions (LPQ) -----------------------
export interface PaginatedLPQ {
  count: number;
  next: string | null;
  previous: string | null;
  results: Institution[];
}

// Ambil LPQ yang login
export const fetchInstitution = async (): Promise<Institution[]> => {
  const csrfToken = Cookies.get("csrftoken") || "";

  const res = await fetch(`${API_BASE_URL}/api/lpq/`, {
    credentials: "include",
    headers: { "X-CSRFToken": csrfToken },
  });

  if (!res.ok) throw new Error(`Failed to fetch LPQ, status: ${res.status}`);

  const data: PaginatedLPQ = await res.json();
  return data.results; // <- ambil array dari paginated results
};

// ----------------------- Institution Assessments -----------------------
export const fetchInstitutionAssessments = async (
  lpqid: number
): Promise<InstitutionAssessment[]> => {
  const csrfToken = Cookies.get("csrftoken") || "";

  const res = await fetch(
    `${API_BASE_URL}/api/assessments/?institution=${lpqid}`,
    {
      credentials: "include",
      headers: { "X-CSRFToken": csrfToken },
    }
  );

  if (!res.ok)
    throw new Error(`Failed to fetch assessments, status: ${res.status}`);

  return res.json() as Promise<InstitutionAssessment[]>;
};

// ----------------------- Apply Program -----------------------
export const useApplyProgram = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        const token = Cookies.get("csrftoken") || null;
        setCsrfToken(token);
      } catch (err) {
        console.error("Gagal fetch CSRF token:", err);
        setError("Gagal ambil CSRF token");
      }
    };
    fetchCsrfToken();
  }, []);

  const applyProgram = async (programId: number) => {
    if (!csrfToken) {
      setError("CSRF token belum tersedia");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/programs/${programId}/apply/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({}),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.detail || `Failed to apply, status: ${res.status}`
        );
      }

      const data = await res.json();
      setLoading(false);
      return data; // return ProgramApplication
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      setLoading(false);
      throw err;
    }
  };

  return { applyProgram, loading, error };
};
