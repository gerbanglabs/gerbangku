'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; type: ToastType }

type ToastCtx = { showToast: (message: string, type?: ToastType) => void }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} })

export function useToast() { return useContext(ToastContext) }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(toast => toast.id !== id)), 3500)
  }, [])

  const icons = { success: CheckCircle, error: AlertCircle, info: Info }
  const colors = {
    success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: '#16A34A' },
    error: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '#EF4444' },
    info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: '#3B82F6' },
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: 80, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          const c = colors[toast.type]
          return (
            <div key={toast.id} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              color: c.text, fontSize: 14, fontWeight: 500,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              animation: 'fadeUp 0.25s ease',
              pointerEvents: 'auto', minWidth: 280, maxWidth: 360,
            }}>
              <Icon size={16} color={c.icon} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => setToasts(t => t.filter(to => to.id !== toast.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.icon, padding: 0 }}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
