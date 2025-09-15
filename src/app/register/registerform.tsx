"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type UserData = {
  username: string;
  email: string;
  password: string;
  nama_lembaga: string;
  alamat_lembaga: string;
  provinsi: string;
  kabkota: string;
  kecamatan: string;
  tipe_lembaga: string;
  jenjang_pendidikan: string;
  tanggal_berdiri: string;
  nama_pimpinan: string;
  nomor_HP_pimpinan: string;
  legalitas_lembaga: File | null;
  agreed: boolean;
};

export default function RegisterForm() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    nama_lembaga: "",
    alamat_lembaga: "",
    provinsi: "",
    kabkota: "",
    kecamatan: "",
    tipe_lembaga: "",
    jenjang_pendidikan: "",
    tanggal_berdiri: "",
    nama_pimpinan: "",
    nomor_HP_pimpinan: "",
    legalitas_lembaga: null,
    agreed: false,
  });

  const [provinsiList, setProvinsiList] = useState<any[]>([]);
  const [kabkotaList, setKabkotaList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Fetch CSRF token
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrftoken))
      .catch(console.error);
  }, []);

  // Fetch Provinsi
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lembaga/provinsi/`)
      .then((res) => res.json())
      .then((data) => setProvinsiList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Fetch Kabkota & Kecamatan
  useEffect(() => {
    if (userData.provinsi) {
      fetch(
        `${API_BASE_URL}/api/lembaga/kabkota/?provinsi=${userData.provinsi}`
      )
        .then((res) => res.json())
        .then((data) => setKabkotaList(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [userData.provinsi]);

  useEffect(() => {
    if (userData.kabkota) {
      fetch(
        `${API_BASE_URL}/api/lembaga/kecamatan/?kabkota=${userData.kabkota}`
      )
        .then((res) => res.json())
        .then((data) => setKecamatanList(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [userData.kabkota]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("File harus berformat PDF");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("Ukuran file maksimal 20MB");
        return;
      }
      setUserData({ ...userData, legalitas_lembaga: file });
    }
  };

  const handleNext = () => {
    setErrorMessage("");
    if (
      (step === 1 &&
        (!userData.username || !userData.email || !userData.password)) ||
      (step === 2 &&
        (!userData.nama_lembaga ||
          !userData.alamat_lembaga ||
          !userData.provinsi ||
          !userData.kabkota ||
          !userData.kecamatan))
    ) {
      setErrorMessage("Please fill all fields before proceeding");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    // 🔒 Validasi Agreement sebelum submit
    if (!userData.agreed) {
      setErrorMessage(
        "You must agree to the User Agreement and Privacy Policy"
      );
      setLoading(false);
      return;
    }

    if (
      !userData.tipe_lembaga ||
      !userData.jenjang_pendidikan ||
      !userData.tanggal_berdiri ||
      !userData.nama_pimpinan ||
      !userData.nomor_HP_pimpinan ||
      !userData.agreed
    ) {
      setErrorMessage(
        "Please fill all required fields and agree to the policies"
      );
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== null) {
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, value as any);
          }
        }
      });

      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrfToken },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.replace("/?registered=true");
      } else {
        setErrorMessage(data.detail || "Register failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong");
    }
    setLoading(false);
  };

  // Reusable input class
  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition";

  const selectClass =
    "w-full px-4 py-3 rounded-xl bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-[var(--card-foreground)] font-semibold text-lg">
              Account Info
            </h2>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Username
              </label>
              <input
                type="text"
                name="username"
                autoFocus
                value={userData.username}
                onChange={handleChange}
                placeholder="Username"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Password"
                className={inputClass}
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-[var(--card-foreground)] font-semibold text-lg">
              Institution Info
            </h2>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Nama Lembaga
              </label>
              <input
                type="text"
                name="nama_lembaga"
                autoFocus
                value={userData.nama_lembaga}
                onChange={handleChange}
                placeholder="Institution Name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Alamat Lembaga
              </label>
              <input
                type="text"
                name="alamat_lembaga"
                value={userData.alamat_lembaga}
                onChange={handleChange}
                placeholder="Address"
                className={inputClass}
              />
            </div>

            {/* Dropdown Provinsi */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Provinsi
              </label>
              <select
                name="provinsi"
                value={userData.provinsi}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select Province</option>
                {provinsiList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_provinsi}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kabkota */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Kabupaten/Kota
              </label>
              <select
                name="kabkota"
                value={userData.kabkota}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select City</option>
                {kabkotaList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kabkota}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kecamatan */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Kecamatan
              </label>
              <select
                name="kecamatan"
                value={userData.kecamatan}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select Subdistrict</option>
                {kecamatanList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama_kecamatan}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-[var(--card-foreground)] font-semibold text-lg">
              Leader Info
            </h2>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Tipe Lembaga
              </label>
              <input
                type="text"
                name="tipe_lembaga"
                autoFocus
                value={userData.tipe_lembaga}
                onChange={handleChange}
                placeholder="Institution Type"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Jenjang Pendidikan
              </label>
              <input
                type="text"
                name="jenjang_pendidikan"
                value={userData.jenjang_pendidikan}
                onChange={handleChange}
                placeholder="Education Level"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Tanggal Berdiri
              </label>
              <input
                type="date"
                name="tanggal_berdiri"
                value={userData.tanggal_berdiri}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Upload Legalitas Lembaga (PDF, max 20MB)
              </label>
              <input
                type="file"
                name="legalitas_lembaga"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-[var(--foreground)] file:bg-[var(--primary)] file:hover:bg-[var(--primary-foreground)] file:text-white file:px-3 file:py-2 file:rounded-xl file:cursor-pointer transition"
              />
              {userData.legalitas_lembaga && (
                <p className="text-green-400 mt-1 text-sm">
                  Selected: {userData.legalitas_lembaga.name}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Nama Pimpinan
              </label>
              <input
                type="text"
                name="nama_pimpinan"
                value={userData.nama_pimpinan}
                onChange={handleChange}
                placeholder="Leader Name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-[var(--card-foreground)]">
                Nomor HP Pimpinan
              </label>
              <input
                type="text"
                name="nomor_HP_pimpinan"
                value={userData.nomor_HP_pimpinan}
                onChange={handleChange}
                placeholder="Leader Phone"
                className={inputClass}
              />
            </div>
            {/* User Agreement Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                id="agreement"
                name="agreed"
                type="checkbox"
                checked={userData.agreed}
                onChange={(e) =>
                  setUserData({ ...userData, agreed: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required
              />
              <label
                htmlFor="agreement"
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                I agree to the{" "}
                <a
                  href="/user-agreement"
                  className="text-indigo-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  User Agreement
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-indigo-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage && (
        <p className="text-red-400 mt-2 text-sm font-medium">{errorMessage}</p>
      )}

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="px-6 py-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition"
          >
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--ring)] transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--primary)] transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
