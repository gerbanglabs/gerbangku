// components/dashboard/SettingsMenu.tsx
'use client'

import { useState } from 'react'

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

interface SettingsState {
  company_name: string
  legal_name: string
  email: string
  phone: string
  notifications_email: boolean
  notifications_sms: boolean
  timezone: string
  date_format: string
}

export default function SettingsMenu() {
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'notifications' | 'security'>(
    'profile',
  )
  const [settings, setSettings] = useState<SettingsState>({
    company_name: 'UD Sari Daging Bali',
    legal_name: 'UD SARI DAGING BALI',
    email: 'info@udsamridagingbali.com',
    phone: '0361-234567',
    notifications_email: true,
    notifications_sms: true,
    timezone: 'Asia/Jakarta',
    date_format: 'DD/MM/YYYY',
  })

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
          Pengaturan
        </div>
        <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 2 }}>
          Atur preferensi dan konfigurasi bisnis kamu
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', gap: 20 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {[
            { id: 'profile', label: 'Profil Pengguna', icon: '👤' },
            { id: 'business', label: 'Profil Bisnis', icon: '🏢' },
            { id: 'notifications', label: 'Notifikasi', icon: '🔔' },
            { id: 'security', label: 'Keamanan', icon: '🔒' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderRadius: 8,
                border: 'none',
                background:
                  activeTab === tab.id ? COLOR.greenXL : 'transparent',
                color: activeTab === tab.id ? COLOR.greenL : COLOR.gray,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, maxWidth: 600 }}>
          {activeTab === 'profile' && (
            <div
              style={{
                background: COLOR.white,
                borderRadius: 14,
                border: `1px solid ${COLOR.border}`,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLOR.gray,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value="Made Budi"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLOR.gray,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLOR.gray,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                style={{
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: 'none',
                  background: COLOR.greenL,
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: 8,
                }}
              >
                Simpan Perubahan
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div
              style={{
                background: COLOR.white,
                borderRadius: 14,
                border: `1px solid ${COLOR.border}`,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {[
                { label: 'Notifikasi Email', key: 'notifications_email' },
                { label: 'Notifikasi SMS', key: 'notifications_sms' },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 12,
                    borderBottom: `1px solid ${COLOR.border}`,
                  }}
                >
                  <label style={{ fontSize: 13, color: COLOR.dark, fontWeight: 500 }}>
                    {item.label}
                  </label>
                  <div
                    onClick={() =>
                      setSettings({
                        ...settings,
                        [item.key]: !(settings as any)[item.key],
                      })
                    }
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: (settings as any)[item.key]
                        ? COLOR.greenL
                        : COLOR.border,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: COLOR.white,
                        position: 'absolute',
                        top: 2,
                        left: (settings as any)[item.key] ? 22 : 2,
                        transition: 'left 0.2s',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}