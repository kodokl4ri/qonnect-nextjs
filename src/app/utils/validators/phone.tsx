export const validatePhone = (phone: string): string | null => {
  // Hapus spasi & strip biar lebih aman
  const normalized = phone.replace(/[\s-]/g, "");

  // Minimal panjang 10 digit (umumnya nomor HP Indo 10–13 digit)
  if (normalized.length < 8) return "Phone number must be at least 8 digits";

  // Harus hanya angka (boleh + di depan untuk kode internasional)
  if (!/^\+?\d+$/.test(normalized)) {
    return "Phone number must contain only numbers";
  }

  // Kalau Indonesia, biasanya diawali dengan 08 atau +62
  if (!normalized.startsWith("08") && !normalized.startsWith("+62")) {
    return "Phone number must start with 08 or +62";
  }

  return null; // ✅ valid
};
