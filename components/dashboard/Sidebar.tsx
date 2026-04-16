// components/dashboard/Sidebar.tsx
'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  open?: boolean
  onToggle?: () => void
}

export default function Sidebar({ open = true, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [bizDropdown, setBizDropdown] = useState(false)

  const navItems = [
    { id: 'dashboard', icon: 'home', label: 'Dashboard', href: '/dashboard' },
    { id: 'inventory', icon: 'box', label: 'Inventory', href: '/inventory' },
    { id: 'products', icon: 'grid', label: 'Produk', href: '/products' },
    { id: 'do', icon: 'truck', label: 'Delivery Order', href: '/delivery-order' },
    { id: 'so', icon: 'truck', label: 'Sales Order', href: '/sales-order' },
    { id: 'invoice', icon: 'receipt', label: 'Invoice', href: '/invoice' },
    { id: 'faktur-pajak', icon: 'receipt', label: 'Faktur Pajak', href: '/faktur-pajak' },
    { id: 'catat-pembayaran', icon: 'receipt', label: 'Catat Pembayaran', href: '/catat-pembayaran' },
    { id: 'wa-order', icon: 'chat', label: 'WA Order', href: '/wa-order' },
    { id: 'reports', icon: 'chart', label: 'Laporan', href: '/reports' },
    { id: 'accounting', icon: 'grid', label: 'Akuntansi', href: '/accounting' },
    { id: 'business', icon: 'box', label: 'Bisnis', href: '/business' },
    { id: 'settings', icon: 'setting', label: 'Pengaturan', href: '/settings' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    logout?.()
    router.push('/login')
  }

  return (
    <aside
      style={{
        width: open ? 240 : 68,
        background: '#faf8f5',
        borderRight: '1px solid #ede8e0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 16,
          }}
        >
          🌴
        </div>
        {open && (
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 16,
                fontWeight: 700,
                color: '#2d2520',
                lineHeight: 1.2,
              }}
            >
              Gerbangku
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#9c9488',
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Business Suite
            </div>
          </div>
        )}
      </div>

      {/* Business Switcher */}
      {open && (
        <div style={{ padding: '8px 12px 16px' }}>
          <div
            onClick={() => setBizDropdown(!bizDropdown)}
            style={{
              background: '#fff',
              border: '1.5px solid #e5e0d8',
              borderRadius: 12,
              padding: '10px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ fontSize: 20, flexShrink: 0 }}>🏢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#2d2520',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.bizInfo?.name || 'Bisnis Ku'}
              </div>
              <div style={{ fontSize: 11, color: '#9c9488' }}>
                {user?.bizType || 'supplier'}
              </div>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9c9488"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(item.href)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.15s',
              color: isActive(item.href) ? '#2d2520' : '#6b6456',
              background: isActive(item.href) ? '#fff' : 'transparent',
              boxShadow: isActive(item.href) ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.href)) {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
              }
            }}
          >
            <Icon name={item.icon} size={18} />
            {open && <span>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div style={{ padding: '12px 12px 16px', borderTop: '1px solid #ede8e0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #40916c, #52b788)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          {open && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#2d2520',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: 10, color: '#9c9488' }}>Owner</div>
            </div>
          )}
        </div>

        {open && (
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fed7d7',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Icon name="logout" size={14} />
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}