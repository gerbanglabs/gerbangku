// components/auth/RegisterPage.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pass: '',
    pass2: '',
  })
  const [show, setShow] = useState(false)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => {
    setForm({ ...form, [k]: v })
    setErrors({ ...errors, [k]: '' })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nama lengkap wajib diisi'
    if (!form.email.includes('@')) e.email = 'Format email tidak valid'
    if (!form.phone.match(/^0[0-9]{8,12}$/))
      e.phone = 'Format nomor HP tidak valid (contoh: 08123456789)'
    if (form.pass.length < 8) e.pass = 'Password minimal 8 karakter'
    if (form.pass !== form.pass2) e.pass2 = 'Password tidak cocok'
    if (!agree) e.agree = 'Kamu harus menyetujui syarat & ketentuan'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setLoading(true)
    try {
      // Simulasi register API
      await new Promise((resolve) => setTimeout(resolve, 900))
      // Redirect ke login setelah register sukses
      router.push('/login?registered=true')
    } catch (error) {
      console.error('Register failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#38a169',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            margin: '0 auto 10px',
          }}
        >
          🌴
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>
          Daftar ke Gerbangku
        </div>
        <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>
          Gratis 14 hari, tidak perlu kartu kredit
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}
      >
        {/* Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
            Nama Lengkap <span style={{ color: '#c53030' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.name ? '#c53030' : '#e2e8f0'}`,
              borderRadius: 8,
              fontSize: 13,
              color: '#1a202c',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {errors.name && (
            <div style={{ fontSize: 11, color: '#c53030' }}>{errors.name}</div>
          )}
        </div>

        {/* Email & Phone Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
              Email <span style={{ color: '#c53030' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.email ? '#c53030' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 13,
                color: '#1a202c',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.email && (
              <div style={{ fontSize: 11, color: '#c53030' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
              No. HP / WA <span style={{ color: '#c53030' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="08123456789"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.phone ? '#c53030' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 13,
                color: '#1a202c',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.phone && (
              <div style={{ fontSize: 11, color: '#c53030' }}>
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
            Password <span style={{ color: '#c53030' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Min. 8 karakter"
              value={form.pass}
              onChange={(e) => set('pass', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                border: `1px solid ${errors.pass ? '#c53030' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 13,
                color: '#1a202c',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                paddingRight: 40,
              }}
            />
            <span
              onClick={() => setShow(!show)}
              style={{
                position: 'absolute',
                right: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: 14,
                color: '#718096',
              }}
            >
              {show ? '🙈' : '👁'}
            </span>
          </div>
          {errors.pass && (
            <div style={{ fontSize: 11, color: '#c53030' }}>{errors.pass}</div>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
            Ulangi Password <span style={{ color: '#c53030' }}>*</span>
          </label>
          <input
            type={show ? 'text' : 'password'}
            placeholder="Ketik password lagi"
            value={form.pass2}
            onChange={(e) => set('pass2', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.pass2 ? '#c53030' : '#e2e8f0'}`,
              borderRadius: 8,
              fontSize: 13,
              color: '#1a202c',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {errors.pass2 && (
            <div style={{ fontSize: 11, color: '#c53030' }}>
              {errors.pass2}
            </div>
          )}
        </div>

        {/* Agreement */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div
            onClick={() => setAgree(!agree)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: `2px solid ${agree ? '#38a169' : '#e2e8f0'}`,
              background: agree ? '#38a169' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {agree && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3.5"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.5 }}>
            Saya menyetujui{' '}
            <span style={{ color: '#3182ce', cursor: 'pointer' }}>
              Syarat & Ketentuan
            </span>{' '}
            dan{' '}
            <span style={{ color: '#3182ce', cursor: 'pointer' }}>
              Kebijakan Privasi
            </span>{' '}
            Gerbangku
          </div>
        </div>
        {errors.agree && (
          <div style={{ fontSize: 11, color: '#c53030', marginTop: -8 }}>
            {errors.agree}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px 20px',
            background: loading ? '#e2e8f0' : '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Mendaftarkan akun…' : 'Buat Akun Gratis →'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#718096' }}>
          Sudah punya akun?{' '}
          <span
            onClick={() => router.push('/login')}
            style={{
              color: '#3182ce',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Masuk
          </span>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage