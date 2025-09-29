"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const searchParams = useSearchParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    const flash = Cookies.get("flash_message");
    if (flash) {
      setMessage(JSON.parse(flash));
      Cookies.remove("flash_message"); // hapus setelah dibaca
    }
  }, []);
  // Ambil pesan sukses register dari query param
  useEffect(() => {
    // Pesan sukses verifikasi email
    if (searchParams.get("verified") === "1") {
      setMessage({
        text: "Email berhasil diverifikasi! Silakan login.",
        type: "success",
      });
    }
  }, [searchParams]);

  // Ambil CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch(`${API_BASE_URL}/api/csrf/`, {
        credentials: "include",
      });
      const data = await res.json();
      setCsrfToken(data.csrftoken);
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/api/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ email, password, rememberMe: remember }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      window.location.href = "/institutions/dashboard";
    } else {
      alert(data.error || "Login gagal");
    }
  };

  return (
    <motion.form
      className="space-y-6"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Notifikasi sukses / error */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : message.type === "error"
              ? "bg-red-500 text-white"
              : message.type === "warning"
              ? "bg-yellow-400 text-black"
              : ""
          }`}
        >
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm text-[var(--muted-foreground)] mb-1">
          E-mail
        </label>
        <input
          type="text"
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--muted-foreground)] mb-1">
          Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="flex flex-col mt-2 text-sm text-[var(--muted-foreground)]">
        {/* Remember Me + Register */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-1 w-full">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            Remember Me
          </label>
          <a
            href="/register"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Register
          </a>
        </div>

        {/* Forgot Password */}
        <div className="w-full text-left sm:text-right">
          <a
            href="#"
            className="text-[var(--accent)] hover:underline transition-colors"
          >
            Forgot Password?
          </a>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </motion.button>
    </motion.form>
  );
}
