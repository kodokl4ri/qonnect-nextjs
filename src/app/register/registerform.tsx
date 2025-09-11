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
};

export default function RegisterForm() {
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
  });

  const [provinsiList, setProvinsiList] = useState<any[]>([]);
  const [kabkotaList, setKabkotaList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  // Fetch CSRF
  useEffect(() => {
    fetch(
      "https://thus-favorites-virtually-inspired.trycloudflare.com/api/csrf/",
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrftoken))
      .catch(console.error);
  }, []);

  // Fetch Provinsi
  useEffect(() => {
    fetch(
      "https://thus-favorites-virtually-inspired.trycloudflare.com/api/lembaga/provinsi/"
    )
      .then((res) => res.json())
      .then((data) => setProvinsiList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Fetch Kabkota ketika provinsi dipilih
  useEffect(() => {
    if (userData.provinsi) {
      fetch(
        `https://thus-favorites-virtually-inspired.trycloudflare.com/api/lembaga/kabkota/?provinsi=${userData.provinsi}`
      )
        .then((res) => res.json())
        .then((data) => setKabkotaList(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [userData.provinsi]);

  // Fetch Kecamatan ketika kabkota dipilih
  useEffect(() => {
    if (userData.kabkota) {
      fetch(
        `https://thus-favorites-virtually-inspired.trycloudflare.com/api/lembaga/kecamatan/?kabkota=${userData.kabkota}`
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

  const handleNext = () => {
    // Validasi sederhana: pastikan semua field step terisi
    if (
      (step === 1 &&
        (!userData.username || !userData.email || !userData.password)) ||
      (step === 2 &&
        (!userData.nama_lembaga ||
          !userData.alamat_lembaga ||
          !userData.provinsi ||
          !userData.kabkota ||
          !userData.kecamatan)) ||
      (step === 3 &&
        (!userData.tipe_lembaga ||
          !userData.jenjang_pendidikan ||
          !userData.tanggal_berdiri ||
          !userData.nama_pimpinan ||
          !userData.nomor_HP_pimpinan))
    ) {
      alert("Please fill all fields before proceeding");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://thus-favorites-virtually-inspired.trycloudflare.com/api/auth/register/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Register berhasil, redirect ke login
        router.replace("/?registered=true");
      } else {
        alert(data.detail || "Register failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

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
            <h2 className="text-white font-semibold text-lg">Account Info</h2>
            <div className="flex flex-col">
              <label htmlFor="username" className="text-white mb-1 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-white mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-white mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <h2 className="text-white font-semibold text-lg">
              Institution Info
            </h2>
            <div className="flex flex-col">
              <label
                htmlFor="nama_lembaga"
                className="text-white mb-1 font-medium"
              >
                Nama Lembaga
              </label>
              <input
                type="text"
                name="nama_lembaga"
                value={userData.nama_lembaga}
                onChange={handleChange}
                placeholder="Institution Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="alamat_lembaga"
                className="text-white mb-1 font-medium"
              >
                Alamat Lembaga
              </label>
              <input
                type="text"
                name="alamat_lembaga"
                value={userData.alamat_lembaga}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {/* Dropdown Provinsi */}
            <div className="flex flex-col">
              <label htmlFor="provinsi" className="text-white mb-1 font-medium">
                Provinsi
              </label>
              <select
                name="provinsi"
                value={userData.provinsi}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Province</option>
                {provinsiList.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    style={{ color: "black", backgroundColor: "white" }}
                  >
                    {p.nama_provinsi}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kabkota */}
            <div className="flex flex-col">
              <label htmlFor="kabkota" className="text-white mb-1 font-medium">
                Kabupaten/kota
              </label>
              <select
                name="kabkota"
                value={userData.kabkota}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select City</option>
                {kabkotaList.map((k) => (
                  <option
                    key={k.id}
                    value={k.id}
                    style={{ color: "black", backgroundColor: "white" }}
                  >
                    {k.nama_kabkota}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kecamatan */}
            <div className="flex flex-col">
              <label
                htmlFor="kecamatan"
                className="text-white mb-1 font-medium"
              >
                Kecamatan
              </label>
              <select
                name="kecamatan"
                value={userData.kecamatan}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Subdistrict</option>
                {kecamatanList.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    style={{ color: "black", backgroundColor: "white" }}
                  >
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
            <h2 className="text-white font-semibold text-lg">Leader Info</h2>
            <div className="flex flex-col">
              <label
                htmlFor="tipe_lembaga"
                className="text-white mb-1 font-medium"
              >
                Tipe Lembaga
              </label>
              <input
                type="text"
                name="tipe_lembaga"
                value={userData.tipe_lembaga}
                onChange={handleChange}
                placeholder="Institution Type"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="jenjang_pendidikan"
                className="text-white mb-1 font-medium"
              >
                Jenjang Pendidikan
              </label>
              <input
                type="text"
                name="jenjang_pendidikan"
                value={userData.jenjang_pendidikan}
                onChange={handleChange}
                placeholder="Education Level"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tanggal_berdiri"
                className="text-white mb-1 font-medium"
              >
                Tanggal Berdiri
              </label>
              <input
                type="date"
                name="tanggal_berdiri"
                value={userData.tanggal_berdiri}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="nama_pimpinan"
                className="text-white mb-1 font-medium"
              >
                Nama Pimpinan
              </label>
              <input
                type="text"
                name="nama_pimpinan"
                value={userData.nama_pimpinan}
                onChange={handleChange}
                placeholder="Leader Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="nomor_HP_pimpinan"
                className="text-white mb-1 font-medium"
              >
                Nomor HP Pimpinan
              </label>
              <input
                type="text"
                name="nomor_HP_pimpinan"
                value={userData.nomor_HP_pimpinan}
                onChange={handleChange}
                placeholder="Leader Phone"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="px-6 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
