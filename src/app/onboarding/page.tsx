'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight } from 'lucide-react'
import { businessAPI, authAPI } from '@/lib/api'

const BIZ_TYPES = [
  { type: 'supplier', emoji: '🏭', label: 'Supplier / Distributor', desc: 'Jual ke bisnis lain, kelola stok & faktur' },
  { type: 'kuliner', emoji: '🍜', label: 'Kuliner / F&B', desc: 'Warung, resto, kafe, katering' },
  { type: 'penginapan', emoji: '🏨', label: 'Penginapan', desc: 'Villa, hotel, kos-kosan' },
  { type: 'pengrajin', emoji: '🎨', label: 'Pengrajin / Kerajinan', desc: 'Produk handmade, seni, ukiran' },
  { type: 'retail', emoji: '🛒', label: 'Retail / Toko', desc: 'Toko fisik atau online' },
  { type: 'jasa', emoji: '🔧', label: 'Jasa / Layanan', desc: 'Servis, konsultasi, freelance' },
]

const PLANS = [
  { plan: 'starter', emoji: '🌱', label: 'Starter', price: 'Gratis selamanya', color: '#6B7280', features: ['1 bisnis', '50 produk', 'Storefront dasar', 'WA Bot (terbatas)'] },
  { plan: 'bisnis', emoji: '🚀', label: 'Bisnis', price: 'Rp 149.000 / bulan', color: '#E8640C', features: ['3 bisnis', '500 produk', 'WA Bot penuh', 'Laporan lengkap', 'Storefront custom'], highlight: true },
  { plan: 'pro', emoji: '💎', label: 'Pro', price: 'Rp 349.000 / bulan', color: '#8B5CF6', features: ['10 bisnis', 'Tak terbatas', 'API akses', 'Priority support', 'Broadcast WA'] },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [bizType, setBizType] = useState('')
  const [plan, setPlan] = useState('starter')
  const [form, setForm] = useState({ name: '', city: '', phone: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleFinish = async () => {
    if (!form.name) { setError('Nama bisnis wajib diisi'); return }
    setSaving(true); setError('')
    try {
      await businessAPI.create({ name: form.name, business_type: bizType, city: form.city, phone: form.phone, email: form.email })
      router.push('/dashboard')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 640, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {['Tipe Bisnis', 'Info Bisnis', 'Pilih Paket'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                background: step > i + 1 ? '#10B981' : step === i + 1 ? '#E8640C' : '#E5E7EB',
                color: step >= i + 1 ? '#fff' : '#9CA3AF',
              }}>
                {step > i + 1 ? <Check size={13} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? '#111827' : '#9CA3AF' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 4, background: '#E5E7EB', borderRadius: 99 }}>
          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #E8640C, #F59E0B)', width: `${(step - 1) * 50}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Step 1 — Tipe Bisnis */}
        {step === 1 && (
          <div className="card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Tipe Bisnis Anda</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Pilih yang paling sesuai untuk personalisasi fitur</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {BIZ_TYPES.map(b => (
                <button key={b.type} onClick={() => setBizType(b.type)} style={{
                  padding: '16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${bizType === b.type ? '#E8640C' : '#E5E7EB'}`,
                  background: bizType === b.type ? '#FFF7ED' : '#fff',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{b.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{b.desc}</div>
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!bizType} onClick={() => setStep(2)}>
              Lanjut <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Info Bisnis */}
        {step === 2 && (
          <div className="card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Info Bisnis</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Bisa diubah nanti di pengaturan</p>
            {error && <div className="badge badge-danger" style={{ display: 'block', padding: '8px 12px', marginBottom: 16 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <label className="label">Nama Bisnis *</label>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Sambal Kacang Bu Tini" autoFocus />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Kota</label>
                  <input className="input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Denpasar" />
                </div>
                <div>
                  <label className="label">No. WhatsApp Bisnis</label>
                  <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="628123456789" />
                </div>
              </div>
              <div>
                <label className="label">Email Bisnis</label>
                <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@bisnis.com" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Kembali</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!form.name} onClick={() => setStep(3)}>
                Lanjut <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Pilih Paket */}
        {step === 3 && (
          <div className="card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Pilih Paket</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Mulai gratis, upgrade kapan saja</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {PLANS.map(p => (
                <div key={p.plan} onClick={() => setPlan(p.plan)} style={{
                  padding: '16px 20px', borderRadius: 12, cursor: 'pointer', position: 'relative',
                  border: `2px solid ${plan === p.plan ? p.color : '#E5E7EB'}`,
                  background: plan === p.plan ? (p.highlight ? '#FFF7ED' : '#FAFAF8') : '#fff',
                  transition: 'all 0.15s',
                }}>
                  {p.highlight && (
                    <div style={{ position: 'absolute', top: -10, right: 16, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>
                      PALING POPULER
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{p.emoji}</span>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{p.label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.price}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.features.map((f, i) => (
                      <span key={i} style={{ fontSize: 11, background: '#F3F4F6', padding: '2px 8px', borderRadius: 99, color: '#374151' }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Kembali</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleFinish} disabled={saving}>
                {saving ? 'Membuat bisnis...' : '🎉 Mulai Sekarang!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
