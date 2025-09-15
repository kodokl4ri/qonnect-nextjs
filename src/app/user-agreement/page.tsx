import LegalLayout from "@/app/user-agreement/components/layout";

export default function UserAgreementPage() {
  return (
    <LegalLayout title="User Agreement">
      <p>
        Dengan menggunakan aplikasi Duta Quran Indonesia, Anda (“Pengguna”)
        menyatakan telah membaca, memahami, dan menyetujui untuk terikat dengan
        syarat dan ketentuan berikut. Apabila Anda tidak setuju, mohon untuk
        tidak menggunakan layanan ini.
      </p>

      <h2>Pasal 1 – Definisi</h2>
      <p>Dalam Perjanjian ini, yang dimaksud dengan:</p>
      <ul>
        <li>
          <strong>Aplikasi</strong> adalah sistem daring milik Duta Quran
          Indonesia yang digunakan untuk manajemen, pembinaan, dan peningkatan
          mutu Lembaga Pendidikan Quran (LPQ).
        </li>
        <li>
          <strong>Pengguna</strong> adalah individu atau lembaga yang melakukan
          registrasi dan/atau menggunakan aplikasi.
        </li>
        <li>
          <strong>Data</strong> adalah informasi yang diberikan Pengguna saat
          registrasi maupun saat menggunakan layanan.
        </li>
      </ul>

      <h2>Pasal 2 – Hak & Kewajiban Pengguna</h2>
      <ol>
        <li>
          Pengguna wajib memberikan data yang akurat, lengkap, dan terkini.
        </li>
        <li>
          Pengguna bertanggung jawab penuh atas kerahasiaan akun, termasuk nama
          pengguna dan kata sandi.
        </li>
        <li>
          Pengguna dilarang menggunakan aplikasi untuk tujuan melanggar hukum,
          menyesatkan, atau merugikan pihak lain.
        </li>
        <li>
          Pengguna berhak mengakses, memperbarui, dan meminta penghapusan data
          sesuai kebijakan privasi yang berlaku.
        </li>
      </ol>

      <h2>Pasal 3 – Hak & Kewajiban Duta Quran</h2>
      <ol>
        <li>
          Duta Quran berhak menolak registrasi atau menangguhkan akun Pengguna
          yang terbukti melanggar ketentuan.
        </li>
        <li>
          Duta Quran berkewajiban menjaga keamanan data Pengguna sesuai
          ketentuan peraturan perundang-undangan yang berlaku.
        </li>
        <li>
          Duta Quran berhak melakukan pembaruan aplikasi sewaktu-waktu untuk
          peningkatan layanan.
        </li>
      </ol>

      <h2>Pasal 4 – Pembatasan Tanggung Jawab</h2>
      <p>
        Duta Quran tidak bertanggung jawab atas kerugian langsung maupun tidak
        langsung yang timbul akibat:
      </p>
      <ul>
        <li>Kesalahan penggunaan aplikasi oleh Pengguna;</li>
        <li>Akses ilegal pihak ketiga ke akun Pengguna;</li>
        <li>Gangguan teknis di luar kendali Duta Quran.</li>
      </ul>

      <h2>Pasal 5 – Ketentuan Lain</h2>
      <p>
        Perjanjian ini diatur dan ditafsirkan berdasarkan hukum Republik
        Indonesia. Segala perselisihan akan diselesaikan secara musyawarah atau
        melalui mekanisme hukum yang berlaku.
      </p>

      <p className="text-sm text-[var(--muted-foreground)] mt-6">
        Dokumen ini terakhir diperbarui pada 15 September 2025.
      </p>
    </LegalLayout>
  );
}
