"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Topbar from "./dashboard/components/Topbar";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pathname = usePathname();
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch user & institution data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/api/home/`, {
        credentials: "include",
      });
      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
      if (!json.groups.includes("LPQ")) {
        redirect("/unauthorized");
      }
      if (json.institution_status !== "AKTIF") {
        redirect("/institutions/dashboard");
      }
    };
    fetchData();
  }, []);

  // Ambil CSRF token saat komponen mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch(`${API_BASE_URL}/api/csrf/`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });
      const data = await res.json();
      setCsrfToken(data.csrftoken);
    };
    fetchCsrfToken();
  }, []);

  // Close sidebar when clicking outside
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

  // Menu based on role & institution status
  const menuItems: { title: string; href: string }[] = [];
  if (data.groups.includes("ADMIN")) {
    menuItems.push(
      { title: "Dashboard", href: "/dashboard" },
      { title: "Institutions", href: "/dashboard/institutions" },
      { title: "Programs", href: "/dashboard/programs" },
      { title: "Users", href: "/dashboard/users" }
    );
  } else if (data.groups.includes("LPQ")) {
    menuItems.push({ title: "Dashboard", href: "/institutions/dashboard" });
    if (data.institution_status === "AKTIF") {
      menuItems.push(
        { title: "Programs", href: "/institutions/programs" },
        { title: "Reports", href: "/institutions/reports" },
        { title: "Profile", href: "/institutions/profile" }
      );
    }
  } else if (data.groups.includes("PARTNER")) {
    menuItems.push({ title: "Dashboard", href: "/dashboard" });
    if (data.institution_status === "AKTIF") {
      menuItems.push({ title: "My Programs", href: "/dashboard/my-programs" });
    }
  }

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });
      if (res.ok) window.location.href = "/login";
      else alert("Logout gagal. Coba lagi.");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
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
        className={`fixed inset-y-0 left-0 z-50 w-64 p-6 transform transition-transform duration-300 ease-in-out
          bg-[var(--sidebar)] text-[var(--sidebar-foreground)]
          border-r border-[var(--sidebar-border)]
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex flex-col`}
      >
        {/* Logo container */}
        <div className="relative mb-8 flex flex-col gap-2">
          <span
            className="flex items-center justify-start gap-2 text-2xl font-extrabold
        bg-gradient-to-r from-indigo-400 via-indigo-500 to-slate-400
        bg-clip-text text-transparent tracking-tight"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-10 h-10 text-indigo-500"
            >
              {/* Gerbong kiri */}
              <rect
                x="2"
                y="6"
                width="10"
                height="12"
                rx="2"
                className="fill-slate-700 dark:fill-slate-300"
              />
              {/* Gerbong kanan */}
              <rect
                x="36"
                y="6"
                width="10"
                height="12"
                rx="2"
                className="fill-slate-700 dark:fill-slate-300"
              />
              {/* Coupler kiri */}
              <path d="M12 12c3 0 5 1 6 3l2 3" className="stroke-indigo-500" />
              {/* Coupler kanan */}
              <path
                d="M36 12c-3 0-5 1-6 3l-2 3"
                className="stroke-indigo-500"
              />
              {/* Titik penghubung */}
              <circle cx="24" cy="18" r="2" className="fill-cyan-400" />
            </svg>
            Qonnect
          </span>

          {/* by Dutaqu */}
          <span className="absolute right-0 bottom-0 text-xs text-[var(--muted-foreground)] font-medium">
            By Dutaqu
          </span>
        </div>

        <nav className="mt-4 flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg transition
          ${
            isActive
              ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
              : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] text-[var(--sidebar-foreground)]"
          }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col md:ml-0 min-h-screen">
        <Topbar setSidebarOpen={setSidebarOpen} onLogoutClick={handleLogout} />

        <main className="relative flex-1 p-4 pt-16 sm:p-6 md:p-8 bg-transparent">
          {/* Banner draft LPQ */}
          {data.groups.includes("LPQ") &&
            data.institution_status === "DRAFT" && (
              <div className="mb-0 p-4 sm:mt-4 md:mt-10 bg-yellow-500 text-black font-semibold rounded-lg text-center shadow-lg">
                Akun anda sedang ditinjau, anda akan diberikan akses program
                setelah admin menyetujui.
              </div>
            )}
          {children}
        </main>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-[var(--card)] rounded-xl p-6 shadow-2xl w-80 text-center">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">
              Logout
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                onClick={confirmLogout}
              >
                Logout
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
