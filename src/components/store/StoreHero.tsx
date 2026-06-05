import { MapPin, Phone, Clock, Star, Package } from 'lucide-react'
import type { BusinessPublicInfo } from '@/lib/api'

type Props = {
  business: BusinessPublicInfo
  totalProducts: number
}

export default function StoreHero({ business, totalProducts }: Props) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1C0A00 0%, #431407 50%, #7C2D12 100%)',
      position: 'relative', overflow: 'hidden',
      padding: '48px 20px 56px',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.2), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -40,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,100,12,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>

          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 99, padding: '4px 12px',
            color: '#FCD34D', fontSize: 12, fontWeight: 600,
          }}>
            <Star size={12} fill="#FCD34D" />
            Produk Premium Bali
          </div>

          <h2 style={{
            fontSize: 'clamp(26px, 5vw, 42px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.15, maxWidth: 600,
          }}>
            {business.description || `Selamat datang di ${business.name}`}
          </h2>

          {/* Info chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
            {business.city && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.1)', color: '#FEF3C7',
                borderRadius: 99, padding: '5px 12px', fontSize: 13,
              }}>
                <MapPin size={13} />
                {business.city}, Bali
              </div>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.1)', color: '#FEF3C7',
              borderRadius: 99, padding: '5px 12px', fontSize: 13,
            }}>
              <Clock size={13} />
              Pesan H-1 sebelum jam 15.00
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.1)', color: '#FEF3C7',
              borderRadius: 99, padding: '5px 12px', fontSize: 13,
            }}>
              <Package size={13} />
              {totalProducts} produk tersedia
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
