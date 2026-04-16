// app/(dashboard)/dashboard/page.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import DashboardView from '@/components/dashboard/DashboardView'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardView 
      userName={user.name || 'User'} 
      bizType={user.bizType || 'supplier'} 
    />
  )
}