"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Ambil pesan sukses register dari query param
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setMessage({
        text: "Register berhasil! Silakan login.",
        type: "success",
      });
    }
  }, [searchParams]);

  // Ambil CSRF token saat komponen mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch(
        "https://thus-favorites-virtually-inspired.trycloudflare.com/api/csrf/",
        {
          credentials: "include",
          headers: {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      "https://thus-favorites-virtually-inspired.trycloudflare.com/api/login/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email, password, rememberMe: remember }),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      window.location.href = "/dashboard";
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
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm text-gray-300 mb-1">E-mail</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="flex flex-col mt-2 text-sm text-gray-300">
        {/* Baris Remember Me + Register */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-1 w-full">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-gray-400 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            Remember Me
          </label>
          <a
            href="/register"
            className="text-purple-400 hover:underline font-medium"
          >
            Register
          </a>
        </div>

        {/* Baris Forgot Password */}
        <div className="w-full text-left sm:text-right">
          <a href="#" className="text-purple-400 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </motion.button>
    </motion.form>
  );
}
