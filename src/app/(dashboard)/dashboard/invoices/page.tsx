'use client'
import { useEffect, useState } from 'react'
import { Plus, Eye, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { invoiceAPI, formatRupiah, formatDate, type Invoice, type ARAgingData } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'

export default function InvoicesPage() {
  const { activeBusiness } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [aging, setAging] = useState<ARAgingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [tab, setTab] = useState<'list' | 'aging'>('list')

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params: Record<string, string> = {}
    if (status) params.status = status
    Promise.all([
      invoiceAPI.list(activeBusiness.id, params),
      invoiceAPI.getARAgeing(activeBusiness.id)
    ]).then(([invs, ar]) => {
      setInvoices(invs)
      setAging(ar)
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, status])

  const unpaidTotal = invoices
    .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((s, i) => s + (i.grand_total - i.paid_amount), 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoice</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
            {invoices.length} invoice • Piutang: <strong style={{ color: '#EF4444' }}>{formatRupiah(unpaidTotal)}</strong>
          </p>
        </div>
        <a href="/dashboard/invoices/new" className="btn btn-primary">
          <Plus size={15} /> Buat Invoice
        </a>
      </div>

      {/* Aging Summary Cards */}
      {aging && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Belum Jatuh Tempo', key: 'current', color: '#10B981', bg: '#D1FAE5' },
            { label: '1-30 Hari', key: '1-30', color: '#F59E0B', bg: '#FEF3C7' },
            { label: '31-60 Hari', key: '31-60', color: '#F97316', bg: '#FFEDD5' },
            { label: '61-90 Hari', key: '61-90', color: '#EF4444', bg: '#FEE2E2' },
            { label: '> 90 Hari', key: '>90', color: '#991B1B', bg: '#FEE2E2' },
          ].map(item => (
            <div key={item.key} className="stat-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>
                {formatRupiah(aging.summary[item.key] || 0)}
              </div>
              <div style={{ height: 3, background: item.bg, borderRadius: 99, marginTop: 6 }}>
                <div style={{
                  height: '100%', borderRadius: 99, background: item.color,
                  width: aging.summary[item.key] ? '70%' : '0%',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        <button className={`btn btn-sm ${tab === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('list')}>Daftar Invoice</button>
        <button className={`btn btn-sm ${tab === 'aging' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('aging')}>
          <AlertCircle size={13} /> AR Aging
        </button>
      </div>

      {tab === 'list' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['', 'draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled'].map(s => (
              <button key={s} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatus(s)}>
                {s === '' ? 'Semua' : s === 'sent' ? 'Terkirim' : s === 'partial' ? 'Sebagian' : s === 'paid' ? 'Lunas' : s === 'overdue' ? 'Jatuh Tempo' : s === 'cancelled' ? 'Batal' : s}
              </button>
            ))}
          </div>
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>No. Invoice</th><th>Tanggal</th><th>Jatuh Tempo</th><th>Pelanggan</th><th>Total</th><th>Dibayar</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {loading ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>)}</tr>
                  )) : invoices.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Belum ada invoice</td></tr>
                  ) : invoices.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#E8640C' }}>{inv.invoice_number}</td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(inv.invoice_date)}</td>
                      <td style={{ fontSize: 13, color: inv.due_date && new Date(inv.due_date) < new Date() && inv.status !== 'paid' ? '#EF4444' : '#6B7280' }}>
                        {inv.due_date ? formatDate(inv.due_date) : '—'}
                      </td>
                      <td style={{ fontWeight: 500 }}>{inv.customer_name}</td>
                      <td style={{ fontWeight: 600 }}>{formatRupiah(inv.grand_total)}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{formatRupiah(inv.paid_amount)}</div>
                        {inv.paid_amount < inv.grand_total && (
                          <div style={{ fontSize: 11, color: '#EF4444' }}>
                            Sisa: {formatRupiah(inv.grand_total - inv.paid_amount)}
                          </div>
                        )}
                      </td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td><a href={`/dashboard/invoices/${inv.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'aging' && aging && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>No. Invoice</th><th>Pelanggan</th><th>Jatuh Tempo</th><th>Outstanding</th><th>Hari Telat</th><th>Bucket</th></tr>
              </thead>
              <tbody>
                {aging.items.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Tidak ada piutang</td></tr>
                ) : aging.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#E8640C', fontWeight: 600 }}>{item.invoice_number}</td>
                    <td style={{ fontWeight: 500 }}>{item.customer_name}</td>
                    <td style={{ fontSize: 13, color: '#6B7280' }}>{item.due_date ? formatDate(item.due_date) : '—'}</td>
                    <td style={{ fontWeight: 700, color: '#EF4444' }}>{formatRupiah(item.outstanding)}</td>
                    <td style={{ fontSize: 13 }}>{item.days_overdue > 0 ? `${item.days_overdue} hari` : '—'}</td>
                    <td>
                      <span className={`badge ${item.aging_bucket === 'current' ? 'badge-success' : item.aging_bucket === '1-30' ? 'badge-warning' : 'badge-danger'}`}>
                        {item.aging_bucket === 'current' ? 'Belum JT' : item.aging_bucket}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
