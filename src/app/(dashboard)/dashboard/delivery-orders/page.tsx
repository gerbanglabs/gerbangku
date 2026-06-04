'use client'
import { useEffect, useState } from 'react'
import { Plus, Eye, Truck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { deliveryOrderAPI, formatDate, type DeliveryOrder } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'

export default function DeliveryOrdersPage() {
  const { activeBusiness } = useAuth()
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params: Record<string, string> = {}
    if (status) params.status = status
    deliveryOrderAPI.list(activeBusiness.id, params)
      .then(setOrders).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, status])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Surat Jalan</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{orders.length} surat jalan</p>
        </div>
        <a href="/dashboard/delivery-orders/new" className="btn btn-primary">
          <Plus size={15} /> Buat Surat Jalan
        </a>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { val: '', label: 'Semua' },
          { val: 'draft', label: 'Draft' },
          { val: 'in_transit', label: 'Dikirim' },
          { val: 'delivered', label: 'Terkirim' },
          { val: 'returned', label: 'Retur' },
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
                <th>No. Surat Jalan</th>
                <th>Tanggal</th>
                <th>Penerima</th>
                <th>Alamat</th>
                <th>Driver</th>
                <th>Kendaraan</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => (
                  <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>
                ))}</tr>
              )) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                    <Truck size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                    Belum ada surat jalan
                  </td>
                </tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#E8640C' }}>
                    {o.do_number}
                    {o.so_number && <div style={{ fontSize: 11, color: '#9CA3AF' }}>SO: {o.so_number}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(o.delivery_date)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.customer_name}</div>
                  </td>
                  <td style={{ fontSize: 12, color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.delivery_address}
                  </td>
                  <td style={{ fontSize: 13 }}>{o.driver_name || '—'}</td>
                  <td style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>{o.vehicle_number || '—'}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <a href={`/dashboard/delivery-orders/${o.id}`} className="btn btn-ghost btn-sm">
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
