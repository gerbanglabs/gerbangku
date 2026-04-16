// components/auth/LoginPage.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!email || !pass) {
      setErr('Email dan password wajib diisi.')
      return
    }
    
    try {
      await login?.(email, pass)
      router.push('/dashboard')
    } catch (error) {
      setErr('Login gagal. Cek email dan password.')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: '#38a169',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: '0 auto 12px',
          }}
        >
          🌴
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a202c' }}>
          Gerbangku
        </div>
        <div style={{ fontSize: 13, color: '#718096', marginTop: 3 }}>
          Platform bisnis Bali all-in-one
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
          gap: 18,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a202c' }}>
          Masuk ke akun kamu
        </div>

        {err && (
          <div
            style={{
              background: '#fff5f5',
              border: '1px solid #fed7d7',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 12,
              color: '#c53030',
            }}
          >
            {err}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
            Email <span style={{ color: '#c53030' }}>*</span>
          </label>
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErr('')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${err ? '#c53030' : '#e2e8f0'}`,
              borderRadius: 8,
              fontSize: 13,
              color: '#1a202c',
              background: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568' }}>
            Password <span style={{ color: '#c53030' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value)
                setErr('')
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                paddingRight: 40,
                border: `1px solid ${err ? '#c53030' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 13,
                color: '#1a202c',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
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
        </div>

        <button
          onClick={submit}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '11px 20px',
            background: isLoading ? '#e2e8f0' : '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            transition: 'all 0.15s',
          }}
        >
          {isLoading ? 'Masuk…' : 'Masuk →'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#718096' }}>
          Belum punya akun?{' '}
          <span
            onClick={() => router.push('/register')}
            style={{
              color: '#3182ce',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Daftar gratis
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage