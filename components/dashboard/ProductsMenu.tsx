// components/dashboard/ProductsMenu.tsx
'use client'

import { useState } from 'react'
import { productsList } from '@/lib/mockData'

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
  blue: '#2b6cb0',
  blueL: '#3182ce',
}

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

export default function ProductsMenu() {
  const [search, setSearch] = useState('')

  const filtered = productsList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  )

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
            Produk
          </div>
          <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
            {productsList.length} produk terdaftar
          </div>
        </div>
        <button
          style={{
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            background: COLOR.greenL,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          + Produk Baru
        </button>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search */}
        <div
          style={{
            background: COLOR.white,
            borderRadius: 12,
            border: `1px solid ${COLOR.border}`,
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLOR.grayL}
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 13,
              color: COLOR.dark,
              background: 'transparent',
            }}
          />
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                background: COLOR.white,
                borderRadius: 12,
                border: `1px solid ${COLOR.border}`,
                padding: 16,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: COLOR.blueL }}>
                  {p.sku}
                </div>
                {p.tax_rate > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: COLOR.blueXL,
                      color: COLOR.blueL,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    PPN {p.tax_rate}%
                  </span>
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.dark, marginBottom: 4 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 11, color: COLOR.grayL, marginBottom: 12 }}>
                {p.category} · {p.uom}
              </div>
              {p.description && (
                <div style={{ fontSize: 12, color: COLOR.gray, marginBottom: 12, lineHeight: 1.4 }}>
                  {p.description}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: `1px solid ${COLOR.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: COLOR.grayL }}>Harga Jual</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.greenL }}>
                    {rp(p.price)}
                  </div>
                </div>
                <button
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: `1px solid ${COLOR.border}`,
                    background: COLOR.white,
                    color: COLOR.gray,
                    cursor: 'pointer',
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
  )
}