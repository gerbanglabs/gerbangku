'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, CreditCard, Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { invoiceAPI, formatRupiah, formatDate, type InvoiceWithItems } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'
import { PaymentModal } from '@/components/ui/PaymentModal'
import { PrintStyles } from '@/components/ui/PrintButton'

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  const load = async () => {
    if (!activeBusiness) return
    setLoading(true)
    try { setInvoice(await invoiceAPI.get(activeBusiness.id, id)) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [activeBusiness, id])

  const handleStatusUpdate = async (status: string) => {
    if (!activeBusiness) return
    await invoiceAPI.updateStatus(activeBusiness.id, id, status)
    load()
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Memuat...</div>
  if (!invoice) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Invoice tidak ditemukan</div>

  const outstanding = invoice.grand_total - invoice.paid_amount
  const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== 'paid'

  return (
    <div className="print-page">
      <PrintStyles />

      {/* Header */}
      <div className="page-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">{invoice.invoice_number}</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
              {formatDate(invoice.invoice_date)} · {invoice.customer_name}
              {isOverdue && <span style={{ color: '#EF4444', marginLeft: 8 }}>⚠️ Jatuh Tempo</span>}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {outstanding > 0 && (
            <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
              <CreditCard size={15} /> Catat Bayar
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Cetak / PDF
          </button>
        </div>
      </div>

      {/* Status actions */}
      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['draft','sent','partial','paid','overdue','cancelled'].map(s => (
          <button key={s}
            className={`btn btn-sm ${invoice.status === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => invoice.status !== s && handleStatusUpdate(s)}
            disabled={invoice.status === s}
          >
            {s === 'draft' ? 'Draft' : s === 'sent' ? '📤 Terkirim' : s === 'partial' ? '🔶 Sebagian' : s === 'paid' ? '✅ Lunas' : s === 'overdue' ? '⏰ Jatuh Tempo' : '❌ Batal'}
          </button>
        ))}
      </div>

      {/* Print header */}
      <div style={{ display: 'none' }} className="print-only">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #111827' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>INVOICE</h1>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{invoice.invoice_number}</div>
            {invoice.faktur_pajak && <div style={{ fontSize: 13, color: '#6B7280' }}>Faktur Pajak: {invoice.faktur_pajak}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#6B7280' }}>Tanggal: {formatDate(invoice.invoice_date)}</div>
            {invoice.due_date && <div style={{ fontSize: 13, color: '#6B7280' }}>Jatuh Tempo: {formatDate(invoice.due_date)}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Tagihan Kepada</h3>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{invoice.customer_name}</div>
          {invoice.customer_npwp && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>NPWP: {invoice.customer_npwp}</div>}
          {invoice.customer_address && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{invoice.customer_address}</div>}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Detail Invoice</h3>
          {[
            { label: 'Status', value: <StatusBadge status={invoice.status} /> },
            { label: 'Tgl Invoice', value: formatDate(invoice.invoice_date) },
            ...(invoice.due_date ? [{ label: 'Jatuh Tempo', value: formatDate(invoice.due_date) }] : []),
            { label: 'Metode Bayar', value: invoice.payment_method || '—' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: '#6B7280', minWidth: 80 }}>{r.label}</span>
              <span style={{ fontWeight: 500 }}>{r.value as any}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>#</th><th>Item</th><th>Qty</th><th>Harga Satuan</th><th>Diskon</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id}>
                  <td style={{ color: '#9CA3AF', width: 32 }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                    {item.description && <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.description}</div>}
                  </td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{formatRupiah(item.unit_price)}</td>
                  <td style={{ color: '#EF4444' }}>{item.discount_amount > 0 ? `-${formatRupiah(item.discount_amount)}` : '—'}</td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 300 }}>
            {[
              { label: 'Subtotal', value: invoice.subtotal },
              { label: 'Diskon', value: -invoice.discount_amount },
              ...(invoice.tax_amount > 0 ? [{ label: `PPN (${invoice.tax_rate}%)`, value: invoice.tax_amount }] : []),
              ...(invoice.additional_charges > 0 ? [{ label: 'Biaya Tambahan', value: invoice.additional_charges }] : []),
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>{r.label}</span>
                <span style={{ color: r.value < 0 ? '#EF4444' : '#111827' }}>{formatRupiah(Math.abs(r.value))}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 17 }}>
              <span>TOTAL</span>
              <span style={{ color: '#E8640C' }}>{formatRupiah(invoice.grand_total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
              <span style={{ color: '#6B7280' }}>Sudah Dibayar</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>{formatRupiah(invoice.paid_amount)}</span>
            </div>
            {outstanding > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#FEF2F2', borderRadius: 8, marginTop: 8 }}>
                <span style={{ color: '#991B1B', fontWeight: 700 }}>OUTSTANDING</span>
                <span style={{ color: '#EF4444', fontWeight: 800, fontSize: 16 }}>{formatRupiah(outstanding)}</span>
              </div>
            )}
            {outstanding <= 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', background: '#F0FDF4', borderRadius: 8, marginTop: 8, color: '#16A34A', fontWeight: 700 }}>
                ✅ LUNAS
              </div>
            )}
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>📝 Catatan: </span>
          <span style={{ fontSize: 13 }}>{invoice.notes}</span>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          businessId={activeBusiness?.id || ''}
          referenceType="invoice"
          referenceId={id}
          referenceNumber={invoice.invoice_number}
          outstanding={outstanding}
          onClose={() => setShowPayment(false)}
          onSaved={() => { setShowPayment(false); load() }}
        />
      )}
    </div>
  )
}
