'use client'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatRupiah, type CartItem } from '@/lib/api'

type CartProps = {
  cart: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  totalPrice: number
  totalItems: number
}

export default function Cart({ cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout, totalPrice, totalItems }: CartProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100%', width: '100%', maxWidth: 420,
        background: '#fff', zIndex: 51,
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F5F5F4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="#E8640C" />
            <span style={{ fontWeight: 700, fontSize: 17 }}>Keranjang</span>
            {totalItems > 0 && (
              <span style={{
                background: '#E8640C', color: '#fff',
                borderRadius: 99, width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{totalItems}</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F5F5F4', border: 'none', borderRadius: 8,
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} color="#78716C" />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
              <p style={{ color: '#78716C', fontSize: 15, fontWeight: 500 }}>Keranjang masih kosong</p>
              <p style={{ color: '#A8A29E', fontSize: 13, marginTop: 4 }}>Yuk pilih produk favorit kamu!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map(item => (
                <div key={item.product.id} style={{
                  display: 'flex', gap: 12, padding: '14px',
                  background: '#FAFAF9', borderRadius: 12,
                  border: '1px solid #F0EFEE',
                }}>
                  {/* Emoji / image */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 10,
                    background: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                  }}>
                    {item.product.image_url?.length <= 4 ? item.product.image_url : '🥜'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#78716C', marginBottom: 8 }}>
                      {formatRupiah(item.product.price)} / {item.product.unit}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty controls */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                        background: '#fff', borderRadius: 8,
                        border: '1.5px solid #E7E5E4', overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          style={{
                            width: 30, height: 30, border: 'none',
                            background: 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Minus size={12} color="#78716C" />
                        </button>
                        <span style={{
                          width: 32, textAlign: 'center',
                          fontSize: 14, fontWeight: 700,
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          style={{
                            width: 30, height: 30, border: 'none',
                            background: '#E8640C', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Plus size={12} color="#fff" />
                        </button>
                      </div>

                      {/* Subtotal + remove */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: '#E8640C', fontSize: 14 }}>
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => onRemove(item.product.id)}
                          style={{
                            background: '#FEE2E2', border: 'none', borderRadius: 6,
                            width: 26, height: 26, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={11} color="#DC2626" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #F5F5F4' }}>
            {/* Order summary */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#78716C', fontSize: 14 }}>
                  {totalItems} item
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78716C', fontSize: 14 }}>Ongkos kirim</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#16A34A' }}>GRATIS</span>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '12px 16px', background: '#FFF7ED',
              borderRadius: 10, marginBottom: 14,
              border: '1px solid #FFEDD5',
            }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Total Pembayaran</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#E8640C' }}>
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #E8640C, #F59E0B)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(232,100,12,0.35)',
                fontFamily: 'inherit',
              }}
            >
              Pesan via WhatsApp
              <ArrowRight size={18} />
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#A8A29E', marginTop: 10 }}>
              Anda akan diarahkan ke WhatsApp untuk konfirmasi
            </p>
          </div>
        )}
      </div>
    </>
  )
}
