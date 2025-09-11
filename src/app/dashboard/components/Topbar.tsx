"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  setSidebarOpen?: (open: boolean) => void;
}

export default function Topbar({ setSidebarOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ambil CSRF token saat komponen mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch(
        "https://thus-favorites-virtually-inspired.trycloudflare.com/api/csrf/",
        {
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
        }
      );
      const data = await res.json();
      setCsrfToken(data.csrftoken);
    };
    fetchCsrfToken();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "https://thus-favorites-virtually-inspired.trycloudflare.com/api/logout/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
        }
      );
      if (res.ok) window.location.href = "/";
      else alert("Logout gagal. Coba lagi.");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-indigo-500/30 bg-slate-950/40 backdrop-blur-lg relative">
      {/* Hamburger mobile */}
      {setSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mr-2 p-2 rounded-md bg-slate-800/50 hover:bg-slate-800/70 text-gray-300"
        >
          ☰
        </button>
      )}

      <h1 className="text-base sm:text-lg font-semibold text-indigo-300">
        Dashboard
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer select-none"
          >
            U
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-slate-900/95 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-xl overflow-hidden animate-fade-in z-50">
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600/30 hover:text-indigo-300"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/20"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
