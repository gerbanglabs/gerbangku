// components/dashboard/WAOrderMenu.tsx
'use client'

import { useState } from 'react'
import { waMessages } from '@/lib/mockData'

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
      }}
    >
      {children}
    </span>
  )
}

export default function WAOrderMenu() {
  const [selected, setSelected] = useState(waMessages[0])

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: COLOR.grayXL,
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 0,
        minHeight: '100vh',
      }}
    >
      {/* Chat List */}
      <div
        style={{
          background: COLOR.white,
          borderRight: `1px solid ${COLOR.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${COLOR.border}`,
          }}
        >
          <input
            placeholder="Cari percakapan..."
            style={{
              width: '100%',
              padding: '8px 12px',
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
        <div style={{ overflow: 'auto', flex: 1 }}>
          {waMessages.map((m, i) => (
            <div
              key={i}
              onClick={() => setSelected(m)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: selected?.phone === m.phone ? COLOR.grayXL : 'transparent',
                borderBottom: `1px solid ${COLOR.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'background 0.1s',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: m.status === 'active' ? COLOR.greenXL : COLOR.grayXL,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {m.name.includes('Unknown') ? '👤' : '🏪'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLOR.dark,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 160,
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: 10, color: COLOR.grayL }}>{m.time}</div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.grayL,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {m.msg}
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <Tag
                    bg={m.status === 'active' ? COLOR.greenXL : COLOR.grayXL}
                    color={m.status === 'active' ? COLOR.greenL : COLOR.grayL}
                  >
                    {m.status === 'active' ? '● aktif' : '✓ selesai'}
                  </Tag>
                  <Tag bg={COLOR.blueXL} color={COLOR.blueL}>
                    {m.flow}
                  </Tag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: COLOR.white,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${COLOR.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: COLOR.grayXL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🏪
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.dark }}>
              {selected?.name}
            </div>
            <div style={{ fontSize: 11, color: COLOR.grayL }}>
              {selected?.phone} · Flow: {selected?.flow}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              style={{
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 7,
                border: `1px solid ${COLOR.border}`,
                background: COLOR.white,
                color: COLOR.gray,
                cursor: 'pointer',
              }}
            >
              Lihat SO
            </button>
            <button
              style={{
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 7,
                border: 'none',
                background: '#25d366',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Balas WA
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: '#f9f8f5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 8,
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                background: '#f0f0f0',
                borderRadius: '0 12px 12px 12px',
                padding: '8px 12px',
                fontSize: 13,
              }}
            >
              {selected?.msg}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                background: '#dcf8c6',
                borderRadius: '12px 0 12px 12px',
                padding: '8px 12px',
                fontSize: 13,
              }}
            >
              Terima kasih pesanannya, akan kami proses 👍
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: `1px solid ${COLOR.border}`,
            display: 'flex',
            gap: 8,
          }}
        >
          <input
            placeholder="Ketik pesan..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `1px solid ${COLOR.border}`,
              borderRadius: 20,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 20,
              border: 'none',
              background: COLOR.blueL,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  )
}