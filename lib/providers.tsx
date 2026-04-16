// lib/providers.tsx
'use client'

import { createContext, useState, ReactNode, useCallback } from 'react'
import type { AuthContextType, User } from '@/types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 900))
      setUser({
        id: '1',
        name: 'Made Budi',
        email,
        bizType: 'supplier',
      })
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    setUser,
    login,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}