"use client";

import { ReactNode, useState } from "react";
import Topbar from "./components/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/70 backdrop-blur-lg border-r border-indigo-500/30 p-6 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex flex-col`}
      >
        <h2 className="text-xl font-bold text-indigo-400 mb-8">⚡ Qonnect</h2>
        <nav className="space-y-4">
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-400 transition"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/programs"
            className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-400 transition"
          >
            Programs
          </a>
          <a
            href="/dashboard/reports"
            className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-400 transition"
          >
            Reports
          </a>
          <a
            href="/dashboard/settings"
            className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-indigo-600/30 hover:text-indigo-400 transition"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Konten kanan */}
      <div className="flex-1 flex flex-col md:ml-0 min-h-screen">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-4 md:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
