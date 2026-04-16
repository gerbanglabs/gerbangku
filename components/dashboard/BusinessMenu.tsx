// components/dashboard/BusinessMenu.tsx
'use client'

import { businessList } from '@/lib/mockData'

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

export default function BusinessMenu() {
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
            Bisnis
          </div>
          <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
            Kelola bisnis kamu di Gerbangku
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
          + Tambah Bisnis
        </button>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Business Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {businessList.map((b) => (
            <div
              key={b.id}
              style={{
                background: COLOR.white,
                borderRadius: 14,
                border: `1px solid ${COLOR.border}`,
                padding: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: COLOR.grayXL,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {b.emoji}
                </div>
                <button
                  style={{
                    padding: '4px 8px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: `1px solid ${COLOR.border}`,
                    background: COLOR.white,
                    color: COLOR.gray,
                    cursor: 'pointer',
                  }}
                >
                  ⋮
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.dark, marginBottom: 2 }}>
                {b.name}
              </div>
              <div style={{ fontSize: 11, color: COLOR.grayL, marginBottom: 12 }}>
                {b.type} · {b.area}
              </div>
              <div
                style={{
                  borderTop: `1px solid ${COLOR.border}`,
                  paddingTop: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {[
                  ['Alamat', b.address],
                  ['Telepon', b.phone],
                  ['Email', b.email || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: COLOR.grayL }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLOR.dark }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '8px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 7,
                  border: `1px solid ${COLOR.border}`,
                  background: COLOR.white,
                  color: COLOR.blueL,
                  cursor: 'pointer',
                }}
              >
                Kelola →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}