"use client";
import { useState, useEffect } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Ambil CSRF token saat komponen mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch(
        "https://reprints-serving-cage-meter.trycloudflare.com/api/csrf/",
        {
          credentials: "include",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "", // jika endpoint memerlukan CSRF
          }),
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
      "https://reprints-serving-cage-meter.trycloudflare.com/api/login/",
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm text-gray-300 mb-1">E-mail</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-gray-400 bg-white/5 text-indigo-400 focus:ring-indigo-500"
          />
          Remember Me
        </label>
        <a href="#" className="text-indigo-400 hover:underline">
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
