'use client'
import { useState, useEffect } from 'react'
import { ShoppingCart, MapPin, Phone, Clock } from 'lucide-react'
import type { BusinessPublicInfo } from '@/lib/api'

type Props = {
  business: BusinessPublicInfo
  totalItems: number
  onCartOpen: () => void
}

export default function StoreHeader({ business, totalItems, onCartOpen }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const emoji = business.logo_url && business.logo_url.length <= 4
    ? business.logo_url : '🏪'

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,251,247,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #F5F5F4',
      transition: 'box-shadow 0.2s',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 20px',
      }}>
        {/* Main header row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, border: '1.5px solid #FFEDD5',
            }}>
              {emoji}
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1C1917', lineHeight: 1.2 }}>
                {business.name}
              </h1>
              {business.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#A8A29E' }}>
                  <MapPin size={10} />
                  {business.city}
                </div>
              )}
            </div>
          </div>

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            style={{
              position: 'relative',
              background: totalItems > 0
                ? 'linear-gradient(135deg, #E8640C, #F59E0B)'
                : '#F5F5F4',
              border: 'none', borderRadius: 12,
              padding: '10px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              color: totalItems > 0 ? '#fff' : '#78716C',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
              transition: 'all 0.2s',
              boxShadow: totalItems > 0 ? '0 4px 14px rgba(232,100,12,0.3)' : 'none',
            }}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 ? (
              <span>{totalItems} item</span>
            ) : (
              <span>Keranjang</span>
            )}
            {totalItems > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 99, width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
