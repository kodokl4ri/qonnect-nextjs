"use client";

import FuturisticLayout from "@/components/FuturisticLayout";
import RegisterForm from "./registerform";

export default function RegisterPage() {
  return (
    <FuturisticLayout>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <div
            className="backdrop-blur-xl bg-[var(--card)] shadow-2xl 
                       rounded-2xl p-6 sm:p-10 border border-[var(--border)] 
                       transition-colors"
          >
            {/* Judul */}
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

            {/* Deskripsi */}
            <p className="text-center text-[var(--muted-foreground)] mb-8">
              Fill the form below to create your account and institution
              profile.
            </p>

            {/* Form Registrasi */}
            <RegisterForm />
          </div>
        </div>
      </main>
    </FuturisticLayout>
  );
}
