"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 relative overflow-hidden">
      {/* Neon blur background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-500 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-md p-6"
      >
        <div className="backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            🚀 Welcome Back
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Login to access your dashboard
          </p>
          <LoginForm />
        </div>
      </motion.div>
    </main>
  );
}
