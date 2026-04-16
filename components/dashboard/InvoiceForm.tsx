// components/dashboard/InvoiceForm.tsx
'use client'

import { useState } from 'react'
import type { Customer, InvoiceRow, InvoiceFormData, InvoiceProduct } from '@/types'
import { customers, businessData, invoiceProducts } from '@/lib/mockData'

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const today = new Date().toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
const todayISO = new Date().toISOString().split('T')[0]

const addDays = (iso: string, n: number) => {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const fmtDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '-'

const COLOR = {
  bg: '#fff',
  bgS: '#f5f4f0',
  txt: '#2d2520',
  txtS: '#6b6456',
  txtT: '#9c9488',
  border: '#e5e0d8',
  borderS: '#ede8e0',
  success: '#dcfce7',
  successT: '#16a34a',
  warning: '#fffbeb',
  warningT: '#d97706',
}

const inp = {
  padding: '8px 10px',
  border: `1px solid ${COLOR.border}`,
  borderRadius: 7,
  fontSize: 13,
  width: '100%',
  color: COLOR.txt,
  background: COLOR.bg,
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
}

const sel = { ...inp }

function Lbl({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.txtS, marginBottom: 5 }}>
      {children}
      {req && <span style={{ color: COLOR.warningT }}> *</span>}
    </div>
  )
}

function Card({ children, p = 18 }: { children: React.ReactNode; p?: number }) {
  return (
    <div
      style={{
        background: COLOR.bg,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        padding: p,
      }}
    >
      {children}
    </div>
  )
}

function CardHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${COLOR.border}`,
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.txt }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 1 }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}

function ProductRow({
  row,
  idx,
  onChange,
  onRemove,
}: {
  row: InvoiceRow
  idx: number
  onChange: (data: InvoiceRow) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  const prod = invoiceProducts.find((p) => p.id === row.pid)

  const qty = parseFloat(row.qty as string) || 0
  const price = parseFloat(row.price as string) || 0
  const disc = parseFloat(row.disc as string) || 0
  const subtotal = qty * price
  const discAmt = (subtotal * disc) / 100
  const base = subtotal - discAmt
  const taxAmt = (base * (row.tax || 0)) / 100
  const total = base + taxAmt

  return (
    <div style={{ borderBottom: `1px solid ${COLOR.border}`, padding: '10px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '24px 1fr 80px 110px 70px 70px 90px 24px',
          gap: 8,
          alignItems: 'start',
        }}
      >
        {/* no */}
        <div style={{ fontSize: 12, color: COLOR.txtT, paddingTop: 10, textAlign: 'center' }}>
          {idx + 1}
        </div>

        {/* produk picker */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              ...inp,
              cursor: 'pointer',
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {prod ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.txt }}>{prod.name}</div>
                <div style={{ fontSize: 10, color: COLOR.txtT, fontFamily: 'monospace' }}>
                  {prod.sku}
                </div>
              </div>
            ) : (
              <span style={{ color: COLOR.txtT, fontSize: 13 }}>Pilih produk…</span>
            )}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLOR.txtT}
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {open && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100%+4px)',
                left: 0,
                right: 0,
                zIndex: 99,
                background: COLOR.bg,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                marginTop: 4,
              }}
            >
              {invoiceProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onChange({ ...row, pid: p.id, uom: p.uom, price: p.price, tax: p.tax })
                    setOpen(false)
                  }}
                  style={{
                    padding: '9px 12px',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${COLOR.border}`,
                    background: row.pid === p.id ? COLOR.bgS : COLOR.bg,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLOR.txt }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 12, color: COLOR.txtS }}>
                      {rp(p.price)}/{p.uom}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: COLOR.txtT, marginTop: 1 }}>
                    {p.sku}
                    {p.tax > 0 ? ` · PPN ${p.tax}%` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* qty */}
        <input
          type="number"
          min={0}
          step={0.5}
          value={row.qty || ''}
          placeholder="0"
          onChange={(e) => onChange({ ...row, qty: e.target.value })}
          style={{ ...inp, textAlign: 'right', padding: '8px 8px' }}
        />

        {/* harga */}
        <input
          type="number"
          min={0}
          step={1000}
          value={row.price || ''}
          placeholder="0"
          onChange={(e) => onChange({ ...row, price: e.target.value })}
          style={{ ...inp, textAlign: 'right', padding: '8px 8px' }}
        />

        {/* disc % */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={row.disc || ''}
            placeholder="0"
            onChange={(e) => onChange({ ...row, disc: e.target.value })}
            style={{ ...inp, textAlign: 'right', padding: '8px 6px' }}
          />
          <span style={{ fontSize: 11, color: COLOR.txtT, flexShrink: 0 }}>%</span>
        </div>

        {/* pajak */}
        <div
          style={{
            padding: '8px 6px',
            border: `1px solid ${COLOR.border}`,
            borderRadius: 7,
            fontSize: 12,
            color: row.tax > 0 ? COLOR.warningT : COLOR.txtT,
            background: COLOR.bgS,
            textAlign: 'center',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {row.tax > 0 ? `${row.tax}%` : '—'}
        </div>

        {/* total */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: total > 0 ? COLOR.txt : COLOR.border,
            textAlign: 'right',
            paddingTop: 10,
            paddingRight: 4,
          }}
        >
          {total > 0 ? rp(total) : '—'}
        </div>

        {/* hapus */}
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: COLOR.warningT,
            fontSize: 18,
            paddingTop: 8,
            lineHeight: '1',
          }}
        >
          ×
        </button>
      </div>

      {/* keterangan baris */}
      <div style={{ marginTop: 6, paddingLeft: 32 }}>
        <input
          value={row.desc || ''}
          onChange={(e) => onChange({ ...row, desc: e.target.value })}
          placeholder="Keterangan item (opsional)…"
          style={{ ...inp, fontSize: 12, color: COLOR.txtS, background: COLOR.bgS }}
        />
      </div>
    </div>
  )
}

