"use client";

import RegisterForm from "./registerform";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/auth_status/`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.authenticated) {
        // Jika sudah login, redirect ke dashboard
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [router]);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-4">
      <div className="relative w-full max-w-3xl p-4 sm:p-6">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
        <div className="backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 border border-white/20">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Register Your Institution
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Fill all sections to proceed to next step
          </p>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
