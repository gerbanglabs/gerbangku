// components/dashboard/AccountingMenu.tsx
'use client'

import { chartOfAccounts } from '@/lib/mockData'

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
  blueXL: '#ebf8ff',      // ← ADD THIS
  red: '#c53030',
  redXL: '#fff5f5',       // ← ADD THIS
  yellow: '#d69e2e',
  yellowL: '#fffbeb',
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
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'capitalize',
      }}
    >
      {children}
    </span>
  )
}

export default function AccountingMenu() {
  const assets = chartOfAccounts.filter((a) => a.type === 'asset')
  const liabilities = chartOfAccounts.filter((a) => a.type === 'liability')
  const equity = chartOfAccounts.filter((a) => a.type === 'equity')
  const income = chartOfAccounts.filter((a) => a.type === 'income')
  const expenses = chartOfAccounts.filter((a) => a.type === 'expense')

  const typeColors: Record<string, { bg: string; color: string }> = {
    asset: { bg: COLOR.blueXL, color: COLOR.blueL },
    liability: { bg: COLOR.greenXL, color: COLOR.greenL },
    equity: { bg: '#f0fff4', color: COLOR.green },
    income: { bg: COLOR.greenXL, color: COLOR.greenL },
    expense: { bg: COLOR.redXL, color: COLOR.red },
  }

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
            Akuntansi
          </div>
          <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
            Daftar Akun & Jurnal Transaksi
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
          + Jurnal Manual
        </button>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Balance Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { label: 'Total Asset', value: 'Rp 240jt', color: COLOR.blueL },
            { label: 'Total Liability', value: 'Rp 10.6jt', color: COLOR.greenL },
            { label: 'Total Equity', value: 'Rp 200jt', color: COLOR.green },
            { label: 'Total Income', value: 'Rp 68.4jt', color: COLOR.greenL },
            { label: 'Total Expense', value: 'Rp 53.2jt', color: COLOR.red },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: COLOR.white,
                borderRadius: 12,
                padding: 14,
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div style={{ fontSize: 11, color: COLOR.grayL, marginBottom: 6 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart of Accounts */}
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
              background: COLOR.grayXL,
              borderBottom: `1px solid ${COLOR.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.dark }}>
              Daftar Akun (Chart of Accounts)
            </div>
          </div>

          <div>
            {[
              { title: 'Aset (Assets)', accounts: assets },
              { title: 'Kewajiban (Liabilities)', accounts: liabilities },
              { title: 'Ekuitas (Equity)', accounts: equity },
              { title: 'Pendapatan (Income)', accounts: income },
              { title: 'Biaya (Expenses)', accounts: expenses },
            ].map((section, si) => (
              <div key={si}>
                <div
                  style={{
                    padding: '12px 20px',
                    background: COLOR.grayXL,
                    borderBottom: `1px solid ${COLOR.border}`,
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLOR.dark,
                  }}
                >
                  {section.title}
                </div>
                {section.accounts.map((acc) => {
                  const c = typeColors[acc.type]
                  return (
                    <div
                      key={acc.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr 150px 150px',
                        gap: 20,
                        padding: '12px 20px',
                        borderBottom: `1px solid ${COLOR.border}`,
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, fontFamily: 'monospace', color: COLOR.grayL }}>
                        {acc.code}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.dark }}>
                        {acc.name}
                      </div>
                      <Tag bg={c.bg} color={c.color}>
                        {acc.type}
                      </Tag>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLOR.dark,
                          textAlign: 'right',
                        }}
                      >
                        {rp(acc.balance)}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}