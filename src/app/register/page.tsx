'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { authAPI } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const pwStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const strength = pwStrength(form.password)
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Bagus', 'Kuat'][strength]
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981', '#10B981'][strength]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Password tidak cocok'); return }
    if (strength < 2) { setError('Password terlalu lemah'); return }
    setLoading(true); setError('')
    try {
      const { token } = await authAPI.register({
        email: form.email, password: form.password,
        full_name: form.full_name, phone: form.phone
      })
      localStorage.setItem('gerbangku_token', token)
      router.push('/onboarding')
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,100,12,0.15), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(232,100,12,0.3)' }}>🏪</div>
          <h1 style={{ color: '#F3F4F6', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Mulai Pakai Gerbangku</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Daftar gratis, mulai kelola bisnis Anda</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#FCA5A5', fontSize: 13 }}>
              <AlertCircle size={15} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Nama Lengkap</label>
                <input type="text" required value={form.full_name} onChange={e => set('full_name', e.target.value)}
                  placeholder="Budi Santoso"
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#E8640C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="budi@example.com"
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#E8640C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>No. WhatsApp</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="08123456789"
                  style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#E8640C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => set('password', e.target.value)} placeholder="Min. 8 karakter"
                    style={{ width: '100%', padding: '11px 40px 11px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#E8640C'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Konfirmasi Password</label>
                <input type="password" required value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Ulangi password"
                  style={{ width: '100%', padding: '11px 14px', background: form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${form.confirm && form.confirm !== form.password ? '#EF4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: '#F3F4F6', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => { if (form.confirm === form.password) e.target.style.borderColor = '#E8640C' }}
                  onBlur={e => { if (form.confirm === form.password) e.target.style.borderColor = 'rgba(255,255,255,0.1)' }} />
                {form.confirm && form.confirm === form.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: '#10B981' }}>
                    <Check size={12} /> Password cocok
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 20, padding: '12px',
              background: loading ? 'rgba(232,100,12,0.5)' : 'linear-gradient(135deg, #E8640C, #F59E0B)',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(232,100,12,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading && <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />}
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, color: '#4B5563', fontSize: 13 }}>
            Sudah punya akun?{' '}
            <a href="/login" style={{ color: '#E8640C', fontWeight: 600, textDecoration: 'none' }}>Masuk</a>
          </p>
        </div>
      </div>
    </div>
  )
}
