// components/dashboard/Topbar.tsx - Update bagian button "Buat SO"
'use client'

import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'

interface TopbarProps {
  onToggleSidebar?: () => void
  title?: string
}

export default function Topbar({ onToggleSidebar, title = 'Dashboard' }: TopbarProps) {
  const router = useRouter()

  return (
    <header
      style={{
        background: '#f5f4f0',
        borderBottom: '1px solid #ede8e0',
        padding: '0 28px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: '#6b6456',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2d2520' }}>
            {title}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <button
            style={{
              background: '#fff',
              border: '1.5px solid #e5e0d8',
              borderRadius: 10,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b6456',
            }}
          >
            <Icon name="bell" size={18} />
          </button>
          <div
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 10,
              height: 10,
              background: '#e53935',
              borderRadius: '50%',
              border: '2px solid #f5f4f0',
            }}
          />
        </div>
        <button
          onClick={() => router.push('/sales-order')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            background: '#2d2520',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#1a1510'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#2d2520'
          }}
        >
          <Icon name="plus" size={16} /> Buat SO
        </button>
      </div>
    </header>
  )
}