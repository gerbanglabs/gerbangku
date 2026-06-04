'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthProvider, AuthContext } from '@/hooks/useAuth'
import { ToastProvider } from '@/components/ui/Toast'
import Sidebar from './Sidebar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider()
  const router = useRouter()

  useEffect(() => {
    if (!auth.loading && !auth.user) router.replace('/login')
  }, [auth.loading, auth.user, router])

  if (auth.loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8640C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#6B7280', fontSize: 14 }}>Memuat...</div>
      </div>
    </div>
  )

  if (!auth.user) return null

  return (
    <AuthContext.Provider value={auth}>
      <ToastProvider>
        <Sidebar />
        <main className="main-content animate-fade-in">{children}</main>
      </ToastProvider>
    </AuthContext.Provider>
  )
}
