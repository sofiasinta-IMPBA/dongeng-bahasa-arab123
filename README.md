# Dongeng Ceria

Website pembelajaran interaktif untuk siswa kelas 2 SD. Materi awal: dongeng **Kelinci dan Kura-kura**, mufradat Bahasa Arab sederhana, dan kuis pilihan ganda.

## Teknologi

- HTML5, CSS3, JavaScript
- Vite sebagai development server dan build tool
- JSON untuk data cerita, mufradat, dan soal
- Local Storage untuk menyimpan progres belajar di browser
- GitHub untuk repository
- Vercel untuk deployment

## Menjalankan di komputer

1. Install Node.js versi LTS dari https://nodejs.org/
2. Ekstrak folder proyek.
3. Buka folder `dongeng-ceria` di VS Code.
4. Buka terminal VS Code, lalu jalankan:

```bash
npm install
npm run dev
```

5. Buka alamat lokal yang muncul di terminal, biasanya `http://localhost:5173`.

## Build untuk production

```bash
npm run build
```

Hasil build akan berada di folder `dist`.

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

## Deploy ke Vercel

1. Buat repository baru di GitHub.
2. Upload seluruh isi folder proyek ke repository tersebut.
3. Login ke https://vercel.com/ dan pilih **Add New → Project**.
4. Import repository GitHub `dongeng-ceria`.
5. Pastikan pengaturan berikut:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Klik **Deploy**.

Setiap kali kamu melakukan `git push` ke branch utama, Vercel akan menjalankan deployment ulang secara otomatis jika integrasi GitHub sudah aktif.

## Penyimpanan data

Website ini **tidak menggunakan database dan tidak memiliki backend**. Progres belajar disimpan menggunakan `localStorage` pada browser yang sedang digunakan.

Konsekuensinya:
- Progres hanya tersedia di browser dan perangkat yang sama.
- Progres tidak otomatis tersinkron ke HP atau komputer lain.
- Jika data situs/browser dihapus, progres belajar dapat ikut terhapus.
- Mode Incognito/Private Browsing biasanya tidak cocok untuk menyimpan progres jangka panjang.

## Mengubah materi

Data dipisahkan agar mudah diperbarui:

- `src/data/story.json` — judul, bagian cerita, dan pesan moral.
- `src/data/vocabulary.json` — kosakata Arab, transliterasi, arti, dan contoh.
- `src/data/quiz.json` — soal, pilihan jawaban, jawaban benar, dan pembahasan.

Gambar ilustrasi utama berada di `public/images/forest-race.svg`.

## Catatan

Fitur audio menggunakan Web Speech API pada browser. Ketersediaan suara Bahasa Arab bergantung pada browser dan suara bahasa yang terpasang di perangkat.
