// components/dashboard/InventoryMenu.tsx
'use client'

import { useState } from 'react'
import { inventoryProducts } from '@/lib/mockData'

const COLOR = {
  dark: '#1a202c',
  gray: '#4a5568',
  grayL: '#718096',
  grayXL: '#f7f8fa',
  border: '#e2e8f0',
  white: '#fff',
  green: '#276749',
  greenL: '#38a169',
  greenXL: '#f0fff4',
  red: '#c53030',
  redXL: '#fff5f5',
  yellow: '#d69e2e',
  yellowL: '#fffbeb',
  blue: '#2b6cb0',
  blueL: '#3182ce',
}

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

function Tag({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: '3px 9px',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

export default function InventoryMenu() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = inventoryProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLOR.grayXL }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 28px',
          background: COLOR.white,
          borderBottom: `1px solid ${COLOR.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.dark }}>
            Inventory & Stok
          </div>
          <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
            {inventoryProducts.length} produk terdaftar
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: `1px solid ${COLOR.border}`,
              background: COLOR.white,
              color: COLOR.gray,
              cursor: 'pointer',
            }}
          >
            📥 Export
          </button>
          <button
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              background: COLOR.greenL,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Produk', value: '6', icon: '📦', color: COLOR.blueL },
            { label: 'Stok Normal', value: '4', icon: '✅', color: COLOR.greenL },
            { label: 'Stok Rendah', value: '1', icon: '⚠️', color: COLOR.yellow },
            { label: 'Kritis', value: '1', icon: '🚨', color: COLOR.red },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: COLOR.white,
                borderRadius: 14,
                padding: 18,
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLOR.dark }}>
                {c.value}
              </div>
              <div style={{ fontSize: 12, color: COLOR.grayL }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div
          style={{
            background: COLOR.white,
            borderRadius: 16,
            border: `1px solid ${COLOR.border}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${COLOR.border}`,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <svg
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk atau SKU..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  border: `1.5px solid ${COLOR.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  background: COLOR.grayXL,
                  color: COLOR.dark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {['all', 'ok', 'low', 'critical'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1.5px solid ${filter === f ? COLOR.greenL : COLOR.border}`,
                  transition: 'all 0.15s',
                  background: filter === f ? COLOR.greenL : 'transparent',
                  color: filter === f ? '#fff' : COLOR.grayL,
                }}
              >
                {f === 'all'
                  ? 'Semua'
                  : f === 'ok'
                    ? 'Normal'
                    : f === 'low'
                      ? 'Rendah'
                      : 'Kritis'}
              </button>
            ))}
          </div>

          {/* Table */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 180px 120px 80px 100px',
                gap: 0,
                padding: '9px 12px',
                background: COLOR.grayXL,
                borderBottom: `1px solid ${COLOR.border}`,
              }}
            >
              {['SKU', 'Nama Produk', 'Kategori', 'Stok', 'Harga', 'Status', 'Aksi'].map((h) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: COLOR.grayL }}>
                  {h}
                </div>
              ))}
            </div>

            {filtered.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 120px 180px 120px 80px 100px',
                  gap: 0,
                  padding: '12px',
                  borderBottom: `1px solid ${COLOR.border}`,
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: COLOR.grayL }}>
                  {p.sku}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.dark }}>
                    {p.name}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: COLOR.gray }}>{p.category}</div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLOR.dark }}>
                      {p.stock} {p.uom}
                    </span>
                    <span style={{ fontSize: 11, color: COLOR.grayL }}>min: {p.min_stock}</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.dark }}>
                  {rp(p.price)}
                </div>
                <div>
                  <Tag
                    bg={
                      p.status === 'ok'
                        ? COLOR.greenXL
                        : p.status === 'low'
                          ? COLOR.yellowL
                          : COLOR.redXL
                    }
                    color={
                      p.status === 'ok'
                        ? COLOR.greenL
                        : p.status === 'low'
                          ? COLOR.yellow
                          : COLOR.red
                    }
                  >
                    {p.status === 'ok' ? 'Normal' : p.status === 'low' ? 'Rendah' : 'Kritis'}
                  </Tag>
                </div>
                <div>
                  <button
                    style={{
                      padding: '5px 10px',
                      border: `1.5px solid ${COLOR.border}`,
                      borderRadius: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      background: 'transparent',
                      color: COLOR.gray,
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}