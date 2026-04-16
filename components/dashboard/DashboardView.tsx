// components/dashboard/DashboardView.tsx
'use client'

import Icon from '@/components/ui/Icon'
import { formatRp } from '@/utils/formatters'
import { statsData, soData } from '@/lib/mockData'
import type { Stat, SalesOrder } from '@/types'

interface DashboardViewProps {
  userName?: string
  bizType?: string
}

export default function DashboardView({ userName = 'Made', bizType = 'supplier' }: DashboardViewProps) {
  const stats: Stat[] = statsData[bizType as keyof typeof statsData] || statsData.supplier
  const chartBars = [62, 75, 55, 88, 70, 94, 68, 82, 79, 91, 85, 73, 96, 88]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Section */}
      <div
        style={{
          background: `linear-gradient(135deg, #2d6a4f 0%, #40916c 60%, #52b788 100%)`,
          borderRadius: 20,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          position: 'relative',
          color: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>Selamat pagi, {userName}! ☀️</div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.75)',
              marginBottom: 16,
            }}
          >
            🏢 Bisnis Anda · Bali · {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '8px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>12</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                Order Hari Ini
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '8px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                Rp 68,4jt
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                Revenue Bulan Ini
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 10,
                padding: '8px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fef3c7' }}>
                3 ⚠️
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                Stok Hampir Habis
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 80, opacity: 0.15, position: 'relative' }}>
          🌴
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {stats.map((s: Stat, i: number) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '20px',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    i === 0
                      ? '#dcfce7'
                      : i === 1
                        ? '#dbeafe'
                        : i === 2
                          ? '#fef3c7'
                          : '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color:
                    i === 0
                      ? '#16a34a'
                      : i === 1
                        ? '#2563eb'
                        : i === 2
                          ? '#d97706'
                          : '#dc2626',
                }}
              >
                <Icon name={s.icon} size={18} />
              </div>
              {s.change !== 'sama' && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background:
                      s.up === null
                        ? '#f5f4f0'
                        : s.up
                          ? '#dcfce7'
                          : '#fee2e2',
                    color:
                      s.up === null
                        ? '#9c9488'
                        : s.up
                          ? '#16a34a'
                          : '#dc2626',
                  }}
                >
                  {s.up === null ? s.change : s.up ? '↑ ' + s.change : '↓ ' + s.change}
                </span>
              )}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2d2520', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#9c9488', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent Orders */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 20,
        }}
      >
        {/* Revenue Chart */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#2d2520' }}>
                Revenue 14 Hari Terakhir
              </div>
              <div style={{ fontSize: 12, color: '#9c9488' }}>
                Total: Rp 68.4 juta
              </div>
            </div>
            <button
              style={{
                padding: '8px 14px',
                background: 'transparent',
                color: '#6b6456',
                border: '1.5px solid #e5e0d8',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Lihat Laporan
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
            {chartBars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: h,
                    background:
                      i === chartBars.length - 1
                        ? 'linear-gradient(180deg, #40916c, #2d6a4f)'
                        : 'linear-gradient(180deg, #b7e4c7, #d8f3dc)',
                    borderRadius: '4px 4px 2px 2px',
                    transition: 'all 0.3s',
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 10, color: '#c4bfb8' }}>9 Mar</span>
            <span style={{ fontSize: 10, color: '#c4bfb8' }}>15 Mar</span>
            <span style={{ fontSize: 10, color: '#c4bfb8' }}>22 Mar</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2d2520' }}>
              Order Terbaru
            </div>
            <span
              style={{
                fontSize: 12,
                color: '#40916c',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Lihat semua →
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* {soData.slice(0, 4).map((so: SalesOrder) => (
              <div
                key={so.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#f5f4f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  🏪
                </div>
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
                    {so.customer}
                  </div>
                  <div style={{ fontSize: 11, color: '#9c9488' }}>
                    {so.id} · {so.date}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#2d2520' }}>
                    Rp {(so.total / 1000000).toFixed(1)}jt
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      background: so.payment === 'paid' ? '#dcfce7' : so.payment === 'unpaid' ? '#fee2e2' : '#fef3c7',
                      color: so.payment === 'paid' ? '#16a34a' : so.payment === 'unpaid' ? '#dc2626' : '#d97706',
                    }}
                  >
                    {so.payment === 'paid' ? 'Lunas' : so.payment === 'unpaid' ? 'Belum Bayar' : 'Sebagian'}
                  </span>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div
        style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
            3 produk stok hampir habis
          </div>
          <div style={{ fontSize: 12, color: '#b45309' }}>
            Ayam Broiler, Daging Bebek, dan 1 lainnya perlu segera di-reorder
          </div>
        </div>
        <button
          style={{
            padding: '9px 20px',
            background: '#d97706',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Cek Inventory →
        </button>
      </div>
    </div>
  )
}