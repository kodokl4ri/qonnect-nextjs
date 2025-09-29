import LegalLayout from "@/app/user-agreement/components/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Kebijakan Privasi ini menjelaskan bagaimana Duta Quran Indonesia
        (“Kami”) mengumpulkan, menggunakan, menyimpan, dan melindungi data
        pribadi Pengguna. Dengan menggunakan aplikasi ini, Pengguna dianggap
        telah membaca dan menyetujui kebijakan berikut.
      </p>

      <h2>1. Informasi yang Kami Kumpulkan</h2>
      <ul>
        <li>
          <strong>Data Identitas:</strong> Nama, email, nomor telepon, nama
          lembaga, alamat lembaga, dan dokumen legalitas.
        </li>
        <li>
          <strong>Data Teknis:</strong> Alamat IP, jenis perangkat, dan log
          aktivitas.
        </li>
        <li>
          <strong>Data Penggunaan:</strong> Aktivitas Anda dalam menggunakan
          aplikasi, termasuk interaksi dengan fitur.
        </li>
      </ul>

      <h2>2. Bagaimana Data Digunakan</h2>
      <ol>
        <li>Untuk verifikasi dan aktivasi akun.</li>
        <li>Untuk pembinaan dan peningkatan mutu LPQ.</li>
        <li>Untuk komunikasi resmi terkait program dan kegiatan.</li>
        <li>Untuk pemeliharaan keamanan sistem aplikasi.</li>
      </ol>

      <h2>3. Penyimpanan & Keamanan Data</h2>
      <p>
        Data Pengguna disimpan dengan standar keamanan tinggi dan hanya
        digunakan untuk kepentingan sebagaimana disebutkan di atas. Kami
        menggunakan enkripsi dan akses terbatas guna mencegah penyalahgunaan.
      </p>

      <h2>4. Hak Pengguna</h2>
      <ul>
        <li>Hak untuk mengakses data pribadi yang dimiliki.</li>
        <li>Hak untuk memperbaiki data yang tidak akurat.</li>
        <li>Hak untuk meminta penghapusan data sesuai hukum yang berlaku.</li>
        <li>Hak untuk mencabut persetujuan penggunaan data.</li>
      </ul>

      <h2>5. Berbagi Data dengan Pihak Ketiga</h2>
      <p>
        Kami tidak menjual atau menyewakan data pribadi kepada pihak ketiga.
        Namun, data dapat dibagikan kepada mitra resmi (misalnya lembaga
        pemerintah atau NGO mitra) hanya untuk tujuan peningkatan mutu LPQ dan
        sesuai ketentuan hukum.
      </p>

      <h2>6. Perubahan Kebijakan</h2>
      <p>
        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap
        perubahan akan diumumkan melalui aplikasi. Pengguna diharapkan meninjau
        secara berkala.
      </p>

      <p className="text-sm text-[var(--muted-foreground)] mt-6">
        Dokumen ini terakhir diperbarui pada 15 September 2025.
      </p>
    </LegalLayout>
  );
}
