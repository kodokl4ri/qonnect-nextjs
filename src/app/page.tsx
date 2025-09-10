"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./loginform";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(
        "https://reprints-serving-cage-meter.trycloudflare.com/api/auth/auth_status/",
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.authenticated) {
        router.replace("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      <div className="relative w-full max-w-md p-6">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
        <div className="backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Login to access your dashboard
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
