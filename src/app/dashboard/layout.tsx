"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Topbar from "./components/Topbar";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Ambil data user & institution status
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/api/home/`, {
        credentials: "include",
      });
      if (res.status === 403) {
        window.location.href = "/";
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Close sidebar ketika klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading...
      </div>
    );

  // Tentukan menu berdasarkan role & status
  const menuItems: { title: string; href: string }[] = [];
  if (data.groups.includes("ADMIN")) {
    menuItems.push(
      { title: "Dashboard", href: "/dashboard" },
      { title: "Institutions", href: "/dashboard/institutions" },
      { title: "Programs", href: "/dashboard/programs" },
      { title: "Users", href: "/dashboard/users" }
    );
  } else if (data.groups.includes("LPQ")) {
    menuItems.push({ title: "Dashboard", href: "/dashboard" });
    if (data.institution_status === "AKTIF") {
      menuItems.push(
        { title: "Applications", href: "/dashboard/applications" },
        { title: "Reports", href: "/dashboard/reports" },
        { title: "Profile", href: "/dashboard/profile" }
      );
    }
  } else if (data.groups.includes("PARTNER")) {
    menuItems.push({ title: "Dashboard", href: "/dashboard" });
    if (data.institution_status === "AKTIF") {
      menuItems.push({ title: "My Programs", href: "/dashboard/my-programs" });
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/70 backdrop-blur-lg border-r border-indigo-500/30 p-6 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex flex-col`}
      >
        <h2 className="text-xl font-bold text-indigo-400 mb-8">⚡ Qonnect</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-400 transition"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Konten kanan */}
      <div className="flex-1 flex flex-col md:ml-0 min-h-screen">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-4 md:p-8 bg-transparent">
          {/* Banner draft LPQ */}
          {data.groups.includes("LPQ") &&
            data.institution_status === "DRAFT" && (
              <div className="mb-6 p-4 bg-yellow-500 text-black font-semibold rounded-lg text-center shadow-lg">
                Akun anda sedang menunggu persetujuan admin.
              </div>
            )}
          {children}
        </main>
      </div>
    </div>
  );
}
