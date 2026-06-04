'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Users, ShoppingCart, Truck,
  FileText, BarChart2, MessageSquare, Settings, LogOut,
  ChevronDown, Building2, Plus, Layers, ShoppingBag, Radio, Warehouse
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Divider' },
  { label: 'Produk', icon: Package, href: '/dashboard/products' },
  { label: 'Pelanggan', icon: Users, href: '/dashboard/customers' },
  { label: 'Supplier', icon: Warehouse, href: '/dashboard/suppliers' },
  { label: 'Divider' },
  { label: 'Sales Order', icon: ShoppingCart, href: '/dashboard/sales-orders' },
  { label: 'Purchase Order', icon: ShoppingBag, href: '/dashboard/purchase-orders' },
  { label: 'Surat Jalan', icon: Truck, href: '/dashboard/delivery-orders' },
  { label: 'Invoice', icon: FileText, href: '/dashboard/invoices' },
  { label: 'Divider' },
  { label: 'WhatsApp', icon: MessageSquare, href: '/dashboard/whatsapp' },
  { label: 'Broadcast WA', icon: Radio, href: '/dashboard/whatsapp/broadcast' },
  { label: 'Laporan', icon: BarChart2, href: '/dashboard/reports' },
  { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, businesses, activeBusiness, setActiveBusiness, logout } = useAuth()
  const [bizOpen, setBizOpen] = useState(false)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏪</div>
          <div>
            <div style={{ color: '#F3F4F6', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Gerbangku</div>
            <div style={{ color: '#6B7280', fontSize: 11 }}>UMKM Bali</div>
          </div>
        </div>

        {/* Business Switcher */}
        <button onClick={() => setBizOpen(!bizOpen)} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#E5E7EB' }}>
          <Building2 size={14} style={{ color: '#E8640C', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeBusiness?.name || 'Pilih Bisnis'}
          </span>
          <ChevronDown size={13} style={{ color: '#6B7280', transition: 'transform 0.2s', transform: bizOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
        </button>

        {bizOpen && (
          <div style={{ marginTop: 4, background: '#0F1020', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {businesses.map(b => (
              <button key={b.id} onClick={() => { setActiveBusiness(b); setBizOpen(false) }} style={{ width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', textAlign: 'left', background: activeBusiness?.id === b.id ? 'rgba(232,100,12,0.15)' : 'transparent', color: activeBusiness?.id === b.id ? '#E8640C' : '#9CA3AF', fontSize: 13 }}>
                <Layers size={12} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
              </button>
            ))}
            <Link href="/onboarding" onClick={() => setBizOpen(false)} style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13, textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Plus size={12} /> Tambah Bisnis
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV.map((item, i) => {
          if (item.label === 'Divider') return (
            <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '6px 16px' }} />
          )
          const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href!)
          const Icon = item.icon!
          return (
            <Link key={item.href} href={item.href!} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon size={15} /><span style={{ fontSize: 13 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8640C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#E5E7EB', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name}</div>
            <div style={{ color: '#4B5563', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link" style={{ width: '100%', color: '#EF4444' }}>
          <LogOut size={14} /><span style={{ fontSize: 13 }}>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
