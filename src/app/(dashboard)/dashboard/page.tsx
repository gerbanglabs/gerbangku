'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, FileText, MessageSquare, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { businessAPI, formatRupiah, type DashboardStats } from '@/lib/api'

export default function DashboardPage() {
  const { activeBusiness } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!activeBusiness) return
    setLoading(true)
    businessAPI.getDashboard(activeBusiness.id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeBusiness])

  const statCards = [
    {
      label: 'Pendapatan Bulan Ini',
      value: formatRupiah(stats?.revenue_this_month || 0),
      icon: TrendingUp,
      color: '#10B981',
      bg: '#D1FAE5',
      trend: '+12% dari bulan lalu',
    },
    {
      label: 'Total Order',
      value: (stats?.total_orders || 0).toString(),
      icon: ShoppingCart,
      color: '#3B82F6',
      bg: '#DBEAFE',
      sub: `${stats?.pending_orders || 0} pending`,
    },
    {
      label: 'Pelanggan',
      value: (stats?.total_customers || 0).toString(),
      icon: Users,
      color: '#8B5CF6',
      bg: '#EDE9FE',
    },
    {
      label: 'Produk Aktif',
      value: (stats?.total_products || 0).toString(),
      icon: Package,
      color: '#E8640C',
      bg: '#FFEDD5',
      sub: stats?.low_stock_count ? `⚠️ ${stats.low_stock_count} stok menipis` : undefined,
    },
    {
      label: 'Piutang Belum Lunas',
      value: formatRupiah(stats?.unpaid_invoices || 0),
      icon: FileText,
      color: '#EF4444',
      bg: '#FEE2E2',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          Selamat datang 👋
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          {activeBusiness
            ? `Dashboard untuk ${activeBusiness.name}`
            : 'Pilih bisnis dari sidebar untuk memulai'}
        </p>
      </div>

      {!activeBusiness ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
          <h3 style={{ color: '#111827', fontWeight: 600, marginBottom: 8 }}>Belum ada bisnis</h3>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Buat bisnis baru untuk mulai menggunakan Gerbangku</p>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="stat-card" style={{ height: 110 }}>
              <div style={{ background: '#F3F4F6', borderRadius: 6, height: 16, width: '60%', marginBottom: 8 }} />
              <div style={{ background: '#F3F4F6', borderRadius: 6, height: 28, width: '40%' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16, marginBottom: 28
          }}>
            {statCards.map((card, i) => {
              const Icon = card.icon
              return (
                <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: card.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={20} color={card.color} />
                    </div>
                    <ArrowUpRight size={14} color="#9CA3AF" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{card.label}</div>
                  {card.sub && (
                    <div style={{ fontSize: 12, color: card.color, marginTop: 4, fontWeight: 500 }}>
                      {card.sub}
                    </div>
                  )}
                  {card.trend && (
                    <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: 500 }}>
                      {card.trend}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#111827' }}>
                Aksi Cepat
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Buat Sales Order', href: '/dashboard/sales-orders/new', icon: '📋', color: '#DBEAFE' },
                  { label: 'Tambah Produk', href: '/dashboard/products/new', icon: '📦', color: '#FFEDD5' },
                  { label: 'Buat Invoice', href: '/dashboard/invoices/new', icon: '🧾', color: '#D1FAE5' },
                  { label: 'Monitor WhatsApp', href: '/dashboard/whatsapp', icon: '💬', color: '#EDE9FE' },
                ].map((action, i) => (
                  <a
                    key={i}
                    href={action.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 8,
                      background: action.color,
                      textDecoration: 'none', color: '#111827',
                      fontSize: 14, fontWeight: 500,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span>{action.icon}</span>
                    {action.label}
                    <ArrowUpRight size={13} style={{ marginLeft: 'auto', color: '#6B7280' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Business Info */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#111827' }}>
                Info Bisnis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Nama', value: activeBusiness.name },
                  { label: 'Tipe', value: activeBusiness.business_type },
                  { label: 'Kota', value: activeBusiness.city || '-' },
                  { label: 'Paket', value: activeBusiness.plan?.toUpperCase() || 'STARTER' },
                  { label: 'Storefront', value: activeBusiness.enable_public_storefront ? '✅ Aktif' : '❌ Nonaktif' },
                ].map((info, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: 13 }}>{info.label}</span>
                    <span style={{ color: '#111827', fontSize: 13, fontWeight: 500 }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
