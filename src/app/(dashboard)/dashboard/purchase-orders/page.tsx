'use client'
import { useEffect, useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { purchaseOrderAPI, formatRupiah, formatDate, type PurchaseOrder } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'

export default function PurchaseOrdersPage() {
  const { activeBusiness } = useAuth()
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params: Record<string, string> = {}
    if (status) params.status = status
    purchaseOrderAPI.list(activeBusiness.id, params)
      .then(setOrders).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, status])

  const totalPending = orders.filter(o => o.status !== 'received' && o.status !== 'cancelled')
    .reduce((s, o) => s + o.grand_total, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Order</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
            {orders.length} PO · Pending: <strong style={{ color: '#F59E0B' }}>{formatRupiah(totalPending)}</strong>
          </p>
        </div>
        <a href="/dashboard/purchase-orders/new" className="btn btn-primary">
          <Plus size={15} /> Buat PO
        </a>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { val: '', label: 'Semua' },
          { val: 'draft', label: 'Draft' },
          { val: 'sent', label: 'Terkirim' },
          { val: 'partial', label: 'Sebagian' },
          { val: 'received', label: 'Diterima' },
          { val: 'cancelled', label: 'Batal' },
        ].map(s => (
          <button key={s.val}
            className={`btn btn-sm ${status === s.val ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatus(s.val)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. PO</th><th>Tanggal</th><th>Supplier</th>
                <th>Total</th><th>Status</th><th>Pembayaran</th><th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(7).fill(0).map((_, j) => (
                  <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>
                ))}</tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  Belum ada purchase order
                </td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#E8640C' }}>
                    {o.po_number}
                  </td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(o.order_date)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.supplier_name || '—'}</div>
                    {o.expected_date && (
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                        Estimasi: {formatDate(o.expected_date)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(o.grand_total)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.payment_status === 'paid'
                      ? <span className="badge badge-success">Lunas</span>
                      : o.payment_status === 'partial'
                      ? <span className="badge badge-warning">Sebagian</span>
                      : <span className="badge badge-danger">Belum</span>}
                  </td>
                  <td>
                    <a href={`/dashboard/purchase-orders/${o.id}`} className="btn btn-ghost btn-sm">
                      <Eye size={13} />
                    </a>
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
