'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, CreditCard, Truck, CheckCircle, XCircle, Package } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { salesOrderAPI, deliveryOrderAPI, formatRupiah, formatDate, type SalesOrderWithItems, type DeliveryOrder } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'
import { PaymentModal } from '@/components/ui/PaymentModal'
import { PrintStyles } from '@/components/ui/PrintButton'

export default function SODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [so, setSO] = useState<SalesOrderWithItems | null>(null)
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  const load = async () => {
    if (!activeBusiness) return
    setLoading(true)
    try {
      const [soData, doData] = await Promise.all([
        salesOrderAPI.get(activeBusiness.id, id),
        deliveryOrderAPI.list(activeBusiness.id, { status: '' }),
      ])
      setSO(soData)
      setDeliveries(doData.filter((d: DeliveryOrder) => (d as any).so_id === id))
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [activeBusiness, id])

  const handleStatusUpdate = async (status: string) => {
    if (!activeBusiness || !confirm(`Ubah status ke "${status}"?`)) return
    await salesOrderAPI.updateStatus(activeBusiness.id, id, status)
    load()
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Memuat...</div>
  if (!so) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>SO tidak ditemukan</div>

  const outstanding = so.grand_total - so.paid_amount

  return (
    <div className="print-page">
      <PrintStyles />

      {/* Header */}
      <div className="page-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">{so.so_number}</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
              {formatDate(so.order_date)} · {so.customer_name}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {outstanding > 0 && (
            <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
              <CreditCard size={15} /> Catat Bayar
            </button>
          )}
          <a href={`/dashboard/delivery-orders/new?so_id=${id}`} className="btn btn-secondary">
            <Truck size={15} /> Buat Surat Jalan
          </a>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Cetak
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['confirmed', 'processing', 'delivered', 'cancelled'].map(s => (
          <button key={s}
            className={`btn btn-sm ${so.status === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => so.status !== s && handleStatusUpdate(s)}
            disabled={so.status === s}
          >
            {s === 'confirmed' ? '✅ Dikonfirmasi' : s === 'processing' ? '⚙️ Diproses' : s === 'delivered' ? '📦 Terkirim' : '❌ Batal'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Customer Info */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Info Pelanggan</h3>
          {[
            { label: 'Nama', value: so.customer_name },
            { label: 'No. HP', value: so.customer_phone || '—' },
            { label: 'Email', value: so.customer_email || '—' },
            { label: 'Alamat', value: so.customer_address || '—' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#6B7280', minWidth: 60 }}>{r.label}</span>
              <span style={{ fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Order Info */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Info Order</h3>
          {[
            { label: 'Status', value: <StatusBadge status={so.status} /> },
            { label: 'Tgl Order', value: formatDate(so.order_date) },
            { label: 'Pembayaran', value: <StatusBadge status={so.payment_status} /> },
            { label: 'Metode', value: so.payment_method || '—' },
            { label: 'Sumber', value: so.source },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14, alignItems: 'center' }}>
              <span style={{ color: '#6B7280', minWidth: 80 }}>{r.label}</span>
              <span style={{ fontWeight: 500 }}>{r.value as any}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14 }}>
          Item Pesanan
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Diskon</th><th>Subtotal</th><th>Terkirim</th></tr>
            </thead>
            <tbody>
              {so.items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.product_name}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{formatRupiah(item.unit_price)}</td>
                  <td style={{ color: '#EF4444' }}>{item.discount_amount > 0 ? `-${formatRupiah(item.discount_amount)}` : '—'}</td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(item.subtotal)}</td>
                  <td>
                    {item.delivered_qty > 0
                      ? <span className="badge badge-success">{item.delivered_qty} {item.unit}</span>
                      : <span className="badge badge-neutral">Belum</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 280 }}>
            {[
              { label: 'Subtotal', value: so.subtotal },
              { label: 'Diskon', value: -so.discount_amount },
              ...(so.tax_amount > 0 ? [{ label: `PPN (${so.tax_rate}%)`, value: so.tax_amount }] : []),
              ...(so.shipping_cost > 0 ? [{ label: 'Ongkir', value: so.shipping_cost }] : []),
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>{r.label}</span>
                <span style={{ color: r.value < 0 ? '#EF4444' : '#111827' }}>{formatRupiah(Math.abs(r.value))}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16 }}>
              <span>Total</span>
              <span style={{ color: '#E8640C' }}>{formatRupiah(so.grand_total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
              <span style={{ color: '#6B7280' }}>Sudah Dibayar</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>{formatRupiah(so.paid_amount)}</span>
            </div>
            {outstanding > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FEF2F2', borderRadius: 8, marginTop: 6 }}>
                <span style={{ color: '#991B1B', fontWeight: 600 }}>Outstanding</span>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>{formatRupiah(outstanding)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Orders */}
      {deliveries.length > 0 && (
        <div className="card no-print" style={{ marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14 }}>
            Surat Jalan Terkait
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>No. SJ</th><th>Tanggal</th><th>Driver</th><th>Kendaraan</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#E8640C', fontWeight: 600 }}>{d.do_number}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(d.delivery_date)}</td>
                    <td style={{ fontSize: 13 }}>{d.driver_name || '—'}</td>
                    <td style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>{d.vehicle_number || '—'}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td><a href={`/dashboard/delivery-orders/${d.id}`} className="btn btn-ghost btn-sm">Lihat</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {so.notes && (
        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>📝 Catatan: </span>
          <span style={{ fontSize: 13 }}>{so.notes}</span>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          businessId={activeBusiness?.id || ''}
          referenceType="sales_order"
          referenceId={id}
          referenceNumber={so.so_number}
          outstanding={outstanding}
          onClose={() => setShowPayment(false)}
          onSaved={() => { setShowPayment(false); load() }}
        />
      )}
    </div>
  )
}
