# Lanyard Component - Asset Setup

## ⚠️ IMPORTANT: Replace Placeholder Assets

File `card.glb` dan `lanyard.png` di folder ini adalah **placeholder kosong**.
Kamu **HARUS** mengganti file-file ini dengan asset yang sebenarnya agar Lanyard berfungsi dengan baik.

## Cara Mendapatkan Assets

### 1. Download dari Repository Asli
Assets bisa didownload dari repository sumber:
- Cari file `card.glb` dan `lanyard.png` di folder `src/assets/lanyard`
- Copy ke folder ini (`components/ui/Lanyard/`)

### 2. Edit Card Texture
Kamu bisa customize texture kartu menggunakan online editor:
- Buka: https://modelviewer.dev/editor/
- Upload file `card.glb`
- Edit texture sesuai keinginan
- Download hasil editan

### 3. Edit Lanyard Band
File `lanyard.png` adalah texture untuk tali lanyard:
- Edit menggunakan image editor (Photoshop, Figma, dll)
- Ukuran yang disarankan: seamless/tileable texture
- Format: PNG dengan transparansi jika diperlukan

## Verifikasi

Setelah mengganti file, pastikan:
1. File `card.glb` memiliki struktur yang benar (nodes: card, clip, clamp)
2. File `lanyard.png` adalah gambar valid
3. Restart dev server (`npm run dev`)
4. Check browser console untuk error

## Troubleshooting

Jika Lanyard tidak muncul:
- Check browser console untuk error loading assets
- Pastikan file path di `Lanyard.tsx` sudah benar
- Pastikan Next.js config sudah handle .glb files (sudah disetup di `next.config.ts`)