function FormStep({ onNext }: { onNext: (data: InvoiceFormData) => void }) {
  const [custId, setCustId] = useState('c1')
  const [invDate, setInvDate] = useState(todayISO)
  const [dueDate, setDueDate] = useState(addDays(todayISO, 14))
  const [po, setPO] = useState('SO-2026-0043')
  const [notes, setNotes] = useState(
    'Mohon pembayaran dilakukan sebelum jatuh tempo.\nTerima kasih atas kepercayaan Anda.',
  )
  const [terms, setTerms] = useState(
    'Transfer ke rekening BCA 1234567890 a/n UD Sari Daging Bali.\nPembayaran melebihi jatuh tempo dikenakan denda 2% per bulan.',
  )
  const [discGlobal, setDiscGlobal] = useState('')
  const [addOther, setAddOther] = useState('')
  const [otherLabel, setOtherLabel] = useState('Ongkos kirim')

  const [rows, setRows] = useState<InvoiceRow[]>([
    { id: 1, pid: 'p1', uom: 'kg', qty: 10, price: 138000, disc: 0, tax: 0, desc: '' },
    { id: 2, pid: 'p3', uom: 'kg', qty: 8, price: 84000, disc: 0, tax: 0, desc: '' },
    { id: 3, pid: 'p4', uom: 'kg', qty: 3, price: 90000, disc: 5, tax: 0, desc: '' },
  ])

  const cust = customers.find((c) => c.id === custId)

  const calcRow = (r: InvoiceRow) => {
    const qty = parseFloat(r.qty as string) || 0
    const price = parseFloat(r.price as string) || 0
    const disc = parseFloat(r.disc as string) || 0
    const subtotal = qty * price
    const discAmt = (subtotal * disc) / 100
    const base = subtotal - discAmt
    const taxAmt = (base * (r.tax || 0)) / 100
    return { subtotal, discAmt, base, taxAmt, total: base + taxAmt }
  }

  const subtotalAll = rows.reduce((s, r) => s + calcRow(r).subtotal, 0)
  const discItemsAll = rows.reduce((s, r) => s + calcRow(r).discAmt, 0)
  const afterItems = subtotalAll - discItemsAll
  const dg = parseFloat(discGlobal) || 0
  const discGlobAmt = (afterItems * dg) / 100
  const taxBase = afterItems - discGlobAmt
  const totalTax = rows.reduce((s, r) => s + calcRow(r).taxAmt, 0)
  const other = parseFloat(addOther) || 0
  const grandTotal = taxBase + totalTax + other

  const addRow = () =>
    setRows([
      ...rows,
      { id: Date.now(), pid: '', uom: '', qty: '', price: '', disc: '', tax: 0, desc: '' },
    ])
  const updRow = (id: number, d: Partial<InvoiceRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...d } : r)))
  const delRow = (id: number) => rows.length > 1 && setRows(rows.filter((r) => r.id !== id))

  const isValid = custId && rows.some((r) => r.pid && parseFloat(r.qty as string) > 0)

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
          <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.txt }}>Buat Invoice</div>
          <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 2 }}>
            No. otomatis:{' '}
            <span style={{ fontFamily: 'monospace', color: COLOR.warningT, fontWeight: 700 }}>
              INV-2026-0019
            </span>
            {' · '}
            {businessData.name}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 8,
              border: `1px solid ${COLOR.border}`,
              background: COLOR.bg,
              color: COLOR.txtS,
              cursor: 'pointer',
            }}
          >
            Simpan Draft
          </button>
          <button
            onClick={() =>
              isValid &&
              onNext({
                cust: cust || null,
                invDate,
                dueDate,
                po,
                notes,
                terms,
                rows,
                discGlobal: dg,
                discGlobAmt,
                addOther: other,
                otherLabel,
                subtotalAll,
                discItemsAll,
                taxBase,
                totalTax,
                grandTotal,
              })
            }
            disabled={!isValid}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              background: isValid ? COLOR.successT : COLOR.border,
              color: isValid ? COLOR.bg : COLOR.txtT,
              cursor: isValid ? 'pointer' : 'default',
              opacity: isValid ? 1 : 0.6,
            }}
          >
            Preview Invoice →
          </button>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* baris atas: info invoice & customer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
          {/* Info Invoice */}
          <Card>
            <CardHead title="Info Invoice" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <Lbl req>Tanggal Invoice</Lbl>
                  <input
                    type="date"
                    value={invDate}
                    onChange={(e) => {
                      setInvDate(e.target.value)
                      setDueDate(addDays(e.target.value, cust?.payment_terms || 14))
                    }}
                    style={inp}
                  />
                </div>
                <div>
                  <Lbl req>Jatuh Tempo</Lbl>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={inp}
                  />
                  {cust && (
                    <div style={{ fontSize: 11, color: COLOR.txtT, marginTop: 3 }}>
                      Tempo {cust.payment_terms} hari
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Lbl>Referensi SO / PO Customer</Lbl>
                <input
                  value={po}
                  onChange={(e) => setPO(e.target.value)}
                  placeholder="Nomor SO atau PO customer…"
                  style={inp}
                />
              </div>
              <div>
                <Lbl>Metode Pembayaran</Lbl>
                <select style={sel}>
                  <option>Transfer Bank</option>
                  <option>Cash</option>
                  <option>Cek / Giro</option>
                  <option>QRIS</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Customer */}
          <Card>
            <CardHead title="Customer" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Lbl req>Pilih Customer</Lbl>
                <select
                  value={custId}
                  onChange={(e) => setCustId(e.target.value)}
                  style={sel}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              {cust && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    ['Alamat', cust.address],
                    ['No. Telepon', cust.phone],
                    ['Email', '—'],
                    ['NPWP', cust.npwp || '—'],
                    ['Status Pajak', cust.is_pkp ? 'PKP' : 'Non-PKP'],
                    ['Tempo Bayar', cust.payment_terms + ' hari'],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      style={{
                        background: COLOR.bgS,
                        borderRadius: 7,
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ fontSize: 10, color: COLOR.txtT, marginBottom: 2 }}>
                        {l}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: COLOR.txt,
                          wordBreak: 'break-word',
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* tabel item produk */}
        <Card p={0}>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${COLOR.border}`,
              background: COLOR.bgS,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.txt }}>
                Item / Produk
              </div>
              <div style={{ fontSize: 12, color: COLOR.txtT, marginTop: 1 }}>
                {rows.filter((r) => r.pid).length} item · {rp(grandTotal)} total
              </div>
            </div>
          </div>

          {/* col headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 80px 110px 70px 70px 90px 24px',
              gap: 8,
              padding: '8px 18px',
              background: COLOR.bgS,
              borderBottom: `1px solid ${COLOR.border}`,
            }}
          >
            {['#', 'Produk / Deskripsi', 'Qty', 'Harga Satuan', 'Disc %', 'Pajak', 'Jumlah', ''].map(
              (h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLOR.txtT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  {h}
                </div>
              ),
            )}
          </div>

          <div style={{ padding: '4px 18px' }}>
            {rows.map((row, idx) => (
              <ProductRow
                key={row.id}
                row={row}
                idx={idx}
                onChange={(d) => updRow(row.id, d)}
                onRemove={() => delRow(row.id)}
              />
            ))}
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderTop: `1px solid ${COLOR.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: COLOR.bgS,
            }}
          >
            <button
              onClick={addRow}
              style={{
                padding: '8px 20px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 8,
                border: `1px solid ${COLOR.border}`,
                background: COLOR.bg,
                color: COLOR.txtS,
                cursor: 'pointer',
              }}
            >
              + Tambah Item
            </button>
            <div style={{ fontSize: 11, color: COLOR.txtT }}>
              {rows.filter((r) => r.pid && parseFloat(r.qty as string) > 0).length} item
            </div>
          </div>
        </Card>

        {/* catatan + kalkulasi */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* catatan */}
          <Card>
            <CardHead title="Catatan & Syarat" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Lbl>Catatan untuk Customer</Lbl>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>
              <div>
                <Lbl>Syarat & Ketentuan Pembayaran</Lbl>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={3}
                  style={{ ...inp, resize: 'vertical', fontSize: 12, color: COLOR.txtS }}
                />
              </div>
            </div>
          </Card>

          {/* kalkulasi */}
          <Card>
            <CardHead title="Ringkasan Total" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.txtS }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: COLOR.txt }}>{rp(subtotalAll)}</span>
              </div>

              {discItemsAll > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.warningT }}>
                  <span>Diskon item</span>
                  <span>−{rp(discItemsAll)}</span>
                </div>
              )}

              {/* diskon global */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: COLOR.txtS }}>Diskon global</span>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={discGlobal}
                    onChange={(e) => setDiscGlobal(e.target.value)}
                    placeholder="0"
                    style={{
                      width: 50,
                      padding: '4px 6px',
                      border: `1px solid ${COLOR.border}`,
                      borderRadius: 6,
                      fontSize: 12,
                      textAlign: 'right',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ fontSize: 11, color: COLOR.txtT }}>%</span>
                  {discGlobAmt > 0 && (
                    <span style={{ fontSize: 12, color: COLOR.warningT }}>−{rp(discGlobAmt)}</span>
                  )}
                </div>
              </div>

              {totalTax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.warningT }}>
                  <span>PPN</span>
                  <span>{rp(totalTax)}</span>
                </div>
              )}

              {/* biaya lain */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <input
                  value={otherLabel}
                  onChange={(e) => setOtherLabel(e.target.value)}
                  style={{
                    border: 'none',
                    fontSize: 12,
                    color: COLOR.txtS,
                    background: 'transparent',
                    width: 110,
                    outline: 'none',
                    padding: 0,
                  }}
                />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={addOther}
                  onChange={(e) => setAddOther(e.target.value)}
                  placeholder="0"
                  style={{
                    width: 90,
                    padding: '4px 6px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 6,
                    fontSize: 12,
                    textAlign: 'right',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ height: 1, background: COLOR.border, margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700 }}>
                <span style={{ color: COLOR.txt }}>Grand Total</span>
                <span style={{ color: COLOR.successT }}>{rp(grandTotal)}</span>
              </div>

              <div
                style={{
                  background: '#f0fff4',
                  borderRadius: 8,
                  padding: '10px 12px',
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLOR.successT,
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  Pembayaran ke:
                </div>
                <div style={{ fontSize: 12, color: COLOR.txt }}>
                  {businessData.bank} · {businessData.account}
                </div>
                <div style={{ fontSize: 12, color: COLOR.txt }}>a/n {businessData.holder}</div>
              </div>

              <button
                onClick={() =>
                  isValid &&
                  onNext({
                    cust: cust || null,
                    invDate,
                    dueDate,
                    po,
                    notes,
                    terms,
                    rows,
                    discGlobal: dg,
                    discGlobAmt,
                    addOther: other,
                    otherLabel,
                    subtotalAll,
                    discItemsAll,
                    taxBase,
                    totalTax,
                    grandTotal,
                  })
                }
                disabled={!isValid}
                style={{
                  width: '100%',
                  padding: '9px',
                  marginTop: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: 'none',
                  background: isValid ? COLOR.successT : COLOR.border,
                  color: isValid ? COLOR.bg : COLOR.txtT,
                  cursor: isValid ? 'pointer' : 'default',
                  opacity: isValid ? 1 : 0.6,
                }}
              >
                {isValid ? 'Preview Invoice →' : 'Lengkapi form dulu'}
              </button>

              {!isValid && (
                <div style={{ fontSize: 11, color: COLOR.txtT }}>
                  {!custId && '→ Pilih customer'}
                  {custId && !rows.some((r) => r.pid && parseFloat(r.qty as string) > 0) && '→ Tambah minimal 1 item'}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PreviewStep({
  data,
  onBack,
  onConfirm,
}: {
  data: InvoiceFormData
  onBack: () => void
  onConfirm: (mode: 'draft' | 'sent') => void
}) {
  const {
    cust,
    invDate,
    dueDate,
    po,
    notes,
    terms,
    rows,
    discGlobal,
    discGlobAmt,
    addOther,
    otherLabel,
    subtotalAll,
    discItemsAll,
    totalTax,
    grandTotal,
  } = data

  const calcRow = (r: InvoiceRow) => {
    const qty = parseFloat(r.qty as string) || 0
    const price = parseFloat(r.price as string) || 0
    const disc = parseFloat(r.disc as string) || 0
    const sub = qty * price
    const da = (sub * disc) / 100
    const base = sub - da
    const tax = (base * (r.tax || 0)) / 100
    return { qty, price, disc, sub, da, base, tax, total: base + tax }
  }

  const validRows = rows.filter((r) => r.pid && parseFloat(r.qty as string) > 0)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.txt }}>
            Preview Invoice
          </div>
          <div style={{ fontSize: 12, color: COLOR.txtT }}>Periksa sebelum diterbitkan</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: `1px solid ${COLOR.border}`,
              background: COLOR.bg,
              color: COLOR.txtS,
              cursor: 'pointer',
            }}
          >
            ← Kembali Edit
          </button>
          <button
            onClick={() => onConfirm('draft')}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: `1px solid ${COLOR.border}`,
              background: COLOR.bg,
              color: COLOR.txtS,
              cursor: 'pointer',
            }}
          >
            Simpan Draft
          </button>
          <button
            onClick={() => onConfirm('sent')}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              background: COLOR.successT,
              color: COLOR.bg,
              cursor: 'pointer',
            }}
          >
            Terbitkan & Kirim
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            background: COLOR.bg,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 32,
            maxWidth: 760,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* kop */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: 20,
              borderBottom: `2px solid ${COLOR.txt}`,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLOR.txt }}>
                {businessData.legal}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLOR.txtT,
                  marginTop: 4,
                  lineHeight: 1.6,
                }}
              >
                {businessData.addr}
                <br />
                Telp: {businessData.phone} · WA: {businessData.wa}
                <br />
                Email: {businessData.email}
                <br />
                NPWP: {businessData.npwp}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLOR.txtT,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                Invoice
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: COLOR.txt,
                  fontFamily: 'monospace',
                  marginTop: 4,
                  letterSpacing: '-0.5px',
                }}
              >
                INV-2026-0019
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 12, color: COLOR.txtS }}>
                  Tanggal: <b>{fmtDate(invDate)}</b>
                </div>
                <div style={{ fontSize: 12, color: COLOR.warningT }}>
                  Jatuh Tempo: <b>{fmtDate(dueDate)}</b>
                </div>
                {po && (
                  <div style={{ fontSize: 12, color: COLOR.txtT }}>Ref: {po}</div>
                )}
              </div>
            </div>
          </div>

          {/* tagihan kepada */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLOR.txtT,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 8,
                }}
              >
                Tagihan Kepada
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.txt }}>
                {cust?.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLOR.txtS,
                  marginTop: 3,
                  lineHeight: 1.6,
                }}
              >
                {cust?.address}
                <br />
                {cust?.phone}
              </div>
            </div>
            <div
              style={{
                background: COLOR.bgS,
                borderRadius: 9,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLOR.txtT,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 8,
                }}
              >
                Info Pembayaran
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12 }}>
                <div>
                  <span style={{ color: COLOR.txtT }}>Bank</span>
                  <div style={{ fontWeight: 600, color: COLOR.txt }}>
                    {businessData.bank}
                  </div>
                </div>
                <div>
                  <span style={{ color: COLOR.txtT }}>No. Rekening</span>
                  <div style={{ fontWeight: 600, color: COLOR.txt }}>
                    {businessData.account}
                  </div>
                </div>
                <div style={{ paddingTop: 4, borderTop: `1px solid ${COLOR.border}` }}>
                  <span style={{ color: COLOR.txtT }}>Total Tagihan</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.successT }}>
                    {rp(grandTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* tabel item */}
          <div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
              }}
            >
              <thead>
                <tr style={{ background: COLOR.txt }}>
                  {[
                    ['No', '36px'],
                    ['Deskripsi', 'auto'],
                    ['Qty', '60px'],
                    ['Sat.', '50px'],
                    ['Harga', '100px'],
                    ['Disc', '56px'],
                    ['Pajak', '56px'],
                    ['Jumlah', '105px'],
                  ].map(([h, w]) => (
                    <th
                      key={h}
                      style={{
                        width: w as any,
                        padding: '10px 10px',
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
                {validRows.map((r, i) => {
                  const p = invoiceProducts.find((pr) => pr.id === r.pid)
                  const c = calcRow(r)
                  return (
                    <tr key={r.id} style={{ background: i % 2 === 0 ? COLOR.bg : COLOR.bgS }}>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 12,
                          color: COLOR.txtT,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {i + 1}
                      </td>
                      <td style={{ padding: '10px', border: `1px solid ${COLOR.border}` }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLOR.txt }}>
                          {p?.name}
                        </div>
                        {r.desc && (
                          <div style={{ fontSize: 11, color: COLOR.txtT, marginTop: 1 }}>
                            {r.desc}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: 10,
                            color: COLOR.txtT,
                            fontFamily: 'monospace',
                          }}
                        >
                          {p?.sku}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: COLOR.txt,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {c.qty}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 12,
                          color: COLOR.txtT,
                          border: `1px solid ${COLOR.border}`,
                        }}
                      >
                        {r.uom}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 12,
                          color: COLOR.txtS,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'right',
                        }}
                      >
                        {rp(c.price)}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 12,
                          color: c.disc > 0 ? COLOR.warningT : COLOR.txtT,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {c.disc > 0 ? c.disc + '%' : '—'}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 12,
                          color: r.tax > 0 ? COLOR.warningT : COLOR.txtT,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'center',
                        }}
                      >
                        {r.tax > 0 ? r.tax + '%' : '—'}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLOR.txt,
                          border: `1px solid ${COLOR.border}`,
                          textAlign: 'right',
                        }}
                      >
                        {rp(c.total)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 300 }}>
              {[
                ['Subtotal', rp(subtotalAll), COLOR.txtS],
                discItemsAll > 0 ? ['Diskon item', '−' + rp(discItemsAll), COLOR.warningT] : null,
                discGlobAmt > 0
                  ? [`Diskon global ${discGlobal}%`, '−' + rp(discGlobAmt), COLOR.warningT]
                  : null,
                totalTax > 0 ? ['PPN', rp(totalTax), COLOR.warningT] : null,
                addOther > 0 ? [otherLabel, rp(addOther), COLOR.txtS] : null,
              ]
                .filter(Boolean)
                .map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      padding: '5px 0',
                      borderBottom: `1px solid ${COLOR.border}`,
                      color: c,
                    }}
                  >
                    <span>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 17,
                  fontWeight: 700,
                  padding: '10px 0',
                  marginTop: 4,
                  borderTop: `2px solid ${COLOR.txt}`,
                }}
              >
                <span>Total</span>
                <span style={{ color: COLOR.successT }}>{rp(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* catatan + syarat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {notes && (
              <div style={{ background: '#ebf8ff', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.warningT, marginBottom: 4 }}>
                  Catatan
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.txt,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {notes}
                </div>
              </div>
            )}
            {terms && (
              <div
                style={{
                  background: COLOR.bgS,
                  borderRadius: 8,
                  padding: '12px 14px',
                  border: `1px solid ${COLOR.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLOR.txtT,
                    marginBottom: 4,
                  }}
                >
                  Syarat Pembayaran
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.txtS,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {terms}
                </div>
              </div>
            )}
          </div>

          {/* footer dokumen */}
          <div style={{ borderTop: `1px solid ${COLOR.border}`, paddingTop: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: COLOR.txtT }}>
              Dokumen ini dibuat secara otomatis oleh sistem · {businessData.name} · {today}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DoneStep({
  data,
  mode,
  onReset,
}: {
  data: InvoiceFormData
  mode: 'draft' | 'sent'
  onReset: () => void
}) {
  const { cust, grandTotal, dueDate } = data
  const isDraft = mode === 'draft'

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: 52,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: isDraft ? COLOR.warning : COLOR.success,
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
            stroke={COLOR.warningT}
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
            stroke={COLOR.successT}
            strokeWidth="2.5"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: COLOR.txt }}>
        {isDraft ? 'Invoice Disimpan sebagai Draft' : 'Invoice Diterbitkan!'}
      </div>
      <div style={{ fontSize: 14, color: COLOR.txtS }}>
        No. <span style={{ fontFamily: 'monospace', fontWeight: 700, color: isDraft ? COLOR.warningT : COLOR.successT }}>
          INV-2026-0019
        </span>
        {' · '}
        {cust?.name}
      </div>
      <div style={{ fontSize: 13, color: COLOR.txtT }}>
        Total: <b style={{ color: COLOR.txt }}>{rp(grandTotal)}</b>
        {' · '}
        Jatuh Tempo: <b style={{ color: COLOR.warningT }}>{fmtDate(dueDate)}</b>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginTop: 8,
          width: '100%',
          maxWidth: 480,
        }}
      >
        {[
          ['Cetak PDF', COLOR.bg],
          ['Kirim via Email', COLOR.bg],
          ['Kirim via WA', COLOR.bg],
          ['Buat Faktur Pajak', COLOR.bg],
          ['Catat Pembayaran', COLOR.successT],
          ['Buat Invoice Baru', COLOR.successT],
        ].map(([l, bg]) => (
          <button
            key={l}
            onClick={l === 'Buat Invoice Baru' ? onReset : undefined}
            style={{
              padding: '9px 10px',
              width: '100%',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              border: bg === COLOR.bg ? `1px solid ${COLOR.border}` : 'none',
              background: bg,
              color: bg === COLOR.bg ? COLOR.txtS : COLOR.bg,
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function InvoiceFormComponent() {
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form')
  const [payload, setPayload] = useState<InvoiceFormData | null>(null)
  const [mode, setMode] = useState<'draft' | 'sent'>('sent')

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