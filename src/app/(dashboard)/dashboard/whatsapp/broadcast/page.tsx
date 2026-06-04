'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { customerAPI, waAPI, type Customer } from '@/lib/api'

export default function BroadcastPage() {
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null)

  useEffect(() => {
    if (!activeBusiness) return
    customerAPI.list(activeBusiness.id).then(setCustomers).catch(console.error)
  }, [activeBusiness])

  const phoneCustomers = customers.filter(c => c.phone)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelected(prev =>
      prev.size === phoneCustomers.length
        ? new Set()
        : new Set(phoneCustomers.map(c => c.id))
    )
  }

  const handleSend = async () => {
    if (!activeBusiness || !message.trim() || selected.size === 0) return
    if (!confirm(`Kirim ke ${selected.size} pelanggan?`)) return
    setSending(true); setProgress(0)
    let success = 0; let failed = 0
    const targets = customers.filter(c => selected.has(c.id) && c.phone)
    for (let i = 0; i < targets.length; i++) {
      const c = targets[i]
      try {
        const personalised = message.replace(/{nama}/g, c.name)
        await waAPI.sendMessage(activeBusiness.id, c.phone, personalised)
        success++
      } catch { failed++ }
      setProgress(Math.round(((i + 1) / targets.length) * 100))
      await new Promise(r => setTimeout(r, 600))
    }
    setResults({ success, failed })
    setSending(false)
  }

  const TEMPLATES = [
    { label: '🎉 Promo', text: 'Halo {nama}! Ada promo spesial hari ini. Dapatkan diskon 10% untuk semua produk. Berlaku hari ini saja! 🎁' },
    { label: '📦 Stok Baru', text: 'Halo {nama}! Produk baru sudah tersedia. Segera order sebelum kehabisan! 🔥' },
    { label: '🙏 Terima Kasih', text: 'Halo {nama}! Terima kasih sudah berbelanja. Jangan sungkan order lagi ya! 😊' },
    { label: '⏰ Reminder Bayar', text: 'Halo {nama}! Mengingatkan bahwa tagihan Anda sudah jatuh tempo. Mohon segera diselesaikan. Terima kasih! 🙏' },
  ]

  if (results) {
    return (
      <div>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
            <h1 className="page-title">Hasil Broadcast</h1>
          </div>
        </div>
        <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 440, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Broadcast Selesai!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div style={{ padding: 16, background: '#F0FDF4', borderRadius: 12 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#16A34A' }}>{results.success}</div>
              <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>✅ Berhasil</div>
            </div>
            <div style={{ padding: 16, background: '#FEF2F2', borderRadius: 12 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#DC2626' }}>{results.failed}</div>
              <div style={{ fontSize: 13, color: '#991B1B', marginTop: 4 }}>❌ Gagal</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => { setResults(null); setSelected(new Set()); setMessage('') }}>
              Broadcast Baru
            </button>
            <button className="btn btn-primary" onClick={() => router.push('/dashboard/whatsapp')}>
              Monitor WA
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Broadcast WhatsApp</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Kirim pesan massal ke pelanggan</p>
          </div>
        </div>
      </div>

      {sending && (
        <div style={{ marginBottom: 20, padding: '14px 20px', background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#1D4ED8' }}>
            <span>⏳ Mengirim pesan...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 8, background: '#DBEAFE', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#3B82F6', borderRadius: 99, width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>
          <p style={{ fontSize: 12, color: '#3B82F6', marginTop: 6 }}>Jangan tutup halaman ini</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        {/* Recipient list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', maxHeight: 600 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Penerima</span>
              <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 6 }}>{selected.size}/{phoneCustomers.length}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={selectAll}>
              {selected.size === phoneCustomers.length ? 'Batal Semua' : 'Pilih Semua'}
            </button>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 530 }}>
            {customers.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>
                <Users size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>Belum ada pelanggan</p>
              </div>
            ) : customers.map(c => (
              <div key={c.id} onClick={() => c.phone && toggleSelect(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', cursor: c.phone ? 'pointer' : 'default',
                borderBottom: '1px solid #F9FAFB',
                background: selected.has(c.id) ? '#FFF7ED' : 'transparent',
                opacity: c.phone ? 1 : 0.4,
              }}>
                <input type="checkbox" checked={selected.has(c.id)} readOnly disabled={!c.phone}
                  style={{ accentColor: '#E8640C', width: 15, height: 15 }} />
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8640C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: c.phone ? '#6B7280' : '#EF4444' }}>
                    {c.phone || '⚠️ No HP kosong'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151' }}>⚡ Template Cepat</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TEMPLATES.map((t, i) => (
                <button key={i} className="btn btn-secondary btn-sm" onClick={() => setMessage(t.text)}>{t.label}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
              💡 Gunakan <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: 3 }}>{'{nama}'}</code> untuk nama pelanggan
            </p>
          </div>

          <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Tulis Pesan</span>
              <span style={{ fontSize: 11, color: message.length > 900 ? '#EF4444' : '#9CA3AF' }}>{message.length}/1000</span>
            </div>
            <textarea className="input" rows={7} value={message}
              onChange={e => setMessage(e.target.value.slice(0, 1000))}
              placeholder="Tulis pesan broadcast di sini..."
              style={{ resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />

            {message && customers[0] && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 11, color: '#166534', fontWeight: 600, marginBottom: 4 }}>
                  Preview → {customers[0].name}
                </div>
                <div style={{ fontSize: 13, color: '#166534', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {message.replace(/{nama}/g, customers[0].name)}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleSend}
            disabled={sending || !message.trim() || selected.size === 0}
            style={{ width: '100%' }}>
            {sending ? (
              <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />Mengirim {progress}%</>
            ) : (
              <><Send size={16} />Kirim ke {selected.size} Pelanggan</>
            )}
          </button>
          {selected.size > 0 && (
            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: -8 }}>
              Estimasi ~{Math.ceil(selected.size * 0.6)}s · 0.6s delay antar pesan
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
