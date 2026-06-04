'use client'
import { useState } from 'react'
import { X, CheckCircle, Loader2, MessageCircle } from 'lucide-react'
import { formatRupiah, buildWAMessage, type CartItem, type BusinessInfo } from '@/lib/api'

type Props = {
  business: BusinessInfo
  cart: CartItem[]
  totalPrice: number
  onClose: () => void
  onConfirm: (customer: { name: string; phone: string; address: string; notes: string }) => Promise<{ orderNumber?: string } | void>
}

type Step = 'form' | 'processing' | 'success'

export default function CheckoutModal({ business, cart, totalPrice, onClose, onConfirm }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nama wajib diisi'
    if (!form.phone.trim()) errs.phone = 'No. HP wajib diisi'
    if (form.phone && !/^[0-9+]{8,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = 'Format nomor tidak valid'
    }
    if (!form.address.trim()) errs.address = 'Alamat wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setStep('processing')
    try {
      const result = await onConfirm(form) as any
      const orderNum = result?.order_number || result?.so_number || ''
      setOrderNumber(orderNum)
      setStep('success')
    } catch {
      // even if API fails, show WA button
      setStep('success')
    }
  }

  const handleOpenWA = () => {
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || business.phone?.replace(/[^0-9]/g, '') || ''
    const msg = buildWAMessage(business.name, cart, form, orderNumber)
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 60, padding: '0',
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 480,
        borderRadius: '24px 24px 0 0',
        maxHeight: '92vh', overflow: 'auto',
        animation: 'fadeUp 0.3s ease',
      }}>
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: '#E7E5E4', borderRadius: 99 }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '12px 24px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #F5F5F4',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            {step === 'form' ? 'Detail Pengiriman' :
              step === 'processing' ? 'Memproses...' : '✅ Pesanan Diterima!'}
          </h2>
          <button onClick={onClose} style={{
            background: '#F5F5F4', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 32px' }}>

          {/* FORM STEP */}
          {step === 'form' && (
            <>
              {/* Order summary */}
              <div style={{
                background: '#FFF7ED', borderRadius: 12, padding: '14px 16px',
                marginBottom: 20, border: '1px solid #FFEDD5',
              }}>
                <div style={{ fontSize: 13, color: '#9A3412', fontWeight: 600, marginBottom: 8 }}>
                  Ringkasan Pesanan ({cart.length} produk)
                </div>
                {cart.map(item => (
                  <div key={item.product.id} style={{
                    display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4,
                  }}>
                    <span style={{ color: '#44403C' }}>
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div style={{
                  borderTop: '1px dashed #FDBA74', marginTop: 10, paddingTop: 10,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#E8640C' }}>
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'name', label: 'Nama Lengkap', placeholder: 'Masukkan nama Anda', type: 'text' },
                  { key: 'phone', label: 'No. WhatsApp', placeholder: '08123456789', type: 'tel' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#44403C', marginBottom: 6 }}>
                      {field.label} <span style={{ color: '#E8640C' }}>*</span>
                    </label>
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={e => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '11px 14px',
                        border: `1.5px solid ${errors[field.key] ? '#EF4444' : '#E7E5E4'}`,
                        borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                        outline: 'none', color: '#1C1917',
                        background: errors[field.key] ? '#FEF2F2' : '#fff',
                      }}
                      onFocus={e => { if (!errors[field.key]) e.target.style.borderColor = '#E8640C' }}
                      onBlur={e => { if (!errors[field.key]) e.target.style.borderColor = '#E7E5E4' }}
                    />
                    {errors[field.key] && (
                      <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors[field.key]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#44403C', marginBottom: 6 }}>
                    Alamat Pengiriman <span style={{ color: '#E8640C' }}>*</span>
                  </label>
                  <textarea
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="Masukkan alamat lengkap..."
                    rows={3}
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: `1.5px solid ${errors.address ? '#EF4444' : '#E7E5E4'}`,
                      borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                      outline: 'none', resize: 'vertical', color: '#1C1917',
                    }}
                    onFocus={e => { if (!errors.address) e.target.style.borderColor = '#E8640C' }}
                    onBlur={e => { if (!errors.address) e.target.style.borderColor = '#E7E5E4' }}
                  />
                  {errors.address && (
                    <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.address}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#44403C', marginBottom: 6 }}>
                    Catatan (opsional)
                  </label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Contoh: Kirim pagi hari..."
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: '1.5px solid #E7E5E4',
                      borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                      outline: 'none', color: '#1C1917',
                    }}
                    onFocus={e => e.target.style.borderColor = '#E8640C'}
                    onBlur={e => e.target.style.borderColor = '#E7E5E4'}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  width: '100%', marginTop: 20, padding: '14px',
                  background: 'linear-gradient(135deg, #E8640C, #F59E0B)',
                  border: 'none', borderRadius: 12, color: '#fff',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(232,100,12,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <MessageCircle size={18} />
                Konfirmasi & Lanjut ke WhatsApp
              </button>
            </>
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '4px solid #FFEDD5',
                borderTopColor: '#E8640C',
                margin: '0 auto 20px',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontWeight: 600, fontSize: 16 }}>Membuat pesanan...</p>
              <p style={{ color: '#78716C', fontSize: 13, marginTop: 6 }}>Mohon tunggu sebentar</p>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle size={36} color="#16A34A" />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                Pesanan Berhasil! 🎉
              </h3>

              {orderNumber && (
                <div style={{
                  display: 'inline-block', background: '#F0FDF4',
                  border: '1px solid #BBF7D0', borderRadius: 8,
                  padding: '6px 16px', marginBottom: 12,
                }}>
                  <span style={{ fontSize: 13, color: '#15803D', fontWeight: 600 }}>
                    No. Pesanan: {orderNumber}
                  </span>
                </div>
              )}

              <p style={{ color: '#78716C', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Pesanan Anda sudah tercatat. Klik tombol di bawah untuk konfirmasi via WhatsApp.
              </p>

              {/* Order recap */}
              <div style={{
                background: '#FAFAF9', borderRadius: 12, padding: '14px',
                marginBottom: 20, textAlign: 'left',
              }}>
                <div style={{ fontSize: 12, color: '#78716C', fontWeight: 600, marginBottom: 8 }}>
                  DETAIL PENGIRIMAN
                </div>
                {[
                  { label: 'Nama', value: form.name },
                  { label: 'No. WA', value: form.phone },
                  { label: 'Alamat', value: form.address },
                  { label: 'Total', value: formatRupiah(totalPrice) },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', gap: 8, fontSize: 13, marginBottom: 4,
                  }}>
                    <span style={{ color: '#78716C', minWidth: 60 }}>{row.label}</span>
                    <span style={{ fontWeight: 500, color: '#1C1917' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOpenWA}
                style={{
                  width: '100%', padding: '15px',
                  background: '#25D366',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                }}
              >
                <MessageCircle size={20} />
                Buka WhatsApp Sekarang
              </button>

              <p style={{ fontSize: 12, color: '#A8A29E', marginTop: 10 }}>
                Pesan sudah disiapkan, tinggal kirim ke penjual
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
