'use client'
import { useState, useEffect } from 'react'
import { Save, Globe, Bell, Shield, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { businessAPI } from '@/lib/api'

export default function SettingsPage() {
  const { activeBusiness, user } = useAuth()
  const [tab, setTab] = useState<'business' | 'storefront' | 'account'>('business')
  const [form, setForm] = useState({
    name: '', description: '', address: '', city: '', province: 'Bali',
    postal_code: '', phone: '', email: '', website: '', npwp: '', nib: '',
    enable_public_storefront: false, logo_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!activeBusiness) return
    setForm({
      name: activeBusiness.name || '',
      description: (activeBusiness as any).description || '',
      address: (activeBusiness as any).address || '',
      city: activeBusiness.city || '',
      province: (activeBusiness as any).province || 'Bali',
      postal_code: (activeBusiness as any).postal_code || '',
      phone: activeBusiness.phone || '',
      email: activeBusiness.email || '',
      website: (activeBusiness as any).website || '',
      npwp: (activeBusiness as any).npwp || '',
      nib: (activeBusiness as any).nib || '',
      enable_public_storefront: activeBusiness.enable_public_storefront || false,
      logo_url: activeBusiness.logo_url || '',
    })
  }, [activeBusiness])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!activeBusiness) return
    setSaving(true)
    try {
      await businessAPI.update(activeBusiness.id, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const TABS = [
    { key: 'business', label: '🏢 Info Bisnis', icon: Building2 },
    { key: 'storefront', label: '🌐 Storefront', icon: Globe },
    { key: 'account', label: '👤 Akun', icon: Shield },
  ] as const

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengaturan</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Kelola bisnis dan akun Anda</p>
        </div>
        {saved && (
          <div className="badge badge-success" style={{ padding: '8px 14px', fontSize: 13 }}>
            ✅ Tersimpan
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key}
            className={`btn ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Business Info */}
      {tab === 'business' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Informasi Bisnis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Nama Bisnis *</label>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <textarea className="input" rows={3} value={form.description}
                  onChange={e => set('description', e.target.value)}
                  style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="label">Logo (URL atau Emoji)</label>
                <input className="input" value={form.logo_url}
                  onChange={e => set('logo_url', e.target.value)}
                  placeholder="🏪 atau https://..." />
              </div>
              <div>
                <label className="label">No. Telepon</label>
                <input className="input" value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="628123456789" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" value={form.website}
                  onChange={e => set('website', e.target.value)}
                  placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Lokasi & Legal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Alamat</label>
                <textarea className="input" rows={2} value={form.address}
                  onChange={e => set('address', e.target.value)}
                  style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Kota</label>
                  <input className="input" value={form.city}
                    onChange={e => set('city', e.target.value)}
                    placeholder="Denpasar" />
                </div>
                <div>
                  <label className="label">Provinsi</label>
                  <input className="input" value={form.province}
                    onChange={e => set('province', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Kode Pos</label>
                <input className="input" value={form.postal_code}
                  onChange={e => set('postal_code', e.target.value)}
                  placeholder="80100" />
              </div>
              <div>
                <label className="label">NPWP</label>
                <input className="input" value={form.npwp}
                  onChange={e => set('npwp', e.target.value)}
                  placeholder="00.000.000.0-000.000" />
              </div>
              <div>
                <label className="label">NIB (Nomor Induk Berusaha)</label>
                <input className="input" value={form.nib}
                  onChange={e => set('nib', e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* Storefront */}
      {tab === 'storefront' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Public Storefront</h3>
            <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>
              Aktifkan untuk membuat halaman toko online yang bisa diakses publik
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', background: form.enable_public_storefront ? '#F0FDF4' : '#F9FAFB',
                borderRadius: 10, border: `1px solid ${form.enable_public_storefront ? '#BBF7D0' : '#E5E7EB'}`,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Aktifkan Storefront</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                    Tampilkan produk ke pelanggan
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.enable_public_storefront}
                    onChange={e => set('enable_public_storefront', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: 99,
                    background: form.enable_public_storefront ? '#E8640C' : '#D1D5DB',
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute', height: 18, width: 18,
                      left: form.enable_public_storefront ? 23 : 3,
                      bottom: 3, background: '#fff', borderRadius: '50%',
                      transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </span>
                </label>
              </div>

              {form.enable_public_storefront && activeBusiness && (
                <div style={{ padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 6 }}>URL Storefront:</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#15803D', wordBreak: 'break-all' }}>
                    {`${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://toko.gerbangku.com'}/${activeBusiness.slug}`}
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{ marginTop: 8, background: '#16A34A', color: '#fff' }}
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://toko.gerbangku.com'}/${activeBusiness.slug}`, '_blank')}
                  >
                    Buka Storefront ↗
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Paket Langganan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {[
                { plan: 'starter', label: 'Starter', price: 'Gratis', features: ['1 bisnis', '50 produk', 'Storefront dasar'], current: activeBusiness?.plan === 'starter' },
                { plan: 'bisnis', label: 'Bisnis', price: 'Rp 149.000/bln', features: ['3 bisnis', '500 produk', 'WA Bot', 'Laporan lengkap'], current: activeBusiness?.plan === 'bisnis' },
                { plan: 'pro', label: 'Pro', price: 'Rp 349.000/bln', features: ['10 bisnis', 'Produk tak terbatas', 'API akses', 'Priority support'], current: activeBusiness?.plan === 'pro' },
              ].map(p => (
                <div key={p.plan} style={{
                  padding: '12px 16px', borderRadius: 10,
                  border: `2px solid ${p.current ? '#E8640C' : '#E5E7EB'}`,
                  background: p.current ? '#FFF7ED' : '#fff',
                  position: 'relative',
                }}>
                  {p.current && (
                    <span className="badge badge-orange" style={{ position: 'absolute', top: -8, right: 10, fontSize: 10 }}>
                      Paket Anda
                    </span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700 }}>{p.label}</span>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{p.price}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{p.features.join(' • ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* Account */}
      {tab === 'account' && (
        <div style={{ maxWidth: 480 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Informasi Akun</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: '#F9FAFB', borderRadius: 10, marginBottom: 6
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E8640C, #F59E0B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {user?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.full_name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{user?.email}</div>
                </div>
              </div>
              <div>
                <label className="label">Nama Lengkap</label>
                <input className="input" defaultValue={user?.full_name} readOnly style={{ background: '#F9FAFB' }} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" defaultValue={user?.email} readOnly style={{ background: '#F9FAFB' }} />
              </div>
              <div>
                <label className="label">No. HP</label>
                <input className="input" defaultValue={user?.phone} readOnly style={{ background: '#F9FAFB' }} />
              </div>
              <div style={{ padding: '12px 14px', background: '#FEF3C7', borderRadius: 8, fontSize: 13, color: '#92400E' }}>
                ℹ️ Untuk mengubah email atau password, hubungi support Gerbangku.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
