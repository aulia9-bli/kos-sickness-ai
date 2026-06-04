# Kos-Sickness Frontend

Frontend aplikasi konsultasi kesehatan untuk mahasiswa kos menggunakan React dan Tailwind CSS.

## Fitur

- ✅ UI modern dengan Tailwind CSS
- ✅ Form input untuk laporan gejala
- ✅ Loading state dan error handling
- ✅ Real-time character counter
- ✅ Responsive design
- ✅ Integrasi API dengan backend

## Persyaratan

- Node.js v16 atau lebih tinggi
- npm atau yarn

## Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Konfigurasi environment**
```bash
cp .env.example .env
```

3. **Jalankan development server**
```bash
npm run dev
```

Server akan membuka di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Struktur Project

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Header component
│   │   ├── SicknessForm.jsx        # Form input
│   │   └── AdviceResult.jsx        # Hasil analisis
│   ├── pages/
│   │   └── (struktur untuk page di masa depan)
│   ├── services/
│   │   └── apiClient.js            # API client dengan axios
│   ├── App.jsx                     # Main component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind CSS
├── public/                         # Static assets
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # Dependencies
└── README.md                       # Documentation
```

## Environment Variables

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL backend API | http://localhost:5000 |
| `VITE_APP_NAME` | Nama aplikasi | Kos-Sickness |

## Deployment

### Vercel

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Vercel akan otomatis detect dan deploy

### Netlify

1. Push code ke GitHub
2. Connect repository ke Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## Development

Untuk development dengan hot reload:
```bash
npm run dev
```

## Troubleshooting

### Backend tidak terhubung
- Pastikan backend sudah running di `http://localhost:5000`
- Cek CORS configuration di backend

### Vite port conflict
Ubah port di `vite.config.js`:
```js
server: {
  port: 3001,  // atau port lain
}
```

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **PostCSS**: CSS transformation

## Lisensi

ISC
