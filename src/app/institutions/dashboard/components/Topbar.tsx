"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  setSidebarOpen?: (open: boolean) => void;
  onLogoutClick?: () => void;
}

export default function Topbar({ setSidebarOpen, onLogoutClick }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Mapping judul berdasarkan path
  const getTitle = () => {
    if (pathname.startsWith("/institutions/dashboard")) return "Dashboard";
    if (pathname.startsWith("/institutions/programs")) return "Programs";
    if (pathname.startsWith("/institutions/profile")) return "Profile";
    return "Dashboard"; // fallback
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 
    w-full 
    md:ml-64 md:w-[calc(100%-16rem)] 
    h-16 px-4 sm:px-6 
    flex items-center justify-between 
    border-b border-indigo-500/30 
    bg-slate-950/40 backdrop-blur-lg 
    z-40"
    >
      {/* Hamburger mobile */}
      {setSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mr-2 p-2 rounded-md bg-slate-800/50 hover:bg-slate-800/70 text-gray-300"
        >
          ☰
        </button>
      )}

      <h1 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
        {getTitle()}
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
                onClick={onLogoutClick}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-2 py-2 text-gray-800 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <span className="sr-only">Toggle theme</span>
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </button>
      </div>
    </header>
  );
}
