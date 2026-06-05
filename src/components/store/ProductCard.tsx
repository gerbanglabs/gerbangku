'use client'
import { ShoppingCart, Star, BadgeCheck, Info } from 'lucide-react'
import { formatRupiah, type ProductPublic } from '@/lib/api'

type Props = {
  product: ProductPublic
  onAdd: (product: ProductPublic) => void
  cartQty: number
  onDetail?: (product: ProductPublic) => void
}

export default function ProductCard({ product, onAdd, cartQty, onDetail }: Props) {
  const emoji = product.image_url && product.image_url.length <= 4
    ? product.image_url : '🥜'

  return (
    <div className="product-card fade-up" style={{ position: 'relative' }}>
      {product.is_bestseller && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 2,
          background: 'linear-gradient(135deg, #F59E0B, #E8640C)',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '3px 8px', borderRadius: 99,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <BadgeCheck size={10} /> TERLARIS
        </div>
      )}

      {cartQty > 0 && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: '#E8640C', color: '#fff',
          width: 22, height: 22, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700,
        }}>
          {cartQty}
        </div>
      )}

      {/* Image */}
      <div
        onClick={() => onDetail?.(product)}
        style={{
          height: 140,
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FFEDD5 50%, #FEF9C3 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72, userSelect: 'none', position: 'relative', overflow: 'hidden',
          cursor: onDetail ? 'pointer' : 'default',
        }}
      >
        <div style={{ position: 'absolute', width: 120, height: 120, background: 'rgba(232,100,12,0.06)', borderRadius: '50%', top: -20, right: -20 }} />
        <span style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))', position: 'relative' }}>
          {emoji}
        </span>
        {onDetail && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(255,255,255,0.9)', borderRadius: 6,
            padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, color: '#78716C', fontWeight: 500,
          }}>
            <Info size={10} /> Detail
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        {product.category && (
          <div style={{ fontSize: 10, fontWeight: 700, color: '#E8640C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            {product.category}
          </div>
        )}
        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, color: '#1C1917' }}>
          {product.name}
        </h3>
        {product.description && (
          <p style={{
            fontSize: 12, color: '#78716C', lineHeight: 1.5, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}
        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#78716C' }}>{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#E8640C', lineHeight: 1 }}>
              {formatRupiah(product.price)}
            </div>
            <div style={{ fontSize: 11, color: '#A8A29E', marginTop: 1 }}>/ {product.unit}</div>
          </div>
          <button
            onClick={() => product.in_stock && onAdd(product)}
            disabled={!product.in_stock}
            style={{
              background: product.in_stock
                ? cartQty > 0
                  ? 'linear-gradient(135deg, #16A34A, #15803D)'
                  : 'linear-gradient(135deg, #E8640C, #F59E0B)'
                : '#E7E5E4',
              color: product.in_stock ? '#fff' : '#A8A29E',
              border: 'none', borderRadius: 10,
              padding: '9px 14px', fontSize: 13, fontWeight: 700,
              cursor: product.in_stock ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'inherit', flexShrink: 0,
              boxShadow: product.in_stock ? '0 4px 12px rgba(232,100,12,0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ShoppingCart size={14} />
            {!product.in_stock ? 'Habis' : cartQty > 0 ? '+1' : 'Beli'}
          </button>
        </div>
        {!product.in_stock && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#EF4444', fontWeight: 600, textAlign: 'center' }}>
            ❌ Stok sedang habis
          </div>
        )}
      </div>
    </div>
  )
}
