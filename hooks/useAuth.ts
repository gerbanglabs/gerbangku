// hooks/useAuth.ts
'use client'

import { useContext } from 'react'
import { AuthContext } from '@/lib/providers'
import type { AuthContextType } from '@/types'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}