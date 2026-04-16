// components/dashboard/FakturPajakForm.tsx
'use client'

import { useState } from 'react'
import type {
  FakturPajakFormData,
  FakturPajakBuyer,
  FakturPajakItem,
  FakturPajakInvoice,
} from '@/types'
import {
  customers,
  businessSeller,
  fakturPajakInvoices,
  fakturPajakItems,
  kodeTransaksi,
} from '@/lib/mockData'

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const today = new Date().toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
const todayISO = new Date().toISOString().split('T')[0]
const fmtD = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '-'

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
  blueXL: '#ebf8ff',
  red: '#c53030',
  yellow: '#d69e2e',
  yellowL: '#fffbeb',
  purple: '#553c9a',
  purpleL: '#faf5ff',
}

const SI = {
  fontSize: 12,
  fontWeight: 600,
  color: COLOR.gray,
  display: 'block' as const,
  marginBottom: 5,
}

const II = {
  padding: '9px 11px',
  border: `1px solid ${COLOR.border}`,
  borderRadius: 7,
  fontSize: 13,
  width: '100%',
  color: COLOR.dark,
  background: COLOR.white,
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
}

function Lbl({ children, req, hint }: { children: React.ReactNode; req?: boolean; hint?: string }) {
  return (
    <div>
      <label style={SI}>
        {children}
        {req && <span style={{ color: COLOR.red }}> *</span>}
      </label>
      {hint && <div style={{ fontSize: 11, color: COLOR.grayL, marginBottom: 4 }}>{hint}</div>}
    </div>
  )
}

