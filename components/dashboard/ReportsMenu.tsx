// components/dashboard/ReportsMenu.tsx
'use client'

import { revenueData, arAgingData } from '@/lib/mockData'

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
  red: '#c53030',
  yellow: '#d69e2e',
}

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

export default function ReportsMenu() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLOR.grayXL }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 28px',
          background: COLOR.white,
          borderBottom: `1px solid ${COLOR.border}`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.dark }}>
          Laporan
        </div>
        <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
          Ringkasan keuangan bisnis kamu
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* L/R Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Pendapatan', value: 'Rp 68.4jt', sub: 'Maret 2026', color: COLOR.greenL },
            { label: 'HPP', value: 'Rp 48.2jt', sub: 'Cost of Goods', color: COLOR.red },
            { label: 'Laba Kotor', value: 'Rp 20.2jt', sub: 'Margin 29.5%', color: COLOR.blueL },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: COLOR.white,
                borderRadius: 16,
                padding: 24,
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: COLOR.grayL,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 8,
                }}
              >
                {c.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>
                {c.value}
              </div>
              <div style={{ fontSize: 12, color: COLOR.grayL, marginTop: 4 }}>
                {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div
          style={{
            background: COLOR.white,
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.dark, marginBottom: 20 }}>
            Revenue 2026 (juta Rp)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
            {revenueData.map((h, i) => (
              <div
                key={i}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              >
                <div style={{ fontSize: 11, color: COLOR.grayL }}>{h.amount}</div>
                <div
                  style={{
                    width: '100%',
                    height: (h.amount / 80) * 140,
                    background:
                      i === 2
                        ? `linear-gradient(180deg, ${COLOR.greenL}, ${COLOR.green})`
                        : `linear-gradient(180deg, #b7e4c7, #d8f3dc)`,
                    borderRadius: '6px 6px 2px 2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
                <div style={{ fontSize: 11, color: COLOR.grayL }}>{h.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AR Aging */}
        <div
          style={{
            background: COLOR.white,
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.dark, marginBottom: 16 }}>
            AR Aging — Piutang Belum Dibayar
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {arAgingData.map((a, i) => {
              const colors = [
                { bg: COLOR.greenXL, text: COLOR.greenL },
                { bg: '#fffbeb', text: COLOR.yellow },
                { bg: '#fed7aa', text: '#ea580c' },
                { bg: '#fff5f5', text: COLOR.red },
              ]
              const c = colors[i]
              return (
                <div key={i} style={{ background: c.bg, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: c.text }}>
                    {rp(a.amount)}
                  </div>
                  <div style={{ fontSize: 11, color: c.text, opacity: 0.8, marginTop: 2 }}>
                    {a.period}
                  </div>
                  <div style={{ fontSize: 11, color: c.text, opacity: 0.6, marginTop: 4 }}>
                    {a.count} invoice
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}