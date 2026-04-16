// components/dashboard/DOForm.tsx
'use client'

import { useState } from 'react'
import type { Driver, SOItem, DOFormData } from '@/types'
import { drivers, soItemsExample, customers } from '@/lib/mockData'

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const today = new Date().toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const COLOR = {
  bg: '#fff',
  bgS: '#f5f4f0',
  bgT: '#fafaf8',
  txt: '#2d2520',
  txtS: '#6b6456',
  txtT: '#9c9488',
  border: '#e5e0d8',
  borderS: '#ede8e0',
  success: '#dcfce7',
  successT: '#16a34a',
  warning: '#fffbeb',
  warningT: '#d97706',
  danger: '#fff5f5',
  dangerT: '#dc2626',
  info: '#dbeafe',
  infoT: '#2563eb',
}

const s = {
  card: { background: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: 12, overflow: 'hidden' },
  inp: {
    padding: '8px 10px',
    border: `1px solid ${COLOR.border}`,
    borderRadius: 7,
    fontSize: 13,
    width: '100%',
    color: COLOR.txt,
    background: COLOR.bg,
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  lbl: { fontSize: 12, fontWeight: 600, color: COLOR.txtS, marginBottom: 5, display: 'block' as const },
}

function SecHead({ n, title, sub }: { n: number; title: string; sub?: string }) {
  return (
    <div
      style={{
        padding: '13px 18px',
        borderBottom: `1px solid ${COLOR.border}`,
        background: COLOR.bgS,
        display: 'flex',
        gap: 11,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: COLOR.infoT,
          color: COLOR.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.txt }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: COLOR.txtT, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function FormStep({ onNext, soData }: { onNext: (data: DOFormData) => void; soData?: any }) {
  const [driver, setDriver] = useState('1')
  const [manualDriver, setManualDriver] = useState('')
  const [addr, setAddr] = useState(soData?.address || 'Jl. Sunset Road No.12, Seminyak')
  const [picName, setPicName] = useState(soData?.pic || 'Pak Agus')
  const [picPhone, setPicPhone] = useState(soData?.phone || '08123456789')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [waktu, setWaktu] = useState('pagi')
  const [notes, setNotes] = useState('')

  const items = soData?.items || soItemsExample

  const [checks, setChecks] = useState(
    items.reduce((a: Record<string, { on: boolean; qty: number }>, i: SOItem) => ({
      ...a,
      [i.id]: { on: true, qty: i.qty_so },
    }), {}),
  )

  const toggle = (id: string) => {
    const c = checks[id]
    setChecks({
      ...checks,
      [id]: {
        on: !c.on,
        qty: !c.on ? items.find((x: SOItem) => x.id === id).qty_so : 0,
      },
    })
  }

  const selected = items.filter((i: SOItem) => checks[i.id]?.on && checks[i.id]?.qty > 0)
  const totalQty = selected.reduce((s: number, i: SOItem) => s + (checks[i.id]?.qty || 0), 0)
  const totalVal = selected.reduce(
    (s: number, i: SOItem) => s + (checks[i.id]?.qty || 0) * i.price,
    0,
  )
  const drv = drivers.find((d) => d.id === driver)
  const canGo = selected.length > 0 && picName.trim()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLOR.bgS }}>
      {/* topbar */}
      <div
        style={{
          background: COLOR.bg,
          borderBottom: `1px solid ${COLOR.border}`,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.txt }}>Buat Surat Jalan</div>
          <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 2 }}>
            dari <span style={{ fontFamily: 'monospace', color: COLOR.infoT, fontWeight: 600 }}>SO-2026-0043</span>
            {' · RM Padang Jaya · '}
            {today}
          </div>
        </div>
        <button
          onClick={() =>
            canGo &&
            onNext({
              drv: drv || null,
              manualDriver,
              addr,
              picName,
              picPhone,
              date,
              waktu,
              notes,
              selected,
              checks,
              totalQty,
              totalVal,
            })
          }
          disabled={!canGo}
          style={{
            padding: '9px 22px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            background: canGo ? COLOR.successT : COLOR.border,
            color: canGo ? COLOR.bg : COLOR.txtS,
            cursor: canGo ? 'pointer' : 'default',
          }}
        >
          Preview Surat Jalan →
        </button>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SEKSI 1: Barang */}
        <div style={s.card}>
          <SecHead
            n={1}
            title="Barang yang Dikirim"
            sub="Centang barang yang masuk pengiriman ini. Ubah qty jika kirim sebagian."
          />
          {/* header kolom */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '38px 1fr 65px 80px 105px 105px',
              gap: 8,
              padding: '8px 16px',
              background: COLOR.bgS,
              borderBottom: `1px solid ${COLOR.border}`,
            }}
          >
            {['', 'Nama Barang', 'Satuan', 'Qty SO', 'Qty Dikirim', 'Nilai'].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: COLOR.txtT, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {h}
              </div>
            ))}
          </div>
          {items.map((item: SOItem) => {
            const c = checks[item.id]
            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '38px 1fr 65px 80px 105px 105px',
                  gap: 8,
                  padding: '11px 16px',
                  borderBottom: `1px solid ${COLOR.border}`,
                  alignItems: 'center',
                  background: c.on ? '#f0fff4' : COLOR.bg,
                }}
              >
                <div
                  onClick={() => toggle(item.id)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    border: `2px solid ${c.on ? COLOR.successT : COLOR.border}`,
                    background: c.on ? COLOR.successT : COLOR.bg,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {c.on && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.txt }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: COLOR.txtT, fontFamily: 'monospace' }}>{item.sku}</div>
                </div>
                <div style={{ fontSize: 13, color: COLOR.txtS }}>{item.uom}</div>
                <div style={{ fontSize: 13, color: COLOR.txtS }}>{item.qty_so}</div>
                <input
                  type="number"
                  min={0}
                  max={item.qty_so}
                  step={0.5}
                  disabled={!c.on}
                  value={c.on ? c.qty : ''}
                  placeholder="0"
                  onChange={(e) =>
                    setChecks({
                      ...checks,
                      [item.id]: {
                        ...c,
                        qty: Math.min(parseFloat(e.target.value) || 0, item.qty_so),
                      },
                    })
                  }
                  style={{ ...s.inp, textAlign: 'right', background: c.on ? COLOR.bg : COLOR.bgS, padding: '6px 8px', fontSize: 12 }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.on && c.qty > 0 ? COLOR.successT : COLOR.border,
                  }}
                >
                  {c.on && c.qty > 0 ? rp(c.qty * item.price) : '—'}
                </div>
              </div>
            )
          })}
          {/* footer total */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '38px 1fr 65px 80px 105px 105px',
              gap: 8,
              padding: '10px 16px',
              background: COLOR.bgS,
              borderTop: `1px solid ${COLOR.border}`,
            }}
          >
            <div />
            <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.txt }}>
              {selected.length} produk dipilih
            </div>
            <div />
            <div />
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.txt }}>
              {Math.round(totalQty * 10) / 10} unit
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.successT }}>{rp(totalVal)}</div>
          </div>
        </div>

        {/* SEKSI 2 + 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* SEKSI 2: Driver */}
          <div style={s.card}>
            <SecHead n={2} title="Driver & Kendaraan" sub="Siapa yang mengantar barang ini?" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {drivers.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDriver(d.id)}
                  style={{
                    padding: '11px 13px',
                    border: `2px solid ${driver === d.id ? COLOR.successT : COLOR.border}`,
                    borderRadius: 9,
                    cursor: 'pointer',
                    background: driver === d.id ? '#f0fff4' : COLOR.bg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: driver === d.id ? COLOR.successT : COLOR.bgS,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: driver === d.id ? COLOR.bg : COLOR.txtS,
                      flexShrink: 0,
                    }}
                  >
                    {d.name
                      .split(' ')
                      .map((x) => x[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.txt }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: COLOR.txtT }}>{d.vehicle}</div>
                    <div style={{ fontSize: 11, color: COLOR.txtT }}>{d.phone}</div>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${driver === d.id ? COLOR.successT : COLOR.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {driver === d.id && (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLOR.successT }} />
                    )}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: 12, marginTop: 2 }}>
                <label style={s.lbl}>Atau isi driver luar (manual)</label>
                <input
                  value={manualDriver}
                  onChange={(e) => setManualDriver(e.target.value)}
                  placeholder="Nama · Nopol · No. HP"
                  style={s.inp}
                />
              </div>
            </div>
          </div>

          {/* SEKSI 3: Tujuan & Penerima */}
          <div style={s.card}>
            <SecHead n={3} title="Tujuan & Penerima" sub="Ke mana dikirim dan siapa yang menerima?" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={s.lbl}>
                  Alamat Tujuan <span style={{ color: COLOR.dangerT }}>*</span>
                </label>
                <textarea
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  rows={3}
                  placeholder="Alamat lengkap tujuan pengiriman..."
                  style={{ ...s.inp, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={s.lbl}>
                    Nama Penerima <span style={{ color: COLOR.dangerT }}>*</span>
                  </label>
                  <input
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Yang menerima di lokasi"
                    style={s.inp}
                  />
                  <div style={{ fontSize: 11, color: COLOR.txtT, marginTop: 3 }}>Yang menerima di lokasi</div>
                </div>
                <div>
                  <label style={s.lbl}>No. HP Penerima</label>
                  <input
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    placeholder="08xx..."
                    style={s.inp}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={s.lbl}>Tanggal Kirim</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.inp} />
                </div>
                <div>
                  <label style={s.lbl}>Waktu Kirim</label>
                  <select value={waktu} onChange={(e) => setWaktu(e.target.value)} style={s.inp}>
                    <option value="pagi">Pagi 06:00 – 09:00</option>
                    <option value="siang">Siang 10:00 – 13:00</option>
                    <option value="sore">Sore 14:00 – 17:00</option>
                    <option value="bebas">Bebas (sesuai driver)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={s.lbl}>Catatan untuk Driver / Penerima</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Contoh: masuk gate belakang, hubungi Pak Agus dulu..."
                  style={{ ...s.inp, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </div>

        {!canGo && (
          <div
            style={{
              padding: '10px 14px',
              background: COLOR.warning,
              border: `1px solid #fde68a`,
              borderRadius: 8,
              fontSize: 12,
              color: COLOR.warningT,
            }}
          >
            {selected.length === 0 && '⚠ Centang minimal 1 barang di Seksi 1.'}
            {selected.length > 0 && !picName.trim() && '⚠ Isi nama penerima di Seksi 3.'}
          </div>
        )}
      </div>
    </div>
  )
}

function PreviewStep({
  data,
  onBack,
  onConfirm,
}: {
  data: DOFormData
  onBack: () => void
  onConfirm: () => void
}) {
  const { drv, manualDriver, addr, picName, picPhone, date, notes, selected, checks, totalQty, totalVal } = data
  const doNum = 'DO-2026-0038'
  const drvLabel = manualDriver || drv?.name || ''
  const drvSub = manualDriver ? '' : drv?.vehicle || ''
  const tglKirim = date
    ? new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : today

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          background: COLOR.bg,
          borderBottom: `1px solid ${COLOR.border}`,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.txt }}>Preview Surat Jalan</div>
          <div style={{ fontSize: 12, color: COLOR.txtT }}>Periksa sebelum diterbitkan</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 7,
              cursor: 'pointer',
              border: `1px solid ${COLOR.border}`,
              background: COLOR.bg,
              color: COLOR.txtS,
            }}
          >
            ← Kembali Edit
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '7px 20px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 7,
              cursor: 'pointer',
              border: 'none',
              background: COLOR.successT,
              color: COLOR.bg,
            }}
          >
            Konfirmasi & Terbitkan
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            background: COLOR.bg,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 28,
            maxWidth: 680,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* kop */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: `2px solid ${COLOR.txt}`,
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: COLOR.txt }}>UD Sari Daging Bali</div>
              <div style={{ fontSize: 12, color: COLOR.txtT }}>
                Jl. Gatot Subroto No. 45, Denpasar Selatan, Bali 80239
              </div>
              <div style={{ fontSize: 12, color: COLOR.txtT }}>
                Telp: 0361-234567 · WA: 08123456789 · NPWP: 01.234.567.8
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLOR.txtT,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Surat Jalan
              </div>
              <div style={{ fontSize: 21, fontWeight: 700, color: COLOR.txt, fontFamily: 'monospace', marginTop: 2 }}>
                {doNum}
              </div>
              <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 3 }}>Tanggal: {tglKirim}</div>
              <div style={{ fontSize: 12, color: COLOR.txtT }}>Ref. SO: SO-2026-0043</div>
            </div>
          </div>

          {/* pengirim - penerima */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              {
                head: 'Pengirim',
                main: 'UD Sari Daging Bali',
                sub: 'Gudang Utama, Denpasar',
                lines: [`Driver: ${drvLabel}`, drvSub, manualDriver ? '' : drv?.phone],
              },
              { head: 'Penerima', main: 'RM Padang Jaya', sub: addr, lines: [`a/n: ${picName}`, picPhone] },
            ].map((b) => (
              <div
                key={b.head}
                style={{
                  background: COLOR.bgS,
                  borderRadius: 9,
                  padding: '12px 14px',
                  border: `1px solid ${COLOR.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLOR.txtT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 7,
                  }}
                >
                  {b.head}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.txt }}>{b.main}</div>
                <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 2 }}>{b.sub}</div>
                <div style={{ borderTop: `1px solid ${COLOR.border}`, marginTop: 8, paddingTop: 8 }}>
                  {b.lines
                    .filter(Boolean)
                    .map((l, i) => (
                      <div key={i} style={{ fontSize: 12, color: COLOR.txtS }}>
                        {l}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* tabel barang */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: COLOR.txtT,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}
            >
              Daftar Barang
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: COLOR.bgS }}>
                  {[
                    ['No', '36px'],
                    ['Nama Barang', 'auto'],
                    ['SKU', '76px'],
                    ['Qty', '60px'],
                    ['Sat.', '55px'],
                    ['Diterima (√)', '88px'],
                  ].map(([h, w]) => (
                    <th
                      key={h}
                      style={{
                        width: w as any,
                        padding: '8px 9px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLOR.txtT,
                        textAlign: 'left',
                        border: `1px solid ${COLOR.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.map((item, i) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: '9px',
                        fontSize: 12,
                        color: COLOR.txtT,
                        border: `1px solid ${COLOR.border}`,
                        textAlign: 'center',
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        padding: '9px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLOR.txt,
                        border: `1px solid ${COLOR.border}`,
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: '9px',
                        fontSize: 10,
                        color: COLOR.txtT,
                        fontFamily: 'monospace',
                        border: `1px solid ${COLOR.border}`,
                      }}
                    >
                      {item.sku}
                    </td>
                    <td
                      style={{
                        padding: '9px',
                        fontSize: 13,
                        fontWeight: 700,
                        color: COLOR.txt,
                        border: `1px solid ${COLOR.border}`,
                        textAlign: 'center',
                      }}
                    >
                      {checks[item.id]?.qty}
                    </td>
                    <td
                      style={{
                        padding: '9px',
                        fontSize: 13,
                        color: COLOR.txtT,
                        border: `1px solid ${COLOR.border}`,
                        textAlign: 'center',
                      }}
                    >
                      {item.uom}
                    </td>
                    <td style={{ padding: '9px', border: `1px solid ${COLOR.border}` }} />
                  </tr>
                ))}
                <tr style={{ background: COLOR.bgS }}>
                  <td
                    colSpan={3}
                    style={{
                      padding: '9px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLOR.txt,
                      border: `1px solid ${COLOR.border}`,
                      textAlign: 'right',
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      padding: '9px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLOR.txt,
                      border: `1px solid ${COLOR.border}`,
                      textAlign: 'center',
                    }}
                  >
                    {Math.round(totalQty * 10) / 10}
                  </td>
                  <td colSpan={2} style={{ border: `1px solid ${COLOR.border}` }} />
                </tr>
              </tbody>
            </table>
          </div>

          {notes && (
            <div
              style={{
                background: COLOR.warning,
                border: '1px solid #fde68a',
                borderRadius: 8,
                padding: '9px 13px',
                fontSize: 12,
                color: COLOR.warningT,
              }}
            >
              <b>Catatan:</b> {notes}
            </div>
          )}

          {/* tanda tangan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 8 }}>
            {[
              ['Dibuat oleh', '...........'],
              ['Driver / Pengirim', drvLabel],
              ['Penerima', picName],
            ].map(([lbl, nam]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: COLOR.txtT, marginBottom: 56 }}>{lbl}</div>
                <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.txt }}>({nam})</div>
                  <div style={{ fontSize: 10, color: COLOR.txtT, marginTop: 2 }}>Tanda tangan & stempel</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DoneStep({ data, onReset }: { data: DOFormData; onReset: () => void }) {
  const { selected, checks, totalQty, totalVal } = data

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
          background: COLOR.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLOR.successT} strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: COLOR.txt }}>Surat Jalan Diterbitkan!</div>
      <div style={{ fontSize: 14, color: COLOR.txtT }}>
        No. <span style={{ fontFamily: 'monospace', fontWeight: 700, color: COLOR.successT }}>DO-2026-0038</span>
        {' · '}
        {selected.length} produk · {Math.round(totalQty * 10) / 10} unit · {rp(totalVal)}
      </div>
      <div
        style={{
          background: COLOR.bgS,
          border: `1px solid ${COLOR.border}`,
          borderRadius: 10,
          padding: '14px 24px',
          textAlign: 'left',
          minWidth: 300,
        }}
      >
        {selected.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
              fontSize: 13,
              padding: '4px 0',
              borderBottom: `1px solid ${COLOR.border}`,
            }}
          >
            <span style={{ color: COLOR.txtS }}>{item.name}</span>
            <span style={{ fontWeight: 700, color: COLOR.txt }}>
              {checks[item.id]?.qty} {item.uom}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          style={{
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            cursor: 'pointer',
            border: `1px solid ${COLOR.border}`,
            background: COLOR.bg,
          }}
        >
          Cetak PDF
        </button>
        <button
          style={{
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            cursor: 'pointer',
            border: `1px solid ${COLOR.border}`,
            background: COLOR.bg,
          }}
        >
          WA ke Driver
        </button>
        <button
          style={{
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            cursor: 'pointer',
            border: `1px solid ${COLOR.border}`,
            background: COLOR.bg,
          }}
        >
          WA ke Customer
        </button>
        <button
          onClick={onReset}
          style={{
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            cursor: 'pointer',
            border: `1px solid ${COLOR.successT}`,
            background: '#f0fff4',
            color: COLOR.successT,
          }}
        >
          + Buat DO Lain
        </button>
      </div>
    </div>
  )
}

export default function DOFormComponent() {
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form')
  const [payload, setPayload] = useState<DOFormData | null>(null)

  if (step === 'form')
    return (
      <FormStep
        onNext={(d) => {
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
        onConfirm={() => setStep('done')}
      />
    )
  return (
    <DoneStep
      data={payload!}
      onReset={() => {
        setPayload(null)
        setStep('form')
      }}
    />
  )
}