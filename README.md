# gerbangku — Frontend Monorepo

Single Next.js app berisi Landing Page, Storefront, dan Dashboard dalam satu codebase.

## 🏗️ Struktur Route

```
src/app/
├── (landing)/landing/    → Marketing landing page
├── (store)/[slug]/       → Public storefront per bisnis
├── (dashboard)/dashboard/→ Admin dashboard (protected)
├── login/                → Halaman login
├── register/             → Halaman daftar akun
└── onboarding/           → Setup bisnis pertama
```

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Setup env
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# 3. Run
npm run dev
# → http://localhost:3001
```

## 🌐 URL Mapping

| URL | Halaman |
|---|---|
| `/landing` | Landing page marketing |
| `/login` | Login |
| `/register` | Daftar akun |
| `/onboarding` | Setup bisnis |
| `/dashboard` | Dashboard utama |
| `/dashboard/products` | Manajemen produk |
| `/dashboard/customers` | Data pelanggan |
| `/dashboard/suppliers` | Data supplier |
| `/dashboard/sales-orders` | Sales orders |
| `/dashboard/purchase-orders` | Purchase orders |
| `/dashboard/delivery-orders` | Surat jalan |
| `/dashboard/invoices` | Invoice |
| `/dashboard/whatsapp` | Monitor WA |
| `/dashboard/whatsapp/broadcast` | Broadcast WA |
| `/dashboard/reports` | Laporan |
| `/dashboard/settings` | Pengaturan |
| `/[slug]` | Storefront publik |

## 📁 Struktur Komponen

```
src/
├── components/
│   ├── dashboard/     → Sidebar, DashboardShell
│   ├── store/         → StoreHeader, StoreHero, ProductCard, Cart, CheckoutModal
│   └── ui/            → Modal, PaymentModal, PrintButton, Toast
├── hooks/
│   ├── useAuth.ts     → Auth state management
│   └── useCart.ts     → Cart state (storefront)
└── lib/
    └── api.ts         → Unified API client + semua types
```

## 🔗 Repo Backend

Backend Go + Fiber: **`core-gerbangku`**
- API URL: `http://localhost:3000`
- Docs: lihat `core-gerbangku/README.md`

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Inline CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Font**: DM Sans + DM Mono

## 🔐 Default Credentials (Demo)

```
Email: adi@gerbangku.com
Password: password123
```

Demo storefront: `http://localhost:3001/sambal-kacang-bu-tini`