function Tag({
  color,
  bg,
  children,
}: {
  color: string
  bg: string
  children: React.ReactNode
}) {
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: '2px 9px',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <div
      style={{
        background: COLOR.white,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CHead({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  right?: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: '13px 18px',
        borderBottom: `1px solid ${COLOR.border}`,
        background: COLOR.grayXL,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.dark }}>
          {title}
        </div>
        {sub && <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  )
}

// ============ FormStep ============

function FormStep({ onPreview }: { onPreview: (data: FakturPajakFormData) => void }) {
  const [invId, setInvId] = useState('inv1')
  const [fpDate, setFpDate] = useState(todayISO)
  const [kode, setKode] = useState('01')
  const [buyerType, setBuyerType] = useState<'pkp' | 'nonpkp' | 'nik'>('pkp')
  const [overrideBuyer, setOvB] = useState(false)
  const [buyerNPWP, setBNPWP] = useState('')
  const [buyerNIK, setBNIK] = useState('')
  const [buyerName, setBName] = useState('')
  const [buyerAddr, setBAdr] = useState('')
  const [notes, setNotes] = useState('')

  const inv = fakturPajakInvoices.find((i) => i.id === invId)
  const cust = inv ? customers.find((c) => c.id === inv.customer_id) : null

  const changeInv = (id: string) => {
    setInvId(id)
    setOvB(false)
    const invoice = fakturPajakInvoices.find((i) => i.id === id)
    if (invoice) {
      const customer = customers.find((c) => c.id === invoice.customer_id)
      if (customer) {
        setBuyerType(customer.is_pkp ? 'pkp' : 'nonpkp')
        setBNPWP(customer.npwp || '')
        setBNIK('')
        setBName(customer.name)
        setBAdr(customer.address)
      }
    }
  }

  // Init buyer on component mount
  useState(() => {
    if (cust) {
      setBuyerType(cust.is_pkp ? 'pkp' : 'nonpkp')
      setBNPWP(cust.npwp || '')
      setBNIK('')
      setBName(cust.name)
      setBAdr(cust.address)
    }
  })

  const items = (fakturPajakItems[invId] || []) as FakturPajakItem[]
  const ppnItems = items.filter((i) => i.ppn_pct > 0)
  const dpp = ppnItems.reduce((s, i) => s + i.qty * i.harga * (1 - i.disc_pct / 100), 0)
  const ppn = dpp * 0.11
  const taxableItems = ppnItems.length

  const fpSerial = '010.000-26.00000042'
  const isValid =
    invId &&
    (buyerType === 'pkp'
      ? buyerNPWP.length >= 15
      : buyerType === 'nik'
        ? buyerNIK.length === 16
        : true)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLOR.grayXL }}>
      {/* topbar */}
      <div
        style={{
          background: COLOR.white,
          borderBottom: `1px solid ${COLOR.border}`,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.dark }}>
            Buat Faktur Pajak
          </div>
          <div style={{ fontSize: 12, color: COLOR.grayL, marginTop: 2 }}>
            No. otomatis:{' '}
            <span style={{ fontFamily: 'monospace', color: COLOR.purple, fontWeight: 700 }}>
              {fpSerial}
            </span>
            {' · '}PPN 11%
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tag bg={COLOR.greenXL} color={COLOR.green}>
            PKP Aktif
          </Tag>
          <button
            onClick={() =>
              isValid &&
              onPreview({
                inv: inv || null,
                fpDate,
                kode,
                fpSerial,
                buyer: {
                  type: buyerType,
                  npwp: buyerNPWP,
                  nik: buyerNIK,
                  name: buyerName,
                  addr: buyerAddr,
                },
                items,
                dpp,
                ppn,
                notes,
              })
            }
            disabled={!isValid}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              background: isValid ? COLOR.purple : '#c3bce8',
              color: '#fff',
              cursor: isValid ? 'pointer' : 'default',
            }}
          >
            Preview Faktur →
          </button>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* BARIS 1: Info FP + Penjual */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Info FP */}
          <Card>
            <CHead title="Info Faktur Pajak" sub="Nomor seri & tanggal penerbitan" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <Lbl>Nomor Seri Faktur Pajak</Lbl>
                <div
                  style={{
                    ...II,
                    background: COLOR.grayXL,
                    color: COLOR.purple,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '0.3px',
                  }}
                >
                  {fpSerial}
                </div>
                <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 3 }}>
                  Digenerate otomatis sesuai format DJP: KODE.STATUS-TAHUN.SERI
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <Lbl req>Tanggal Faktur Pajak</Lbl>
                  <input
                    type="date"
                    value={fpDate}
                    onChange={(e) => setFpDate(e.target.value)}
                    style={II}
                  />
                  <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 3 }}>
                    Harus ≤ tgl invoice
                  </div>
                </div>
                <div>
                  <Lbl req>Kode Transaksi</Lbl>
                  <select value={kode} onChange={(e) => setKode(e.target.value)} style={II}>
                    {kodeTransaksi.map((k) => (
                      <option key={k.kode} value={k.kode}>
                        {k.kode} – {k.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Lbl req>Referensi Invoice</Lbl>
                <select
                  value={invId}
                  onChange={(e) => changeInv(e.target.value)}
                  style={II}
                >
                  {fakturPajakInvoices.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.number} · {fmtD(i.date)} · {rp(i.ppn)}
                    </option>
                  ))}
                </select>
                {inv && (
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      ['Tgl Invoice', fmtD(inv.date)],
                      ['DPP', rp(dpp)],
                      ['PPN 11%', rp(ppn)],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          background: COLOR.grayXL,
                          borderRadius: 7,
                          padding: '7px 10px',
                        }}
                      >
                        <div style={{ fontSize: 10, color: COLOR.grayL, marginBottom: 2 }}>
                          {l}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.dark }}>
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Penjual (PKP) */}
          <Card>
            <CHead title="Identitas Penjual (PKP)" sub="Data bisnis kamu sebagai penerbit faktur" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  padding: '12px 14px',
                  background: COLOR.greenXL,
                  border: `1px solid #9ae6b4`,
                  borderRadius: 9,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLOR.grayL,
                    marginBottom: 4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  Nama PKP Penjual
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.dark }}>
                  {businessSeller.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.gray,
                    marginTop: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {businessSeller.addr}
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: COLOR.grayL }}>NPWP</div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLOR.dark,
                        fontFamily: 'monospace',
                      }}
                    >
                      {businessSeller.npwp}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: COLOR.grayL }}>Dikukuhkan</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.dark }}>
                      {fmtD(businessSeller.pkp_date)}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  background: COLOR.blueXL,
                  border: `1px solid #bee3f8`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#2c5282',
                }}
              >
                <span style={{ fontWeight: 700 }}>ℹ Info:</span> Data penjual diambil dari profil
                bisnis kamu. Untuk mengubah,{' '}
                <span style={{ color: COLOR.blueL, cursor: 'pointer', fontWeight: 600 }}>
                  buka Pengaturan → Profil Bisnis
                </span>
                .
              </div>
            </div>
          </Card>
        </div>

        {/* BARIS 2: Pembeli */}
        <Card>
          <CHead
            title="Identitas Pembeli"
            sub="Data penerima faktur pajak"
            right={
              <label
                style={{
                  display: 'flex',
                  gap: 7,
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: COLOR.gray,
                }}
              >
                <input
                  type="checkbox"
                  checked={overrideBuyer}
                  onChange={(e) => {
                    setOvB(e.target.checked)
                    if (!e.target.checked && cust) {
                      setBNPWP(cust.npwp || '')
                      setBNIK('')
                      setBName(cust.name)
                      setBAdr(cust.address)
                    }
                  }}
                />
                Edit manual
              </label>
            }
          />
          <div style={{ padding: 16 }}>
            {/* Tipe pembeli */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                ['pkp', 'PKP (punya NPWP)'],
                ['nonpkp', 'Non-PKP (pakai NPWP 000)'],
                ['nik', 'Perorangan (pakai NIK)'],
              ].map(([t, l]) => (
                <div
                  key={t}
                  onClick={() => {
                    setBuyerType(t as 'pkp' | 'nonpkp' | 'nik')
                    if (!overrideBuyer && cust) {
                      if (t === 'pkp') {
                        setBNPWP(cust.npwp || '')
                      } else if (t === 'nik') {
                        setBNIK('')
                      }
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    border: `1.5px solid ${buyerType === t ? COLOR.blueL : COLOR.border}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: buyerType === t ? COLOR.blueXL : COLOR.white,
                    fontSize: 12,
                    fontWeight: buyerType === t ? 700 : 400,
                    color: buyerType === t ? COLOR.blue : COLOR.gray,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {buyerType === 'pkp' && (
                  <div>
                    <Lbl req hint="Format: 00.000.000.0-000.000">
                      NPWP Pembeli
                    </Lbl>
                    <input
                      value={buyerNPWP}
                      onChange={(e) => setBNPWP(e.target.value)}
                      disabled={!overrideBuyer}
                      placeholder="00.000.000.0-000.000"
                      style={{
                        ...II,
                        background: !overrideBuyer ? COLOR.grayXL : COLOR.white,
                        fontFamily: 'monospace',
                      }}
                    />
                    {buyerNPWP && buyerNPWP.length < 15 && (
                      <div style={{ fontSize: 11, color: COLOR.red, marginTop: 3 }}>
                        NPWP harus 15 digit (tanpa tanda)
                      </div>
                    )}
                  </div>
                )}

                {buyerType === 'nonpkp' && (
                  <div>
                    <Lbl>NPWP Pembeli</Lbl>
                    <input
                      value="000000000000000"
                      disabled
                      style={{
                        ...II,
                        background: COLOR.grayXL,
                        fontFamily: 'monospace',
                        color: COLOR.grayL,
                      }}
                    />
                    <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 3 }}>
                      Non-PKP menggunakan NPWP 000
                    </div>
                  </div>
                )}

                {buyerType === 'nik' && (
                  <div>
                    <Lbl req hint="16 digit NIK dari KTP">
                      NIK Pembeli
                    </Lbl>
                    <input
                      value={buyerNIK}
                      onChange={(e) => setBNIK(e.target.value)}
                      disabled={!overrideBuyer}
                      placeholder="0000000000000000"
                      style={{
                        ...II,
                        background: !overrideBuyer ? COLOR.grayXL : COLOR.white,
                        fontFamily: 'monospace',
                      }}
                    />
                    {buyerNIK && buyerNIK.length !== 16 && (
                      <div style={{ fontSize: 11, color: COLOR.red, marginTop: 3 }}>
                        NIK harus tepat 16 digit
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Lbl req>Nama Pembeli</Lbl>
                  <input
                    value={buyerName}
                    onChange={(e) => setBName(e.target.value.toUpperCase())}
                    disabled={!overrideBuyer}
                    placeholder="NAMA PEMBELI (HURUF KAPITAL)"
                    style={{
                      ...II,
                      background: !overrideBuyer ? COLOR.grayXL : COLOR.white,
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
              </div>

              <div>
                <Lbl req>Alamat Pembeli</Lbl>
                <textarea
                  value={buyerAddr}
                  onChange={(e) => setBAdr(e.target.value.toUpperCase())}
                  disabled={!overrideBuyer}
                  rows={4}
                  placeholder="ALAMAT LENGKAP (HURUF KAPITAL)"
                  style={{
                    ...II,
                    background: !overrideBuyer ? COLOR.grayXL : COLOR.white,
                    resize: 'vertical',
                    textTransform: 'uppercase',
                  }}
                />
                <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 3 }}>
                  Gunakan huruf kapital sesuai format DJP
                </div>
              </div>
            </div>

            {!overrideBuyer && cust && (
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  background: COLOR.grayXL,
                  borderRadius: 7,
                  fontSize: 12,
                  color: COLOR.grayL,
                }}
              >
                Data diambil dari master customer. Centang "Edit manual" untuk mengubah.
              </div>
            )}
          </div>
        </Card>

        {/* BARIS 3: Detail Barang Kena Pajak */}
        <Card>
          <CHead
            title="Detail Barang / Jasa Kena Pajak"
            sub="Hanya item dengan PPN yang masuk ke faktur pajak"
          />
          <div style={{ padding: 0 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '24px 1fr 60px 60px 110px 70px 100px 100px 110px',
                gap: 6,
                padding: '8px 16px',
                background: COLOR.grayXL,
                borderBottom: `1px solid ${COLOR.border}`,
              }}
            >
              {[
                'No',
                'Nama BKP / JKP',
                'Qty',
                'Sat.',
                'Harga Satuan',
                'Disc %',
                'Harga Jual',
                'DPP',
                'PPN 11%',
              ].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLOR.grayL,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {items.map((item, i) => {
              const hj = item.qty * item.harga
              const disc = (hj * item.disc_pct) / 100
              const dppRow = hj - disc
              const ppnRow = item.ppn_pct > 0 ? dppRow * 0.11 : 0
              const isBKP = item.ppn_pct > 0
              return (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '24px 1fr 60px 60px 110px 70px 100px 100px 110px',
                    gap: 6,
                    padding: '11px 16px',
                    borderBottom: `1px solid #f0f4f8`,
                    alignItems: 'center',
                    background: isBKP ? COLOR.white : COLOR.grayXL,
                    opacity: isBKP ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize: 12, color: COLOR.grayL, textAlign: 'center' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.dark }}>
                      {item.name}
                    </div>
                    {!isBKP && <div style={{ fontSize: 10, color: COLOR.grayL }}>Tidak kena PPN</div>}
                    {isBKP && (
                      <Tag bg={COLOR.blueXL} color={COLOR.blue}>
                        BKP
                      </Tag>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: COLOR.gray }}>{item.qty}</div>
                  <div style={{ fontSize: 13, color: COLOR.gray }}>{item.uom}</div>
                  <div style={{ fontSize: 12, color: COLOR.gray, textAlign: 'right' }}>
                    {rp(item.harga)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: item.disc_pct > 0 ? COLOR.yellow : COLOR.grayL,
                      textAlign: 'center',
                    }}
                  >
                    {item.disc_pct > 0 ? item.disc_pct + '%' : '—'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.dark, textAlign: 'right' }}>
                    {rp(hj - disc)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: isBKP ? 700 : 400,
                      color: isBKP ? COLOR.dark : COLOR.grayL,
                      textAlign: 'right',
                    }}
                  >
                    {isBKP ? rp(dppRow) : '—'}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: isBKP ? 700 : 400,
                      color: isBKP ? COLOR.purple : COLOR.grayL,
                      textAlign: 'right',
                    }}
                  >
                    {isBKP ? rp(ppnRow) : '—'}
                  </div>
                </div>
              )
            })}

            {/* total */}
            <div
              style={{
                padding: '12px 16px',
                background: COLOR.purpleL,
                borderTop: `1px solid ${COLOR.border}`,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ width: 360 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: COLOR.gray,
                    marginBottom: 6,
                  }}
                >
                  <span>Jumlah item BKP</span>
                  <span style={{ fontWeight: 600, color: COLOR.dark }}>
                    {taxableItems} item
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: COLOR.gray,
                    marginBottom: 6,
                  }}
                >
                  <span>Total DPP</span>
                  <span style={{ fontWeight: 700, color: COLOR.dark }}>{rp(dpp)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 15,
                    fontWeight: 700,
                    paddingTop: 8,
                    borderTop: `1px solid ${COLOR.border}`,
                  }}
                >
                  <span style={{ color: COLOR.dark }}>PPN 11%</span>
                  <span style={{ color: COLOR.purple }}>{rp(ppn)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Catatan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
          <Card style={{ padding: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLOR.dark,
                marginBottom: 12,
              }}
            >
              Catatan (Opsional)
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Catatan tambahan untuk faktur pajak ini…"
              style={{ ...II, resize: 'vertical' }}
            />
          </Card>

          {/* summary box */}
          <Card style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLOR.dark,
                paddingBottom: 10,
                borderBottom: `1px solid ${COLOR.border}`,
              }}
            >
              Rekap Pajak
            </div>
            {[
              ['Kode Transaksi', kode],
              ['Tanggal FP', fmtD(fpDate)],
              ['Referensi Invoice', inv?.number || '—'],
              ['DPP', rp(dpp)],
              ['Tarif PPN', '11%'],
              ['PPN Terutang', rp(ppn)],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: COLOR.grayL }}>{l}</span>
                <span
                  style={{
                    fontWeight:
                      l === 'PPN Terutang' || l === 'DPP' ? 700 : 500,
                    color: l === 'PPN Terutang' ? COLOR.purple : COLOR.dark,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            <button
              onClick={() =>
                isValid &&
                onPreview({
                  inv: inv || null,
                  fpDate,
                  kode,
                  fpSerial,
                  buyer: {
                    type: buyerType,
                    npwp: buyerNPWP,
                    nik: buyerNIK,
                    name: buyerName,
                    addr: buyerAddr,
                  },
                  items,
                  dpp,
                  ppn,
                  notes,
                })
              }
              disabled={!isValid}
              style={{
                marginTop: 6,
                padding: '10px',
                width: '100%',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                border: 'none',
                background: isValid ? COLOR.purple : '#c3bce8',
                color: '#fff',
                cursor: isValid ? 'pointer' : 'default',
                opacity: isValid ? 1 : 0.6,
              }}
            >
              Preview Faktur Pajak →
            </button>
            {!isValid && (
              <div style={{ fontSize: 11, color: COLOR.grayL, textAlign: 'center' }}>
                {buyerType === 'pkp' && (!buyerNPWP || buyerNPWP.length < 15) &&
                  '→ Isi NPWP pembeli (15 digit)'}
                {buyerType === 'nik' && (!buyerNIK || buyerNIK.length !== 16) &&
                  '→ Isi NIK pembeli (16 digit)'}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============ PreviewStep ============

function PreviewStep({
  data,
  onBack,
  onConfirm,
}: {
  data: FakturPajakFormData
  onBack: () => void
  onConfirm: (mode: 'draft' | 'issued') => void
}) {
  const { inv, fpDate, kode, fpSerial, buyer, items, dpp, ppn, notes } = data
  const bkpItems = items.filter((i) => i.ppn_pct > 0)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          background: COLOR.white,
          borderBottom: `1px solid ${COLOR.border}`,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.dark }}>
            Preview Faktur Pajak
          </div>
          <div style={{ fontSize: 12, color: COLOR.grayL }}>
            Periksa sebelum diterbitkan & upload ke e-Faktur DJP
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 7,
              cursor: 'pointer',
              border: `1px solid ${COLOR.border}`,
              background: COLOR.white,
              color: COLOR.gray,
            }}
          >
            ← Kembali Edit
          </button>
          <button
            onClick={() => onConfirm('draft')}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 7,
              cursor: 'pointer',
              border: `1px solid ${COLOR.border}`,
              background: COLOR.white,
              color: COLOR.gray,
            }}
          >
            Simpan Draft
          </button>
          <button
            onClick={() => onConfirm('issued')}
            style={{
              padding: '7px 20px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 7,
              cursor: 'pointer',
              border: 'none',
              background: COLOR.purple,
              color: '#fff',
            }}
          >
            Terbitkan Faktur Pajak
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            background: COLOR.white,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 32,
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          {/* header resmi */}
          <div
            style={{
              textAlign: 'center',
              paddingBottom: 16,
              borderBottom: '2px solid #1a202c',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLOR.dark,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              FAKTUR PAJAK
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: COLOR.purple,
                fontFamily: 'monospace',
                marginTop: 6,
                letterSpacing: '1px',
              }}
            >
              {fpSerial}
            </div>
            <div style={{ fontSize: 12, color: COLOR.grayL, marginTop: 4 }}>
              Kode Transaksi: {kode} · Tanggal: {fmtD(fpDate)} · Ref. Invoice:{' '}
              {inv?.number}
            </div>
          </div>

          {/* penjual - pembeli */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                head: 'Pengusaha Kena Pajak Penjual',
                name: businessSeller.name,
                addr: businessSeller.addr,
                npwp: businessSeller.npwp,
                label: 'NPWP Penjual',
              },
              {
                head: 'Pembeli BKP / Penerima JKP',
                name: buyer.name,
                addr: buyer.addr,
                npwp:
                  buyer.type === 'pkp'
                    ? buyer.npwp
                    : buyer.type === 'nik'
                      ? buyer.nik
                      : '000000000000000',
                label: buyer.type === 'nik' ? 'NIK Pembeli' : 'NPWP Pembeli',
              },
            ].map((b) => (
              <div
                key={b.head}
                style={{
                  background: COLOR.grayXL,
                  borderRadius: 9,
                  padding: '13px 15px',
                  border: `1px solid ${COLOR.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLOR.grayL,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 8,
                  }}
                >
                  {b.head}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.dark }}>
                  {b.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLOR.gray,
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {b.addr}
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLOR.border}` }}>
                  <div style={{ fontSize: 10, color: COLOR.grayL }}>{b.label}</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLOR.dark,
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {b.npwp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* tabel BKP */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLOR.grayL,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}
            >
              Barang Kena Pajak / Jasa Kena Pajak
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: COLOR.dark }}>
                  {[
                    ['No', '36px'],
                    ['Nama BKP/JKP', 'auto'],
                    ['Qty', '55px'],
                    ['Sat.', '50px'],
                    ['Harga Satuan', '100px'],
                    ['Disc', '55px'],
                    ['Harga Jual', '105px'],
                  ].map(([h, w]) => (
                    <th
                      key={h}
                      style={{
                        width: w as any,
                        padding: '9px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fff',
                        textAlign: h === 'No' ? 'center' : 'left',
                        border: 'none',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bkpItems.map((item, i) => {
                  const hj = item.qty * item.harga
                  const dc = (hj * item.disc_pct) / 100
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? COLOR.white : COLOR.grayXL }}>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          color: COLOR.grayL,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: COLOR.dark,
                          border: `1px solid ${COLOR.border}`,
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          color: COLOR.dark,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {item.qty}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          color: COLOR.gray,
                          border: `1px solid ${COLOR.border}`,
                        }}
                      >
                        {item.uom}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          color: COLOR.gray,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'right',
                        }}
                      >
                        {rp(item.harga)}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          color: item.disc_pct > 0 ? COLOR.yellow : COLOR.grayL,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {item.disc_pct > 0 ? item.disc_pct + '%' : '—'}
                      </td>
                      <td
                        style={{
                          padding: '9px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: COLOR.dark,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'right',
                        }}
                      >
                        {rp(hj - dc)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* DPP & PPN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div
              style={{
                background: COLOR.grayXL,
                borderRadius: 9,
                padding: '14px 16px',
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLOR.grayL,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 10,
                }}
              >
                Dasar Pengenaan Pajak (DPP)
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.dark }}>
                {rp(dpp)}
              </div>
              <div style={{ fontSize: 12, color: COLOR.grayL, marginTop: 3 }}>
                Jumlah harga jual item BKP setelah diskon
              </div>
            </div>
            <div
              style={{
                background: COLOR.purpleL,
                borderRadius: 9,
                padding: '14px 16px',
                border: `1px solid #d6bcfa`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6b46c1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 10,
                }}
              >
                PPN Terutang (11% × DPP)
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.purple }}>
                {rp(ppn)}
              </div>
              <div style={{ fontSize: 12, color: '#805ad5', marginTop: 3 }}>
                Pajak Pertambahan Nilai yang harus disetor
              </div>
            </div>
          </div>

          {notes && (
            <div
              style={{
                background: COLOR.blueXL,
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                color: '#2c5282',
              }}
            >
              <span style={{ fontWeight: 700 }}>Catatan: </span>
              {notes}
            </div>
          )}

          {/* footer */}
          <div
            style={{
              borderTop: `1px solid ${COLOR.border}`,
              paddingTop: 10,
              textAlign: 'center',
              fontSize: 11,
              color: COLOR.grayL,
            }}
          >
            Faktur Pajak ini diterbitkan secara elektronik melalui sistem Gerbangku · {today}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ DoneStep ============

