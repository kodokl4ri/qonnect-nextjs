"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoginForm from "./loginform";
import { ModeToggle } from "../../components/mode-toggle";
import FuturisticLayout from "@/components/FuturisticLayout";

export default function LoginPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/auth_status/`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <FuturisticLayout centered>
      {/* Neon blur background (hanya dark mode agar keren) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] rounded-full bg-[var(--accent)] blur-3xl dark:opacity-40"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-xl p-6 mx-auto"
      >
        <div className="backdrop-blur-xl bg-[var(--card)] shadow-2xl rounded-2xl p-8 border border-[var(--border)] transition-colors">
          <h1 className="text-center mb-3">
            <span
              className="flex items-center justify-center gap-2
      text-4xl md:text-5xl font-extrabold 
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
                <path
                  d="M12 12c3 0 5 1 6 3l2 3"
                  className="stroke-indigo-500"
                />
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

            <span className="block text-sm md:text-base text-[var(--muted-foreground)] mt-1 font-medium">
              By Dutaqu
            </span>
          </h1>

          <p className="text-[var(--muted-foreground)] text-center mb-6">
            Login to access your dashboard
          </p>
          <LoginForm />
        </div>
      </motion.div>
    </FuturisticLayout>
  );
}
