// components/dashboard/SOForm.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import type { Customer, Product, SORow } from '@/types'
import { customers, products, warehouses } from '@/lib/mockData'

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

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 500, color: COLOR.txtS, marginBottom: 5 }}>
      {children}
      {required && <span style={{ color: COLOR.dangerT, marginLeft: 2 }}>*</span>}
    </div>
  )
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {hint && <div style={{ fontSize: 11, color: COLOR.txtT, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function CustomerPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.code.toLowerCase().includes(q.toLowerCase()),
  )
  const selected = customers.find((c) => c.id === value)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !(ref.current as HTMLElement).contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 12px',
          border: `0.5px solid ${open ? COLOR.borderS : COLOR.border}`,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: COLOR.bg,
          fontSize: 13,
          minHeight: 36,
        }}
      >
        {selected ? (
          <div>
            <span style={{ fontWeight: 500, color: COLOR.txt }}>{selected.name}</span>
            <span style={{ color: COLOR.txtT, marginLeft: 8, fontSize: 11 }}>{selected.code}</span>
          </div>
        ) : (
          <span style={{ color: COLOR.txtT }}>Pilih customer...</span>
        )}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLOR.txtT} strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 200,
            background: COLOR.bg,
            border: `0.5px solid ${COLOR.borderS}`,
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: `0.5px solid ${COLOR.border}` }}>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau kode..."
              style={{
                width: '100%',
                fontSize: 12,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: COLOR.txt,
              }}
            />
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onChange(c.id)
                  setOpen(false)
                  setQ('')
                }}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: value === c.id ? COLOR.bgS : 'transparent',
                  borderBottom: `0.5px solid ${COLOR.border}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.txt }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: COLOR.txtT, marginLeft: 8 }}>{c.code}</span>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: COLOR.bgS, color: COLOR.txtS }}>
                    {c.type}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: COLOR.txtS, marginTop: 2 }}>
                  {c.area} · Tempo {c.payment_terms} hari · {c.price_group}
                </div>
                {c.outstanding_ar > 0 && (
                  <div style={{ fontSize: 11, color: COLOR.warningT, marginTop: 2 }}>
                    ⚠ Piutang: {rp(c.outstanding_ar)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductRow({
  row,
  priceGroup,
  onUpdate,
  onRemove,
  index,
}: {
  row: SORow
  priceGroup: string | null
  onUpdate: (data: SORow) => void
  onRemove: () => void
  index: number
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.sku.toLowerCase().includes(q.toLowerCase()) ||
      p.cat.toLowerCase().includes(q.toLowerCase()),
  )
  const selProd = products.find((p) => p.id === row.product_id)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !(ref.current as HTMLElement).contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const selectProd = (p: Product) => {
    const price = priceGroup && p.prices[priceGroup] ? p.prices[priceGroup] : p.base_price
    onUpdate({ ...row, product_id: p.id, uom: p.uom, unit_price: price, tax_rate: p.tax_rate })
    setOpen(false)
    setQ('')
  }

  const lineS = (row.qty || 0) * (row.unit_price || 0)
  const lineD = (lineS * (row.disc_pct || 0)) / 100
  const lineB = lineS - lineD
  const lineTax = (lineB * (row.tax_rate || 0)) / 100
  const lineT = lineB + lineTax

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr 80px 64px 120px 68px 64px 110px 28px',
        gap: 6,
        alignItems: 'start',
        padding: '10px 0',
        borderBottom: `0.5px solid ${COLOR.border}`,
      }}
    >
      <div style={{ fontSize: 12, color: COLOR.txtT, paddingTop: 10, textAlign: 'center' }}>{index + 1}</div>

      {/* Product picker */}
      <div ref={ref} style={{ position: 'relative' }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            padding: '7px 10px',
            border: `0.5px solid ${open ? COLOR.borderS : COLOR.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            background: COLOR.bg,
            minHeight: 34,
          }}
        >
          {selProd ? (
            <div>
              <div style={{ fontWeight: 500, color: COLOR.txt }}>{selProd.name}</div>
              <div style={{ fontSize: 10, color: COLOR.txtT, marginTop: 1 }}>
                {selProd.sku} · Stok: {selProd.stock} {selProd.uom}
              </div>
            </div>
          ) : (
            <span style={{ color: COLOR.txtT }}>Pilih produk...</span>
          )}
        </div>
        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100%+4px)',
              left: 0,
              minWidth: 320,
              zIndex: 300,
              background: COLOR.bg,
              border: `0.5px solid ${COLOR.borderS}`,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              marginTop: 4,
            }}
          >
            <div style={{ padding: '7px 10px', borderBottom: `0.5px solid ${COLOR.border}` }}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk..."
                style={{
                  width: '100%',
                  fontSize: 12,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: COLOR.txt,
                }}
              />
            </div>
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              {filtered.map((p) => {
                const price = priceGroup && p.prices[priceGroup] ? p.prices[priceGroup] : p.base_price
                return (
                  <div
                    key={p.id}
                    onClick={() => selectProd(p)}
                    style={{
                      padding: '8px 10px',
                      cursor: 'pointer',
                      background: row.product_id === p.id ? COLOR.bgS : 'transparent',
                      borderBottom: `0.5px solid ${COLOR.border}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: COLOR.txt }}>{p.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: COLOR.txt }}>
                        {rp(price)}/{p.uom}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: COLOR.txtS }}>
                        {p.cat} · {p.sku}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: p.stock <= 10 ? COLOR.warningT : COLOR.txtS,
                        }}
                      >
                        {p.stock <= 10 ? '⚠ ' : ''}Stok: {p.stock} {p.uom}
                      </span>
                      {p.tax_rate > 0 && (
                        <span style={{ fontSize: 10, color: COLOR.infoT }}>PPN {p.tax_rate}%</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Qty */}
      <input
        type="number"
        min="0.01"
        step="0.5"
        value={row.qty || ''}
        placeholder="0"
        onChange={(e) => onUpdate({ ...row, qty: parseFloat(e.target.value) || 0 })}
        style={{
          padding: '7px 8px',
          border: `0.5px solid ${COLOR.border}`,
          borderRadius: 8,
          fontSize: 12,
          width: '100%',
          textAlign: 'right',
          boxSizing: 'border-box',
        }}
      />

      {/* UOM */}
      <div
        style={{
          padding: '7px 8px',
          border: `0.5px solid ${COLOR.border}`,
          borderRadius: 8,
          fontSize: 12,
          color: COLOR.txtS,
          background: COLOR.bgS,
          textAlign: 'center',
          minHeight: 34,
        }}
      >
        {row.uom || '—'}
      </div>

      {/* Price */}
      <input
        type="number"
        min="0"
        step="1000"
        value={row.unit_price || ''}
        placeholder="0"
        onChange={(e) => onUpdate({ ...row, unit_price: parseInt(e.target.value) || 0 })}
        style={{
          padding: '7px 8px',
          border: `0.5px solid ${COLOR.border}`,
          borderRadius: 8,
          fontSize: 12,
          width: '100%',
          textAlign: 'right',
          boxSizing: 'border-box',
        }}
      />

      {/* Disc % */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={row.disc_pct || ''}
          placeholder="0"
          onChange={(e) => onUpdate({ ...row, disc_pct: parseFloat(e.target.value) || 0 })}
          style={{
            padding: '7px 6px',
            border: `0.5px solid ${COLOR.border}`,
            borderRadius: 8,
            fontSize: 12,
            width: '100%',
            textAlign: 'right',
            boxSizing: 'border-box',
          }}
        />
        <span style={{ fontSize: 11, color: COLOR.txtT }}>%</span>
      </div>

      {/* Tax */}
      <div
        style={{
          padding: '7px 8px',
          border: `0.5px solid ${COLOR.border}`,
          borderRadius: 8,
          fontSize: 12,
          color: row.tax_rate > 0 ? COLOR.infoT : COLOR.txtT,
          background: COLOR.bgS,
          textAlign: 'center',
          minHeight: 34,
        }}
      >
        {row.tax_rate > 0 ? row.tax_rate + '%' : '—'}
      </div>

      {/* Total */}
      <div
        style={{
          padding: '7px 4px 7px 8px',
          fontSize: 12,
          fontWeight: 500,
          color: COLOR.txt,
          textAlign: 'right',
          paddingTop: 10,
        }}
      >
        {lineT > 0 ? rp(lineT) : '—'}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: COLOR.dangerT,
          fontSize: 18,
          paddingTop: 8,
          lineHeight: '1',
        }}
      >
        ×
      </button>
    </div>
  )
}

export default function SOForm() {
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form')
  const soNumber = 'SO-2026-0043'

  const [form, setForm] = useState({
    customer_id: '',
    warehouse_id: 'w1',
    date: today,
    delivery_date: tomorrow,
    delivery_address: '',
    notes: '',
    internal_note: '',
    disc_global_pct: 0,
  })

  const [rows, setRows] = useState<SORow[]>([
    { id: 1, product_id: '', qty: 0, uom: '', unit_price: 0, disc_pct: 0, tax_rate: 0 },
  ])

  const cust = customers.find((c) => c.id === form.customer_id)
  const priceGroup = cust?.price_group || null

  const getDueDate = () => {
    if (!form.delivery_date || !cust) return ''
    return new Date(new Date(form.delivery_date).getTime() + cust.payment_terms * 86400000)
      .toISOString()
      .split('T')[0]
  }

  const subtotal = rows.reduce((s, r) => s + (r.qty || 0) * (r.unit_price || 0), 0)
  const discItems = rows.reduce(
    (s, r) => s + ((r.qty || 0) * (r.unit_price || 0) * (r.disc_pct || 0)) / 100,
    0,
  )
  const discGlob = (subtotal - discItems) * ((form.disc_global_pct || 0) / 100)
  const taxBase = subtotal - discItems - discGlob
  const totalTax = rows.reduce((s, r) => {
    const b = ((r.qty || 0) * (r.unit_price || 0)) * (1 - (r.disc_pct || 0) / 100)
    return s + (b * (r.tax_rate || 0)) / 100
  }, 0)
  const grandTotal = taxBase + totalTax

  const addRow = () =>
    setRows([
      ...rows,
      {
        id: Date.now(),
        product_id: '',
        qty: 0,
        uom: '',
        unit_price: 0,
        disc_pct: 0,
        tax_rate: 0,
      },
    ])
  const updRow = (id: number, d: Partial<SORow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...d } : r)))
  const delRow = (id: number) => rows.length > 1 && setRows(rows.filter((r) => r.id !== id))

  const isValid = form.customer_id && form.date && rows.some((r) => r.product_id && r.qty > 0 && r.unit_price > 0)

  if (step === 'success') {
    return (
      <div
        style={{
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
            fontSize: 26,
            color: COLOR.successT,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: COLOR.txt }}>Sales Order Berhasil Dibuat!</div>
        <div style={{ fontSize: 13, color: COLOR.txtS }}>
          No. SO:{' '}
          <span style={{ fontFamily: 'monospace', fontWeight: 500, color: COLOR.successT }}>
            {soNumber}
          </span>
        </div>
        <div style={{ fontSize: 13, color: COLOR.txtS }}>
          Customer: <strong style={{ color: COLOR.txt }}>{cust?.name}</strong> · Total:{' '}
          <strong style={{ color: COLOR.txt }}>{rp(grandTotal)}</strong>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            style={{
              padding: '8px 18px',
              fontSize: 12,
              cursor: 'pointer',
              background: COLOR.bg,
              border: `1px solid ${COLOR.border}`,
              borderRadius: 8,
            }}
            onClick={() => {
              setStep('form')
              setRows([{ id: 1, product_id: '', qty: 0, uom: '', unit_price: 0, disc_pct: 0, tax_rate: 0 }])
              setForm({
                customer_id: '',
                warehouse_id: 'w1',
                date: today,
                delivery_date: tomorrow,
                delivery_address: '',
                notes: '',
                internal_note: '',
                disc_global_pct: 0,
              })
            }}
          >
            Buat SO Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLOR.txt }}>
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: `0.5px solid ${COLOR.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: COLOR.bgS,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: COLOR.txt }}>Buat Sales Order Baru</div>
          <div style={{ fontSize: 12, color: COLOR.txtS }}>
            No. otomatis:{' '}
            <span style={{ fontFamily: 'monospace', color: COLOR.successT }}>
              {soNumber}
            </span>
          </div>
        </div>
        <button
          onClick={() => isValid && setStep('preview')}
          disabled={!isValid}
          style={{
            padding: '7px 20px',
            fontSize: 12,
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontWeight: 500,
            background: isValid ? COLOR.successT : COLOR.bgS,
            color: isValid ? COLOR.bg : COLOR.txtT,
            border: 'none',
            borderRadius: 8,
            opacity: isValid ? 1 : 0.5,
            transition: 'all 0.15s',
          }}
        >
          Preview →
        </button>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Info Order */}
        <div
          style={{
            background: COLOR.bg,
            border: `0.5px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: COLOR.txt,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `0.5px solid ${COLOR.border}`,
            }}
          >
            Info Order
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/3' }}>
              <Field label="Customer" required>
                <CustomerPicker
                  value={form.customer_id}
                  onChange={(id) => {
                    const c = customers.find((c) => c.id === id)
                    setForm({ ...form, customer_id: id, delivery_address: c?.address || '' })
                    if (c) {
                      setRows(
                        rows.map((r) => {
                          if (!r.product_id) return r
                          const p = products.find((pr) => pr.id === r.product_id)
                          if (!p) return r
                          return { ...r, unit_price: p.prices[c.price_group] || p.base_price }
                        }),
                      )
                    }
                  }}
                />
              </Field>
            </div>
            <Field label="Gudang">
              <select
                value={form.warehouse_id}
                onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
                style={{ width: '100%', fontSize: 13, padding: '8px 12px', border: `0.5px solid ${COLOR.border}`, borderRadius: 8 }}
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {cust && (
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                ['Alamat', cust.address],
                ['Grup Harga', cust.price_group],
                ['Tempo Bayar', cust.payment_terms + ' hari'],
                ['Piutang Aktif', cust.outstanding_ar > 0 ? rp(cust.outstanding_ar) : '—'],
              ].map(([l, v]) => (
                <div key={l} style={{ background: COLOR.bgS, borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: COLOR.txtT, marginBottom: 2 }}>{l}</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color:
                        l === 'Piutang Aktif' && cust.outstanding_ar > 0
                          ? COLOR.warningT
                          : COLOR.txt,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pengiriman */}
        <div
          style={{
            background: COLOR.bg,
            border: `0.5px solid ${COLOR.border}`,
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: COLOR.txt,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `0.5px solid ${COLOR.border}`,
            }}
          >
            Pengiriman
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
            <Field label="Tanggal Order" required>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{
                  width: '100%',
                  fontSize: 13,
                  padding: '8px 12px',
                  border: `0.5px solid ${COLOR.border}`,
                  borderRadius: 8,
                  boxSizing: 'border-box',
                }}
              />
            </Field>
            <Field label="Tanggal Kirim" required>
              <input
                type="date"
                value={form.delivery_date}
                min={form.date}
                onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                style={{
                  width: '100%',
                  fontSize: 13,
                  padding: '8px 12px',
                  border: `0.5px solid ${COLOR.border}`,
                  borderRadius: 8,
                  boxSizing: 'border-box',
                }}
              />
            </Field>
            <Field label="Jatuh Tempo" hint={cust ? `Tempo ${cust.payment_terms} hari` : ''}>
              <input
                type="date"
                value={getDueDate()}
                readOnly
                style={{
                  width: '100%',
                  fontSize: 13,
                  padding: '8px 12px',
                  background: COLOR.bgS,
                  border: `0.5px solid ${COLOR.border}`,
                  borderRadius: 8,
                  cursor: 'default',
                  color: COLOR.txtS,
                  boxSizing: 'border-box',
                }}
              />
            </Field>
          </div>
          <Field label="Alamat Pengiriman">
            <input
              value={form.delivery_address}
              onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
              placeholder="Alamat pengiriman lengkap..."
              style={{
                width: '100%',
                fontSize: 13,
                padding: '8px 12px',
                border: `0.5px solid ${COLOR.border}`,
                borderRadius: 8,
                boxSizing: 'border-box',
              }}
            />
          </Field>
        </div>

        {/* Produk */}
        <div
          style={{
            background: COLOR.bg,
            border: `0.5px solid ${COLOR.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `0.5px solid ${COLOR.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: COLOR.txt }}>Item Produk</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {priceGroup && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: COLOR.info,
                    color: COLOR.infoT,
                  }}
                >
                  Harga: {priceGroup}
                </span>
              )}
              <span style={{ fontSize: 11, color: COLOR.txtT }}>
                {rows.filter((r) => r.product_id).length} produk
              </span>
            </div>
          </div>

          {/* Col headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 80px 64px 120px 68px 64px 110px 28px',
              gap: 6,
              padding: '8px 18px',
              background: COLOR.bgS,
              borderBottom: `0.5px solid ${COLOR.border}`,
            }}
          >
            {['#', 'Produk', 'Qty', 'UOM', 'Harga Satuan', 'Disc %', 'Pajak', 'Total', ''].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 500, color: COLOR.txtS }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ padding: '0 18px' }}>
            {rows.map((row, i) => (
              <ProductRow
                key={row.id}
                row={row}
                index={i}
                priceGroup={priceGroup}
                onUpdate={(d) => updRow(row.id, d)}
                onRemove={() => delRow(row.id)}
              />
            ))}
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderTop: `0.5px solid ${COLOR.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={addRow}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                background: COLOR.bg,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 8,
              }}
            >
              + Tambah Produk
            </button>
            <div style={{ fontSize: 11, color: COLOR.txtT }}>
              {rows.filter((r) => r.product_id && r.qty > 0).length} item ·{' '}
              {rows.reduce((s, r) => s + (r.qty || 0), 0).toLocaleString()} unit
            </div>
          </div>
        </div>

        {/* Catatan + Total */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div
            style={{
              background: COLOR.bg,
              border: `0.5px solid ${COLOR.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: COLOR.txt,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `0.5px solid ${COLOR.border}`,
              }}
            >
              Catatan
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Catatan untuk Customer" hint="Tampil di surat jalan & invoice">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Contoh: Mohon antar sebelum jam 07:00..."
                  rows={3}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    padding: '8px 12px',
                    border: `0.5px solid ${COLOR.border}`,
                    borderRadius: 8,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </Field>
              <Field label="Catatan Internal" hint="Tidak terlihat customer">
                <textarea
                  value={form.internal_note}
                  onChange={(e) => setForm({ ...form, internal_note: e.target.value })}
                  placeholder="Catatan untuk tim internal..."
                  rows={2}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    padding: '8px 12px',
                    border: `0.5px solid ${COLOR.border}`,
                    borderRadius: 8,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </Field>
            </div>
          </div>

          {/* Ringkasan */}
          <div
            style={{
              background: COLOR.bg,
              border: `0.5px solid ${COLOR.border}`,
              borderRadius: 12,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: COLOR.txt,
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `0.5px solid ${COLOR.border}`,
              }}
            >
              Ringkasan Total
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.txtS }}>
                <span>Subtotal</span>
                <span style={{ color: COLOR.txt }}>{rp(subtotal)}</span>
              </div>
              {discItems > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.warningT }}>
                  <span>Diskon Item</span>
                  <span>−{rp(discItems)}</span>
                </div>
              )}
              {totalTax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR.infoT }}>
                  <span>PPN</span>
                  <span>{rp(totalTax)}</span>
                </div>
              )}
              <div style={{ height: '0.5px', background: COLOR.border, margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500 }}>
                <span>Grand Total</span>
                <span style={{ color: COLOR.successT }}>{rp(grandTotal)}</span>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => isValid && setStep('success')}
                disabled={!isValid}
                style={{
                  width: '100%',
                  padding: '9px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  background: isValid ? COLOR.successT : COLOR.bgS,
                  color: isValid ? COLOR.bg : COLOR.txtT,
                  border: 'none',
                  borderRadius: 8,
                  opacity: isValid ? 1 : 0.5,
                  transition: 'all 0.15s',
                }}
              >
                {isValid ? 'Buat SO →' : 'Lengkapi form dulu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}