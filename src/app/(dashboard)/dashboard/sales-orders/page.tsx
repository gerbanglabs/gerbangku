'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Eye, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { salesOrderAPI, formatRupiah, formatDate, type SalesOrder } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'

export default function SalesOrdersPage() {
  const { activeBusiness } = useAuth()
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<SalesOrder | null>(null)

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params: Record<string, string> = {}
    if (status) params.status = status
    salesOrderAPI.list(activeBusiness.id, params)
      .then(setOrders).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, status])

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.grand_total, 0)
  const pending = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Order</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
            {orders.length} order • {pending} pending • {formatRupiah(totalRevenue)} total
          </p>
        </div>
        <a href="/dashboard/sales-orders/new" className="btn btn-primary">
          <Plus size={15} /> Buat SO
        </a>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['', 'draft', 'confirmed', 'processing', 'delivered', 'cancelled'].map(s => (
          <button key={s} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatus(s)}>
            {s === '' ? 'Semua' : s === 'confirmed' ? 'Dikonfirmasi' : s === 'processing' ? 'Diproses' : s === 'delivered' ? 'Terkirim' : s === 'cancelled' ? 'Dibatalkan' : s}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>No. SO</th><th>Tanggal</th><th>Pelanggan</th><th>Total</th><th>Status</th><th>Pembayaran</th><th>Sumber</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? Array(6).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>)}</tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Belum ada sales order</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#E8640C' }}>{o.so_number}</td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(o.order_date)}</td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{o.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{o.customer_phone}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(o.grand_total)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.payment_status === 'paid' ? <span className="badge badge-success">Lunas</span>
                      : o.payment_status === 'partial' ? <span className="badge badge-warning">Sebagian</span>
                      : <span className="badge badge-danger">Belum Bayar</span>}
                  </td>
                  <td>
                    <span className={`badge ${o.source === 'whatsapp' ? 'badge-success' : 'badge-neutral'}`}>
                      {o.source === 'whatsapp' ? '💬 WA' : o.source}
                    </span>
                  </td>
                  <td>
                    <a href={`/dashboard/sales-orders/${o.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
