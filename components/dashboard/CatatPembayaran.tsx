// components/dashboard/CatatPembayaran.tsx
'use client'

import { useState } from 'react'
import type { PaymentFormData, PaymentInvoice } from '@/types'
import { paymentInvoices, paymentMethods, banks } from '@/lib/mockData'

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)
const fmtD = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '-'
const todayISO = new Date().toISOString().split('T')[0]
const today = fmtD(todayISO)

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
  redXL: '#fff5f5',
  yellow: '#d69e2e',
  yellowL: '#fffbeb',
  orange: '#c05621',
  orangeL: '#fffaf0',
}

function Tag({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: '3px 9px',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

function StatusBadge({ inv }: { inv: PaymentInvoice }) {
  const isOverdue = inv.overdue && inv.status !== 'paid'
  if (inv.status === 'paid') return <Tag bg={COLOR.greenXL} color={COLOR.green}>Lunas</Tag>
  if (isOverdue) return <Tag bg={COLOR.redXL} color={COLOR.red}>Jatuh Tempo</Tag>
  if (inv.status === 'partial') return <Tag bg={COLOR.yellowL} color={COLOR.yellow}>Sebagian</Tag>
  return <Tag bg={COLOR.blueXL} color={COLOR.blueL}>Belum Bayar</Tag>
}

function ProgressBar({
  paid,
  total,
  color,
}: {
  paid: number
  total: number
  color?: string
}) {
  const p = pct(paid, total)
  return (
    <div style={{ height: 6, background: COLOR.border, borderRadius: 99, overflow: 'hidden' }}>
      <div
        style={{
          width: p + '%',
          height: '100%',
          background: color || COLOR.greenL,
          borderRadius: 99,
          transition: 'width 0.4s',
        }}
      />
    </div>
  )
}

interface InpProps {
  label?: string
  req?: boolean
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  hint?: string
  error?: string
  prefix?: string
  suffix?: string
  readOnly?: boolean
  rows?: number
  isTextarea?: boolean
}

function Inp({
  label,
  req,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  error,
  prefix,
  suffix,
  readOnly,
  rows,
  isTextarea,
}: InpProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.gray }}>
          {label}
          {req && <span style={{ color: COLOR.red }}> *</span>}
        </label>
      )}
      {!isTextarea ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${error ? COLOR.red : COLOR.border}`,
            borderRadius: 7,
            overflow: 'hidden',
            background: readOnly ? COLOR.grayXL : COLOR.white,
          }}
        >
          {prefix && (
            <div
              style={{
                padding: '0 10px',
                fontSize: 13,
                color: COLOR.grayL,
                borderRight: `1px solid ${COLOR.border}`,
                background: COLOR.grayXL,
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {prefix}
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            style={{
              flex: 1,
              padding: '9px 11px',
              border: 'none',
              outline: 'none',
              fontSize: 13,
              color: COLOR.dark,
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />
          {suffix && (
            <div
              style={{
                padding: '0 10px',
                fontSize: 12,
                color: COLOR.grayL,
                borderLeft: `1px solid ${COLOR.border}`,
                background: COLOR.grayXL,
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {suffix}
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          style={{
            width: '100%',
            padding: '9px 11px',
            border: `1px solid ${COLOR.border}`,
            borderRadius: 7,
            fontSize: 12,
            color: COLOR.dark,
            resize: 'vertical',
            fontFamily: 'inherit',
            background: COLOR.white,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      )}
      {error && (
        <div style={{ fontSize: 11, color: COLOR.red }}>{error}</div>
      )}
      {hint && !error && <div style={{ fontSize: 11, color: COLOR.grayL }}>{hint}</div>}
    </div>
  )
}

function FormStep({ onNext }: { onNext: (data: PaymentFormData) => void }) {
  const [invId, setInvId] = useState('i1')
  const [method, setMethod] = useState<'transfer' | 'cash' | 'qris' | 'giro'>('transfer')
  const [bank, setBank] = useState('BCA')
  const [ref, setRef] = useState('')
  const [date, setDate] = useState(todayISO)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [fullPay, setFullPay] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inv = paymentInvoices.find((i) => i.id === invId)
  const sisa = inv ? inv.total - inv.paid : 0
  const amtNum = parseFloat(amount.replace(/\./g, '')) || 0

  const toggleFull = () => {
    const next = !fullPay
    setFullPay(next)
    if (next) setAmount(sisa.toString())
    else setAmount('')
  }

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setAmount(raw)
    setFullPay(parseFloat(raw) === sisa)
    setErrors({ ...errors, amount: '' })
  }

  const displayAmount = amount ? parseInt(amount).toLocaleString('id-ID') : ''

  const newPaid = inv ? inv.paid + amtNum : 0
  const newSisa = inv ? inv.total - newPaid : 0
  const newStatus: 'unpaid' | 'partial' | 'paid' = newSisa <= 0 ? 'paid' : amtNum > 0 ? 'partial' : inv?.status || 'unpaid'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!invId) e.inv = 'Pilih invoice'
    if (!amtNum || amtNum <= 0) e.amount = 'Jumlah pembayaran wajib diisi'
    if (amtNum > sisa) e.amount = `Melebihi sisa tagihan (${rp(sisa)})`
    if (method === 'transfer' && !ref.trim()) e.ref = 'Nomor referensi transfer wajib diisi'
    if (!date) e.date = 'Tanggal pembayaran wajib diisi'
    return e
  }

  const submit = () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    onNext({ inv, method, bank, ref, date, amtNum, notes, newPaid, newSisa, newStatus })
  }

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
          <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.dark }}>Catat Pembayaran</div>
          <div style={{ fontSize: 12, color: COLOR.grayL, marginTop: 2 }}>
            Rekam penerimaan pembayaran dari customer
          </div>
        </div>
        <button
          onClick={submit}
          style={{
            padding: '9px 22px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            background: COLOR.greenL,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Simpan Pembayaran →
        </button>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SEKSI 1: Pilih Invoice */}
        <div
          style={{
            background: COLOR.white,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '13px 18px',
              background: COLOR.grayXL,
              borderBottom: `1px solid ${COLOR.border}`,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.dark }}>
              Pilih Invoice
            </div>
            <div style={{ fontSize: 11, color: COLOR.grayL, marginTop: 1 }}>
              Pilih invoice yang sedang dibayarkan customer
            </div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {paymentInvoices
              .filter((i) => i.status !== 'paid')
              .map((i) => {
                const s = i.total - i.paid
                const p = pct(i.paid, i.total)
                const isOverdue = i.overdue
                return (
                  <div
                    key={i.id}
                    onClick={() => {
                      setInvId(i.id)
                      setAmount('')
                      setFullPay(false)
                      setErrors({})
                    }}
                    style={{
                      padding: '13px 16px',
                      border: `2px solid ${invId === i.id ? COLOR.greenL : COLOR.border}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: invId === i.id ? COLOR.greenXL : COLOR.white,
                      display: 'flex',
                      gap: 14,
                      alignItems: 'center',
                      transition: 'all 0.1s',
                    }}
                  >
                    {/* radio */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${invId === i.id ? COLOR.greenL : COLOR.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {invId === i.id && (
                        <div
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: '50%',
                            background: COLOR.greenL,
                          }}
                        />
                      )}
                    </div>

                    {/* info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: COLOR.blueL,
                              fontSize: 13,
                            }}
                          >
                            {i.number}
                          </span>
                          <StatusBadge inv={i} />
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: COLOR.dark,
                          }}
                        >
                          {rp(i.total)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: 12, color: COLOR.gray }}>
                          {i.customer}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: isOverdue ? COLOR.red : COLOR.grayL,
                          }}
                        >
                          Jatuh tempo: {fmtD(i.due)}
                        </div>
                      </div>
                      {i.paid > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: 11,
                              color: COLOR.grayL,
                              marginBottom: 3,
                            }}
                          >
                            <span>Terbayar {rp(i.paid)}</span>
                            <span>Sisa {rp(s)}</span>
                          </div>
                          <ProgressBar paid={i.paid} total={i.total} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            {/* invoice lunas — disabled */}
            {paymentInvoices
              .filter((i) => i.status === 'paid')
              .map((i) => (
                <div
                  key={i.id}
                  style={{
                    padding: '11px 16px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 10,
                    background: COLOR.grayXL,
                    display: 'flex',
                    gap: 14,
                    alignItems: 'center',
                    opacity: 0.5,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `1px solid ${COLOR.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: COLOR.grayL }}>
                        {i.number}
                      </span>
                      <StatusBadge inv={i} />
                    </div>
                    <div style={{ fontSize: 11, color: COLOR.grayL }}>
                      {i.customer} · Sudah lunas
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SEKSI 2 + 3 berdampingan */}
        {inv && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* SEKSI 2: Detail Pembayaran */}
            <div
              style={{
                background: COLOR.white,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLOR.dark,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${COLOR.border}`,
                }}
              >
                Detail Pembayaran
              </div>

              {/* Jumlah */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLOR.gray, display: 'block', marginBottom: 5 }}>
                  Jumlah Pembayaran <span style={{ color: COLOR.red }}>*</span>
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${errors.amount ? COLOR.red : COLOR.border}`,
                    borderRadius: 7,
                    overflow: 'hidden',
                    background: COLOR.white,
                  }}
                >
                  <div
                    style={{
                      padding: '0 12px',
                      fontSize: 13,
                      color: COLOR.grayL,
                      borderRight: `1px solid ${COLOR.border}`,
                      background: COLOR.grayXL,
                      alignSelf: 'stretch',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Rp
                  </div>
                  <input
                    type="text"
                    value={displayAmount}
                    onChange={handleAmount}
                    placeholder="0"
                    inputMode="numeric"
                    style={{
                      flex: 1,
                      padding: '10px 11px',
                      border: 'none',
                      outline: 'none',
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLOR.dark,
                      background: 'transparent',
                    }}
                  />
                </div>
                {errors.amount && (
                  <div style={{ fontSize: 11, color: COLOR.red, marginTop: 3 }}>
                    {errors.amount}
                  </div>
                )}

                {/* Bayar lunas toggle */}
                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div
                    onClick={toggleFull}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 99,
                      background: fullPay ? COLOR.greenL : COLOR.border,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: COLOR.white,
                        position: 'absolute',
                        top: 2,
                        left: fullPay ? 18 : 2,
                        transition: 'left 0.2s',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: COLOR.gray,
                      cursor: 'pointer',
                    }}
                    onClick={toggleFull}
                  >
                    Bayar lunas sekaligus ({rp(sisa)})
                  </span>
                </div>

                {/* preview sisa */}
                {amtNum > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: newSisa <= 0 ? COLOR.greenXL : COLOR.yellowL,
                      border: `1px solid ${newSisa <= 0 ? '#9ae6b4' : '#f6e05e'}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: COLOR.gray }}>Dibayar sekarang</span>
                      <span style={{ fontWeight: 700, color: COLOR.dark }}>{rp(amtNum)}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ color: COLOR.gray }}>Sisa setelah pembayaran</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: newSisa <= 0 ? COLOR.green : COLOR.yellow,
                        }}
                      >
                        {newSisa <= 0 ? 'Lunas ✓' : rp(newSisa)}
                      </span>
                    </div>
                    <ProgressBar
                      paid={newPaid}
                      total={inv.total}
                      color={newSisa <= 0 ? COLOR.greenL : COLOR.yellow}
                    />
                  </div>
                )}
              </div>

              <Inp
                label="Tanggal Pembayaran"
                req
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setErrors({ ...errors, date: '' })
                }}
                error={errors.date}
              />

              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLOR.gray,
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Metode Pembayaran <span style={{ color: COLOR.red }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {paymentMethods.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      style={{
                        padding: '10px 12px',
                        border: `1.5px solid ${method === m.id ? COLOR.blueL : COLOR.border}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: method === m.id ? COLOR.blueXL : COLOR.white,
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: method === m.id ? COLOR.blue : COLOR.dark,
                          }}
                        >
                          {m.label}
                        </div>
                        <div style={{ fontSize: 10, color: COLOR.grayL }}>
                          {m.hint}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank — hanya kalau transfer */}
              {method === 'transfer' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: COLOR.gray,
                        display: 'block',
                        marginBottom: 5,
                      }}
                    >
                      Bank Pengirim
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 11px',
                        border: `1px solid ${COLOR.border}`,
                        borderRadius: 7,
                        fontSize: 13,
                        color: COLOR.dark,
                        background: COLOR.white,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      {banks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Inp
                    label="No. Referensi Transfer"
                    req
                    placeholder="Contoh: 123456789"
                    value={ref}
                    onChange={(e) => {
                      setRef(e.target.value)
                      setErrors({ ...errors, ref: '' })
                    }}
                    error={errors.ref}
                    hint="Dari bukti transfer"
                  />
                </div>
              )}

              {method === 'giro' && (
                <Inp
                  label="Nomor Cek / Giro"
                  req
                  placeholder="No. cek atau bilyet giro"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                />
              )}
            </div>

            {/* SEKSI 3: Ringkasan Invoice + Catatan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Ringkasan Invoice */}
              <div
                style={{
                  background: COLOR.white,
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLOR.dark,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${COLOR.border}`,
                    marginBottom: 14,
                  }}
                >
                  Ringkasan Invoice
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['No. Invoice', inv.number, 'mono'],
                    ['Customer', inv.customer, ''],
                    ['Tgl Invoice', fmtD(inv.date), ''],
                    ['Jatuh Tempo', fmtD(inv.due), inv.overdue ? 'red' : ''],
                    ['Total Tagihan', rp(inv.total), 'bold'],
                    ['Sudah Dibayar', rp(inv.paid), 'green'],
                    ['Sisa Tagihan', rp(sisa), 'bold-red'],
                  ].map(([l, v, style]) => (
                    <div
                      key={l}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: COLOR.grayL }}>{l}</span>
                      <span
                        style={{
                          fontFamily:
                            style === 'mono' ? 'monospace' : 'inherit',
                          fontWeight:
                            style === 'bold' ||
                            style === 'bold-red' ||
                            style === 'green'
                              ? 700
                              : style === 'mono'
                                ? 600
                                : 400,
                          color:
                            style === 'red'
                              ? COLOR.red
                              : style === 'green'
                                ? COLOR.green
                                : style === 'bold-red'
                                  ? COLOR.red
                                  : COLOR.dark,
                          fontSize: style === 'mono' ? 12 : 13,
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}

                  {/* progress sebelum bayar */}
                  {inv.paid > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <ProgressBar paid={inv.paid} total={inv.total} />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 10,
                          color: COLOR.grayL,
                          marginTop: 3,
                        }}
                      >
                        <span>{pct(inv.paid, inv.total)}% terbayar</span>
                        <span>{pct(sisa, inv.total)}% belum</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Riwayat Pembayaran Sebelumnya */}
              {inv.paid > 0 && (
                <div
                  style={{
                    background: COLOR.white,
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 12,
                    padding: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLOR.dark,
                      marginBottom: 12,
                    }}
                  >
                    Riwayat Pembayaran
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      padding: '10px 0',
                      borderBottom: `1px solid ${COLOR.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: COLOR.greenXL,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      🏦
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.dark }}>
                        Transfer BCA
                      </div>
                      <div style={{ fontSize: 11, color: COLOR.grayL }}>
                        Ref: 987654321 · 15 Mar 2026
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: COLOR.green,
                      }}
                    >
                      {rp(inv.paid)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLOR.grayL,
                      marginTop: 8,
                      textAlign: 'center',
                    }}
                  >
                    1 pembayaran tercatat
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div
                style={{
                  background: COLOR.white,
                  border: `1px solid ${COLOR.border}`,
                  borderRadius: 12,
                  padding: 18,
                  flex: 1,
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLOR.gray,
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Catatan Internal
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Catatan untuk rekap internal (tidak terlihat customer)…"
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 7,
                    fontSize: 12,
                    color: COLOR.dark,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    background: COLOR.white,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={submit}
                style={{
                  padding: '12px',
                  width: '100%',
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 9,
                  border: 'none',
                  background: COLOR.greenL,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Simpan Pembayaran →
              </button>
            </div>
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
  data: PaymentFormData
  onBack: () => void
  onConfirm: () => void
}) {
  const { inv, method, bank, ref, date, amtNum, notes, newPaid, newSisa, newStatus } = data
  const methodObj = paymentMethods.find((m) => m.id === method)

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
            Konfirmasi Pembayaran
          </div>
          <div style={{ fontSize: 12, color: COLOR.grayL }}>
            Periksa sebelum disimpan
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
            ← Kembali
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '7px 22px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 7,
              cursor: 'pointer',
              border: 'none',
              background: COLOR.greenL,
              color: '#fff',
            }}
          >
            Konfirmasi & Simpan
          </button>
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 560, margin: '0 auto' }}>
        <div
          style={{
            background: COLOR.white,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* header */}
          <div
            style={{
              padding: '20px 24px',
              background: newSisa <= 0 ? COLOR.greenXL : COLOR.blueXL,
              borderBottom: `1px solid ${COLOR.border}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>
              {newSisa <= 0 ? '✅' : '💰'}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: COLOR.dark,
              }}
            >
              {rp(amtNum)}
            </div>
            <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 3 }}>
              {methodObj?.icon} {methodObj?.label}
              {method === 'transfer' ? ` · ${bank}` : ''}
            </div>
          </div>

          {/* detail */}
          <div
            style={{
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {[
              ['Invoice', inv?.number, 'mono'],
              ['Customer', inv?.customer, ''],
              ['Tanggal Bayar', fmtD(date), ''],
              method === 'transfer' ? ['No. Referensi', ref, 'mono'] : null,
              ['Total Invoice', inv ? rp(inv.total) : '-', ''],
              ['Sudah Dibayar', inv ? rp(inv.paid) : '-', ''],
              ['Pembayaran Ini', rp(amtNum), 'green-bold'],
              [
                'Sisa Tagihan',
                newSisa <= 0 ? 'Lunas ✓' : rp(newSisa),
                newSisa <= 0 ? 'green-bold' : 'red-bold',
              ],
            ]
              .filter(Boolean)
              .map(([l, v, st]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom: `1px solid ${COLOR.border}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: COLOR.grayL }}>{l}</span>
                  <span
                    style={{
                      fontFamily: st === 'mono' ? 'monospace' : 'inherit',
                      fontWeight: (st as string)?.includes('bold') ? 700 : 400,
                      color: (st as string)?.includes('green')
                        ? COLOR.green
                        : (st as string)?.includes('red')
                          ? COLOR.red
                          : COLOR.dark,
                      fontSize: st === 'mono' ? 12 : 13,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
          </div>

          {notes && (
            <div style={{ padding: '0 24px 20px' }}>
              <div
                style={{
                  background: COLOR.grayXL,
                  borderRadius: 7,
                  padding: '9px 12px',
                  fontSize: 12,
                  color: COLOR.grayL,
                }}
              >
                <span style={{ fontWeight: 600, color: COLOR.gray }}>
                  Catatan:{' '}
                </span>
                {notes}
              </div>
            </div>
          )}

          {newSisa <= 0 && (
            <div
              style={{
                margin: '0 24px 20px',
                padding: '10px 14px',
                background: COLOR.greenXL,
                border: `1px solid #9ae6b4`,
                borderRadius: 8,
                fontSize: 12,
                color: COLOR.green,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              🎉 Invoice {inv?.number} akan berstatus LUNAS setelah pembayaran ini
            </div>
          )}

          {newSisa > 0 && amtNum > 0 && (
            <div
              style={{
                margin: '0 24px 20px',
                padding: '10px 14px',
                background: COLOR.yellowL,
                border: `1px solid #f6e05e`,
                borderRadius: 8,
                fontSize: 12,
                color: COLOR.yellow,
              }}
            >
              Masih ada sisa {rp(newSisa)} yang belum dibayar.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DoneStep({
  data,
  onReset,
  onNew,
}: {
  data: PaymentFormData
  onReset: () => void
  onNew: () => void
}) {
  const { inv, amtNum, newSisa, method } = data
  const methodObj = paymentMethods.find((m) => m.id === method)
  const isLunas = newSisa <= 0

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
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: isLunas ? COLOR.greenXL : COLOR.blueXL,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
        }}
      >
        {isLunas ? '✅' : '💰'}
      </div>

      <div style={{ fontSize: 20, fontWeight: 700, color: COLOR.dark }}>
        Pembayaran Berhasil Dicatat!
      </div>
      <div style={{ fontSize: 15, color: COLOR.gray }}>
        {rp(amtNum)} · {methodObj?.icon} {methodObj?.label}
      </div>

      {/* status invoice */}
      <div
        style={{
          background: isLunas ? COLOR.greenXL : COLOR.blueXL,
          border: `1px solid ${isLunas ? '#9ae6b4' : '#bee3f8'}`,
          borderRadius: 12,
          padding: '16px 28px',
          minWidth: 340,
        }}
      >
        <div style={{ fontSize: 12, color: COLOR.grayL, marginBottom: 4 }}>
          Status Invoice {inv?.number}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: isLunas ? COLOR.green : COLOR.blue,
          }}
        >
          {isLunas ? '✓ LUNAS' : 'Sebagian Terbayar'}
        </div>
        {!isLunas && (
          <div style={{ fontSize: 13, color: COLOR.grayL, marginTop: 4 }}>
            Sisa {rp(newSisa)} belum dibayar
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <ProgressBar
            paid={(inv?.paid || 0) + amtNum}
            total={inv?.total || 0}
            color={isLunas ? COLOR.greenL : COLOR.blueL}
          />
          <div
            style={{
              fontSize: 11,
              color: COLOR.grayL,
              marginTop: 3,
              textAlign: 'right',
            }}
          >
            {pct((inv?.paid || 0) + amtNum, inv?.total || 0)}% terbayar
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 8,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {[
          ['Cetak Kwitansi', COLOR.white, null],
          ['Kirim WA ke Customer', COLOR.white, null],
          isLunas
            ? ['Buat Faktur Pajak', COLOR.white, null]
            : ['Catat Cicilan Berikutnya', COLOR.white, onNew],
          ['Catat Pembayaran Lain', COLOR.greenL, onReset],
        ].map(([l, bg, fn]) => (
          <button
            key={l}
            onClick={fn as any}
            style={{
              padding: '10px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 8,
              cursor: 'pointer',
              border: `1px solid ${bg === COLOR.greenL ? COLOR.greenL : COLOR.border}`,
              background: bg,
              color: bg === COLOR.greenL ? '#fff' : COLOR.gray,
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CatatPembayaranComponent() {
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form')
  const [payload, setPayload] = useState<PaymentFormData | null>(null)

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
      onNew={() => {
        setPayload(null)
        setStep('form')
      }}
    />
  )
}