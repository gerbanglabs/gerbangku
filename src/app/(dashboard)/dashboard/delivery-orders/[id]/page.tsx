'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, CheckCircle, Truck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { deliveryOrderAPI, formatDate, type DeliveryOrderWithItems } from '@/lib/api'
import { StatusBadge } from '@/components/ui/Modal'
import { PrintStyles } from '@/components/ui/PrintButton'

export default function DODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [doData, setDOData] = useState<DeliveryOrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!activeBusiness) return
    setLoading(true)
    try { setDOData(await deliveryOrderAPI.get(activeBusiness.id, id)) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [activeBusiness, id])

  const updateStatus = async (status: string) => {
    if (!activeBusiness || !confirm(`Update status ke "${status}"?`)) return
    await deliveryOrderAPI.updateStatus(activeBusiness.id, id, status)
    load()
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Memuat...</div>
  if (!doData) return <div style={{ padding: 40 }}>Surat jalan tidak ditemukan</div>

  return (
    <div className="print-page">
      <PrintStyles />
      <style>{`
        @media print {
          .print-document { max-width: 800px; margin: 0 auto; }
          .print-document * { font-family: Arial, sans-serif !important; }
        }
      `}</style>

      {/* Actions header */}
      <div className="page-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Surat Jalan {doData.do_number}</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
              {formatDate(doData.delivery_date)} · {doData.customer_name}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {doData.status === 'draft' && (
            <button className="btn btn-primary" onClick={() => updateStatus('in_transit')}>
              <Truck size={15} /> Kirim Sekarang
            </button>
          )}
          {doData.status === 'in_transit' && (
            <button className="btn btn-primary" onClick={() => updateStatus('delivered')}>
              <CheckCircle size={15} /> Tandai Terkirim
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Cetak Surat Jalan
          </button>
        </div>
      </div>

      {/* Print Document */}
      <div className="print-document">
        {/* Print header */}
        <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #111827' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.05em' }}>SURAT JALAN</h1>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>No: {doData.do_number}</div>
          {doData.so_number && <div style={{ fontSize: 13, color: '#9CA3AF' }}>Ref SO: {doData.so_number}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Penerima</h3>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{doData.customer_name}</div>
            {doData.customer_phone && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>📱 {doData.customer_phone}</div>}
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{doData.delivery_address}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Info Pengiriman</h3>
            {[
              { label: 'Tanggal', value: formatDate(doData.delivery_date) },
              { label: 'Driver', value: doData.driver_name || '—' },
              { label: 'No. HP Driver', value: doData.driver_phone || '—' },
              { label: 'Kendaraan', value: doData.vehicle_number || '—' },
              { label: 'Status', value: <StatusBadge status={doData.status} /> },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 13, alignItems: 'center' }}>
                <span style={{ color: '#6B7280', minWidth: 80 }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value as any}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14 }}>Daftar Barang</div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>No</th><th>Nama Barang</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr>
              </thead>
              <tbody>
                {doData.items.map((item, i) => (
                  <tr key={item.id}>
                    <td style={{ color: '#9CA3AF' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                    <td style={{ fontWeight: 700, fontSize: 15 }}>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td style={{ color: '#9CA3AF', fontSize: 13 }}>{item.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 32 }}>
          {['Pengirim', 'Driver / Kurir', 'Penerima'].map(role => (
            <div key={role} style={{ textAlign: 'center', padding: '16px 12px', border: '1px dashed #D1D5DB', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 56 }}>{role}</div>
              <div style={{ borderTop: '1px solid #374151', paddingTop: 6, fontSize: 12, color: '#6B7280' }}>
                Nama & Tanda Tangan
              </div>
            </div>
          ))}
        </div>

        {doData.notes && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: '#6B7280' }}>Catatan: </span>{doData.notes}
          </div>
        )}
      </div>
    </div>
  )
}
