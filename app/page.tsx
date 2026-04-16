// app/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [user, router])

  return null
}