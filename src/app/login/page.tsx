'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthProvider, AuthContext } from '@/hooks/useAuth'

function LoginForm() {
  const { login } = useAuthProvider()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(email, password)
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Email atau password salah')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#F3F4F6',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,100,12,0.15), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(232,100,12,0.3)' }}>🏪</div>
          <h1 style={{ color: '#F3F4F6', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Gerbangku</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Platform Bisnis UMKM Bali</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>
          <h2 style={{ color: '#F3F4F6', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Masuk ke akun Anda</h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#FCA5A5', fontSize: 13 }}>
              <AlertCircle size={15} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="adi@gerbangku.com" style={inp}
                onFocus={e => e.target.style.borderColor = '#E8640C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ ...inp, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = '#E8640C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? 'rgba(232,100,12,0.5)' : 'linear-gradient(135deg, #E8640C, #F59E0B)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading && <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />}
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', color: '#4B5563', fontSize: 13 }}>
            Demo: <button onClick={() => { setEmail('adi@gerbangku.com'); setPassword('password123') }}
              style={{ background: 'none', border: 'none', color: '#E8640C', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              Isi demo credentials
            </button>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#4B5563', fontSize: 13 }}>
              Belum punya akun?{' '}
              <Link href="/register" style={{ color: '#E8640C', fontWeight: 600, textDecoration: 'none' }}>Daftar gratis →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const auth = useAuthProvider()
  return (
    <AuthContext.Provider value={auth}>
      <LoginForm />
    </AuthContext.Provider>
  )
}
