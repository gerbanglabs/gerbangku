import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE}/public/business/${params.slug}/info`, {
      next: { revalidate: 3600 }
    })
    const data = await res.json()
    if (data.success && data.data) {
      const biz = data.data
      return {
        title: `${biz.name} — Toko Online`,
        description: biz.description || `Belanja produk dari ${biz.name}, ${biz.city || 'Bali'}`,
        openGraph: {
          title: biz.name,
          description: biz.description || `Belanja dari ${biz.name}`,
          type: 'website', locale: 'id_ID',
        },
      }
    }
  } catch {}
  return {
    title: 'Toko Online — Gerbangku',
    description: 'Belanja produk UMKM Bali berkualitas',
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
