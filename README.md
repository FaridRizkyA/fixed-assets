# 📦 Fixed Assets Management System

Proyek ini merupakan aplikasi manajemen aset tetap yang dikembangkan oleh:

**Kelompok 1:**
- Farid Rizk Amrullah  
- Bintang Ilyasa Nugraha  
- Lastri Arta Uli Pangaribuan

## 🏢 Tema Proyek
Aplikasi dirancang untuk kebutuhan **PT Cipta Kargo**, perusahaan yang bergerak di bidang **logistik dan distribusi**.

## 🗄️ Database
Nama database: **`fixed_assets_db`**  
File database disimpan di folder `database/fixed_assets_db.sql`.

### 🎯 Cara Import:
1. Buka MySQL / phpMyAdmin
2. Buat database baru dengan nama: `fixed_assets_db`
3. Import file `fixed_assets_db.sql` ke dalamnya

## ▶️ Cara Menjalankan Aplikasi

### 1. Jalankan **Frontend**:
```
cd fixed-assets/frontend
npm run dev
```

### 2. Jalankan **Backend**:
```
cd fixed-assets/backend
node index.js
```

## 🔐 Informasi Login
| Role          | Username       | Password |
| ------------- | -------------- | -------- |
| Admin         | `admin_cipta`  | `12345`  |
| Asset Manager | `ast_mgr_andi` | `12345`  |
| Finance       | `finance_rina` | `12345`  |
| Auditor       | `auditor_budi` | `12345`  |
| Staff         | `staff_aldi`   | `12345`  |

## 🧭 Struktur Halaman Aplikasi
### 📊 Dashboard
4 Summary Card:
Total Aset Aktif
Total Nilai Aset
Total Nilai Penyusutan
Total Aset yang Dihapus

4 Grafik:
Pie Chart: Jumlah Kategori Aset
Line Chart: Penyusutan Tiap Bulan
Bar Chart: 3 Aset Nilai Tertinggi
Donut Chart: Tipe Penghapusan Aset

Tabel Riwayat Aset

### 🏗️ Pengadaan Aset
Input data aset dan upload file dokumen
Otomatis insert data penyusutan tiap bulan berdasarkan tanggal perolehan
Menampilkan daftar aset (available / in_use)
Fitur search, filter berdasarkan tahun, edit (admin/asset_manager), dan cetak tabel

Jenis penyusutan:
Kendaraan Operasional: 5 tahun, Straight Line
Peralatan Gudang: 4 tahun, Declining Balance
Peralatan Kantor: 3 tahun, Straight Line
Komputer & Elektronik: 3 tahun, Straight Line
Alat Berat: 6 tahun, Declining Balance

#### 📘 1. Straight Line Depreciation (Garis Lurus)
##### 🧮 Rumus:
Penyusutan per tahun = Harga Perolehan − Nilai Residu / Umur Manfaat (tahun)
Penyusutan per bulan = Penyusutan per tahun / 12

#### 📘 2. Declining Balance Depreciation (Saldo Menurun)
##### 🧮 Rumus:
Tarif Penyusutan = 2 / Umur Manfaat (tahun)
Penyusutan per tahun = Nilai Buku × Tarif Penyusutan
Penyusutan per bulan = Penyusutan per tahun / 12

### 🧾 Penempatan Aset
Input penempatan aset → status aset jadi in_use
Jika return date NULL, muncul tombol Kembalikan untuk mengisi return date & ubah status jadi available
Fitur edit:
Tidak bisa edit return date jika belum dikembalikan
Bisa edit return date setelah dikembalikan
Hapus data → otomatis ubah status aset ke available jika masih in_use
Cetak tabel

### 🧮 Penyusutan Aset
Tabel ringkasan penyusutan & riwayat penyusutan bulanan
Penyusutan otomatis dihitung saat insert aset & saat bulan baru dimulai
Fitur filter, search, dan cetak laporan

### 🗑️ Penghapusan Aset
Input data penghapusan aset (soft delete)
Ubah status aset menjadi disposal
Jika tipe disposal = sale, isi nilai jual
Menampilkan data aset yang dihapus
Fitur edit, pulihkan aset, filter, search, cetak tabel

### 📂 Dokumen Aset
Menampilkan semua dokumen aset
Fitur: edit dokumen (tipe & file), buka file di tab baru

### 👤 Manajemen User
Hanya bisa diakses oleh admin
Fitur:
Tambah user baru
Edit password user
Aktif / Nonaktifkan user

## 🔒 Hak Akses Tiap Role
| Halaman          | Admin | Asset Manager | Finance | Auditor | Staff |
| ---------------- | :---: | :-----------: | :-----: | :-----: | :---: |
| Dashboard        |   ✅   |       ✅       |    ✅    |    ✅    |   ✅   |
| Pengadaan Aset   |   ✅   |       ✅       |    🔍   |    🔍   |   🔍  |
| Penempatan Aset  |   ✅   |       ✅       |    🔍   |    🔍   |   🔍  |
| Penyusutan Aset  |   ✅   |       ✅       |    ✅    |    ✅    |   ❌   |
| Penghapusan Aset |   ✅   |       ✅       |    ✅    |    ✅    |   ❌   |
| Dokumen Aset     |   ✅   |       ✅       |    ❌    |    🔍   |   ❌   |
| Manajemen User   |   ✅   |       ❌       |    ❌    |    ❌    |   ❌   |
Keterangan:
✅ = akses penuh
🔍 = hanya bisa lihat & cetak
❌ = tidak bisa akses sama sekali (navigasi disembunyikan)
