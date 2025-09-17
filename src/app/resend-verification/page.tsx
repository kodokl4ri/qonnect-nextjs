"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FuturisticLayout from "@/components/FuturisticLayout";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage({
        text: data.detail || "Link verifikasi terkirim.",
        type: "success",
      });
    } else {
      setMessage({
        text: data.error || "Gagal mengirim link verifikasi.",
        type: "error",
      });
    }
  };

  return (
    <FuturisticLayout centered>
      {/* Neon blur background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] rounded-full bg-[var(--primary)] blur-3xl dark:opacity-40"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-xl p-6 mx-auto"
      >
        <div className="backdrop-blur-xl bg-[var(--card)] shadow-2xl rounded-2xl p-8 border border-[var(--border)] transition-colors">
          <h1 className="text-center mb-3 text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
            Resend Verification
          </h1>

          <p className="text-[var(--muted-foreground)] text-center mb-6">
            Masukkan email kamu untuk mendapatkan link verifikasi ulang.
          </p>

          {/* Alert */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                E-mail
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Ulang Link"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </FuturisticLayout>
  );
}
