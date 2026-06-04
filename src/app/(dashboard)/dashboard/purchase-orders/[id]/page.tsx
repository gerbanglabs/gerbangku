'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, Package, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { purchaseOrderAPI, paymentAPI, formatRupiah, formatDate } from '@/lib/api'
import { Modal, StatusBadge } from '@/components/ui/Modal'
import { PaymentModal } from '@/components/ui/PaymentModal'
import { PrintStyles } from '@/components/ui/PrintButton'

export default function PODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [po, setPO] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [receiveQtys, setReceiveQtys] = useState<Record<string, number>>({})

  const load = async () => {
    if (!activeBusiness) return
    setLoading(true)
    try {
      const data = await purchaseOrderAPI.get(activeBusiness.id, id)
      setPO(data)
      // Init receive qtys
      const qtys: Record<string, number> = {}
      data.items?.forEach((item: any) => {
        qtys[item.id] = item.quantity - (item.received_qty || 0)
      })
      setReceiveQtys(qtys)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [activeBusiness, id])

  const handleUpdateStatus = async (status: string) => {
    if (!activeBusiness || !confirm(`Ubah status ke "${status}"?`)) return
    await purchaseOrderAPI.updateStatus(activeBusiness.id, id, status)
    load()
  }

  const handleReceive = async () => {
    if (!activeBusiness) return
    const items = Object.entries(receiveQtys)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, received_qty]) => ({ item_id: itemId, received_qty }))
    if (items.length === 0) { alert('Masukkan jumlah diterima'); return }
    await purchaseOrderAPI.receiveItems(activeBusiness.id, id, items)
    setShowReceive(false)
    load()
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Memuat...</div>
  if (!po) return <div style={{ padding: 40 }}>PO tidak ditemukan</div>

  const outstanding = (po.grand_total || 0) - (po.paid_amount || 0)

  return (
    <div>
      <PrintStyles />
      <div className="page-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">{po.po_number}</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
              {po.order_date && formatDate(po.order_date)} · {po.supplier_name || 'Tanpa Supplier'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {po.status !== 'received' && po.status !== 'cancelled' && (
            <button className="btn btn-primary" onClick={() => setShowReceive(true)}>
              <Package size={15} /> Terima Barang
            </button>
          )}
          {outstanding > 0 && (
            <button className="btn btn-secondary" onClick={() => setShowPayment(true)}>
              💰 Catat Bayar
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Cetak
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['draft','sent','partial','received','cancelled'].map(s => (
          <button key={s}
            className={`btn btn-sm ${po.status === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => po.status !== s && handleUpdateStatus(s)}
            disabled={po.status === s}>
            {s === 'draft' ? 'Draft' : s === 'sent' ? '📤 Dikirim' : s === 'partial' ? '📦 Sebagian' : s === 'received' ? '✅ Diterima' : '❌ Batal'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Info Supplier</h3>
          {[
            { label: 'Supplier', value: po.supplier_name || '—' },
            { label: 'Tgl. Order', value: po.order_date ? formatDate(po.order_date) : '—' },
            { label: 'Est. Tiba', value: po.expected_date ? formatDate(po.expected_date) : '—' },
            { label: 'Status', value: <StatusBadge status={po.status || 'draft'} /> },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14, alignItems: 'center' }}>
              <span style={{ color: '#6B7280', minWidth: 80 }}>{r.label}</span>
              <span style={{ fontWeight: 500 }}>{r.value as any}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Ringkasan Pembayaran</h3>
          {[
            { label: 'Subtotal', value: formatRupiah(po.subtotal || 0) },
            { label: 'Diskon', value: `-${formatRupiah(po.discount_amount || 0)}` },
            { label: 'Pajak', value: formatRupiah(po.tax_amount || 0) },
            { label: 'Ongkir', value: formatRupiah(po.shipping_cost || 0) },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: '#6B7280' }}>{r.label}</span>
              <span>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16 }}>
            <span>Total PO</span>
            <span style={{ color: '#E8640C' }}>{formatRupiah(po.grand_total || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#10B981', fontWeight: 600 }}>
            <span>Sudah Dibayar</span>
            <span>{formatRupiah(po.paid_amount || 0)}</span>
          </div>
          {outstanding > 0 && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: '#991B1B' }}>Outstanding</span>
              <span style={{ color: '#EF4444' }}>{formatRupiah(outstanding)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14 }}>
          Daftar Item
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Produk</th><th>Qty Order</th><th>Diterima</th><th>Sisa</th><th>Harga</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {(po.items || []).map((item: any, i: number) => {
                const remaining = item.quantity - (item.received_qty || 0)
                return (
                  <tr key={item.id}>
                    <td style={{ color: '#9CA3AF' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>
                      <span className={`badge ${item.received_qty >= item.quantity ? 'badge-success' : item.received_qty > 0 ? 'badge-warning' : 'badge-neutral'}`}>
                        {item.received_qty || 0} {item.unit}
                      </span>
                    </td>
                    <td style={{ color: remaining > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                      {remaining > 0 ? `${remaining} ${item.unit}` : '✅ Lengkap'}
                    </td>
                    <td>{formatRupiah(item.unit_price)}</td>
                    <td style={{ fontWeight: 600 }}>{formatRupiah(item.subtotal)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {po.notes && (
        <div className="card" style={{ padding: 14, fontSize: 13 }}>
          📝 <span style={{ color: '#6B7280' }}>Catatan:</span> {po.notes}
        </div>
      )}

      {/* Receive Modal */}
      {showReceive && (
        <Modal title="Terima Barang" onClose={() => setShowReceive(false)} maxWidth={520}>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
            Masukkan jumlah barang yang diterima untuk setiap item:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {(po.items || []).map((item: any) => {
              const remaining = item.quantity - (item.received_qty || 0)
              if (remaining <= 0) return null
              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center', padding: '10px 14px', background: '#F9FAFB', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product_name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>
                      Sisa: {remaining} {item.unit}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      className="input"
                      type="number"
                      style={{ width: 90, textAlign: 'center' }}
                      value={receiveQtys[item.id] || 0}
                      onChange={e => setReceiveQtys(q => ({ ...q, [item.id]: Math.min(parseFloat(e.target.value) || 0, remaining) }))}
                      min={0} max={remaining} step={0.1}
                    />
                    <span style={{ fontSize: 13, color: '#6B7280', flexShrink: 0 }}>{item.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setShowReceive(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleReceive}>
              <CheckCircle size={15} /> Konfirmasi Penerimaan
            </button>
          </div>
        </Modal>
      )}

      {showPayment && (
        <PaymentModal
          businessId={activeBusiness?.id || ''}
          referenceType="sales_order"
          referenceId={id}
          referenceNumber={po.po_number}
          outstanding={outstanding}
          onClose={() => setShowPayment(false)}
          onSaved={() => { setShowPayment(false); load() }}
        />
      )}
    </div>
  )
}
