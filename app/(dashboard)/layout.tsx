// app/(dashboard)/layout.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login')
    }
  }, [user, router, isMounted])

  if (!isMounted || !user) {
    return null
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f5f4f0' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}