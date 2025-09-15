"use client";

import { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";
import { useRouter } from "next/navigation";

interface DashboardData {
  [key: string]: any;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/`, {
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-[var(--muted-foreground)]">
        Loading...
      </div>
    );
  if (error || !data)
    return (
      <div className="flex justify-center items-center h-full text-red-400">
        {error}
      </div>
    );

  const stats: { title: string; value: any }[] = [];

  if (data.groups?.includes("ADMIN")) {
    stats.push(
      { title: "Total Institutions", value: data.total_institutions },
      { title: "Total Programs", value: data.total_programs },
      { title: "Active Programs", value: data.active_programs },
      { title: "Total Applications", value: data.total_applications },
      { title: "Pending Applications", value: data.applications_pending },
      { title: "Approved Applications", value: data.applications_approved }
    );
  } else if (data.groups?.includes("LPQ")) {
    stats.push(
      { title: "Institution", value: data.institution_name },
      { title: "Completeness Score", value: data.completeness_score },
      { title: "My Applications", value: data.my_applications },
      { title: "Pending Applications", value: data.applications_pending },
      { title: "Approved Applications", value: data.applications_approved },
      { title: "Pending Reports", value: data.reports_pending }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[var(--primary)]">
        Welcome back!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatsCard key={i} title={s.title} value={s.value} index={i} />
        ))}
      </div>
    </div>
  );
}