function DoneStep({
  data,
  mode,
  onReset,
}: {
  data: FakturPajakFormData
  mode: 'draft' | 'issued'
  onReset: () => void
}) {
  const { fpSerial, dpp, ppn, buyer } = data
  const isDraft = mode === 'draft'

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: 48,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: isDraft ? COLOR.yellowL : '#e9d8fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isDraft ? (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLOR.yellow}
            strokeWidth="2.5"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLOR.purple}
            strokeWidth="2.5"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: COLOR.dark }}>
        {isDraft ? 'Faktur Pajak Disimpan sebagai Draft' : 'Faktur Pajak Diterbitkan!'}
      </div>
      <div style={{ fontSize: 14, color: COLOR.gray }}>
        No.{' '}
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: COLOR.purple,
          }}
        >
          {fpSerial}
        </span>
      </div>
      <div
        style={{
          background: COLOR.purpleL,
          border: `1px solid #d6bcfa`,
          borderRadius: 10,
          padding: '14px 24px',
          minWidth: 320,
          textAlign: 'left',
        }}
      >
        {[
          ['DPP', rp(dpp)],
          ['PPN 11%', rp(ppn)],
          ['Pembeli', buyer.name],
          [
            'NPWP/NIK',
            buyer.type === 'nik'
              ? buyer.nik
              : buyer.type === 'nonpkp'
                ? '000000000000000'
                : buyer.npwp,
          ],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 20,
              fontSize: 13,
              padding: '5px 0',
              borderBottom: `1px solid #e9d8fd`,
            }}
          >
            <span style={{ color: COLOR.grayL }}>{l}</span>
            <span
              style={{
                fontWeight: 700,
                color: COLOR.dark,
                fontFamily: l.includes('NPWP') ? 'monospace' : 'inherit',
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      {!isDraft && (
        <div
          style={{
            background: COLOR.yellowL,
            border: `1px solid #f6e05e`,
            borderRadius: 9,
            padding: '11px 18px',
            fontSize: 12,
            color: '#744210',
            maxWidth: 440,
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠ Langkah selanjutnya:</div>
          <div>
            Upload file CSV faktur pajak ini ke aplikasi <b>e-Faktur Desktop DJP</b> atau{' '}
            <b>e-Faktur Web Based</b> untuk pelaporan SPT Masa PPN.
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginTop: 8,
          width: '100%',
          maxWidth: 440,
        }}
      >
        {[
          ['Cetak PDF', COLOR.white],
          ['Download CSV e-Faktur', COLOR.white],
          ['Upload ke e-Faktur DJP', COLOR.white],
          ['Kirim ke Customer', COLOR.white],
          ['Lihat Daftar FP', COLOR.white],
          ['Buat FP Baru', COLOR.purple],
        ].map(([l, bg]) => (
          <button
            key={l}
            onClick={l === 'Buat FP Baru' ? onReset : undefined}
            style={{
              padding: '9px 10px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              cursor: 'pointer',
              border: `1px solid ${bg === COLOR.purple ? COLOR.purple : COLOR.border}`,
              background: bg,
              color: bg === COLOR.purple ? '#fff' : COLOR.gray,
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============ Main Component ============

export default function FakturPajakFormComponent() {
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form')
  const [payload, setPayload] = useState<FakturPajakFormData | null>(null)
  const [mode, setMode] = useState<'draft' | 'issued'>('issued')

  if (step === 'form')
    return (
      <FormStep
        onPreview={(d) => {
          setPayload(d)
          setStep('preview')
        }}
      />
    )
  if (step === 'preview')
    return (
      <PreviewStep
        data={payload!}
        onBack={() => setStep('form')}
        onConfirm={(m) => {
          setMode(m)
          setStep('done')
        }}
      />
    )
  return (
    <DoneStep
      data={payload!}
      mode={mode}
      onReset={() => {
        setPayload(null)
        setStep('form')
      }}
    />
  )
}