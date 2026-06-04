'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { authAPI, businessAPI, type User, type Business } from '@/lib/api'

type AuthCtx = {
  user: User | null
  businesses: Business[]
  activeBusiness: Business | null
  setActiveBusiness: (b: Business) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthCtx>({} as AuthCtx)
export function useAuth() { return useContext(AuthContext) }

export function useAuthProvider(): AuthCtx {
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gerbangku_token')
    if (!token) { setLoading(false); return }
    authAPI.getProfile()
      .then(u => { setUser(u); return businessAPI.list() })
      .then(list => {
        setBusinesses(list)
        const saved = localStorage.getItem('gerbangku_business')
        const found = saved ? list.find(b => b.id === saved) : null
        setActiveBusinessState(found || list[0] || null)
      })
      .catch(() => localStorage.removeItem('gerbangku_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user: u } = await authAPI.login(email, password)
    localStorage.setItem('gerbangku_token', token)
    setUser(u)
    const list = await businessAPI.list()
    setBusinesses(list)
    setActiveBusinessState(list[0] || null)
    if (list[0]) localStorage.setItem('gerbangku_business', list[0].id)
  }

  const logout = () => {
    localStorage.removeItem('gerbangku_token')
    localStorage.removeItem('gerbangku_business')
    setUser(null); setBusinesses([]); setActiveBusinessState(null)
    window.location.href = '/login'
  }

  const setActiveBusiness = (b: Business) => {
    setActiveBusinessState(b)
    localStorage.setItem('gerbangku_business', b.id)
  }

  return { user, businesses, activeBusiness, setActiveBusiness, login, logout, loading }
}
