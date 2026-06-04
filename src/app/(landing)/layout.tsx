import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gerbangku — Platform Bisnis UMKM Bali',
  description: 'Kelola produk, pesanan, invoice, dan WhatsApp bot bisnis Anda dalam satu platform. Gratis untuk UMKM Bali.',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
