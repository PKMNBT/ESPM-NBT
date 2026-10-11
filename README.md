# E-PUSBONAT — GitHub Pages (Static)

Versi awal baru E-PUSBONAT menggunakan HTML, CSS, dan JavaScript murni. Proyek ini berdiri sendiri dan tidak mengubah folder proyek FastAPI lama.

## Struktur
- `index.html` — halaman utama dan tiga menu
- `assets/style.css` — gaya visual responsif
- `assets/app.js` — navigasi, data SPM lokal, klaster, impor/ekspor

## Menjalankan di Mac
1. Ekstrak ZIP ini.
2. Buka folder `E-PUSBONAT-GitHub-Pages`.
3. Klik dua kali `index.html` untuk pratinjau di browser.
4. Untuk perubahan kode, gunakan editor teks/kode dan simpan file di folder proyek baru ini.

## Mengunggah ke GitHub Pages
1. Buat repository baru di GitHub, misalnya `epusbonat-pages`.
2. Upload **isi folder** proyek ini: `index.html`, folder `assets`, dan `README.md` (bukan ZIP-nya saja).
3. Buka **Settings → Pages**.
4. Pada Build and deployment pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu Save.
6. Tunggu proses deployment selesai dan buka URL Pages yang ditampilkan GitHub.

## Penting: batasan versi statis
- GitHub Pages hanya menyajikan file statis. Versi ini tidak menjalankan FastAPI, login/auth server, API, atau database.
- Data SPM disimpan pada `localStorage` browser/perangkat yang sedang digunakan. Data tidak otomatis tersinkron antarperangkat atau antarpetugas.
- Gunakan **Unduh cadangan JSON** secara berkala. Simpan file cadangan di tempat yang aman.
- Jangan masukkan identitas pasien atau data kesehatan pribadi ke repository publik.
- Angka sasaran/capaian awal sengaja nol; tidak ada angka capaian resmi yang direkayasa.
- Daftar 12 indikator adalah struktur awal kerja dan harus divalidasi terhadap pedoman resmi yang dipakai Puskesmas sebelum pelaporan.

## Cara mengubah tampilan
- Ubah warna di awal `assets/style.css` pada blok `:root`.
- Ubah teks menu dan struktur halaman di `index.html`.
- Ubah daftar indikator dan data klaster di awal `assets/app.js`.
