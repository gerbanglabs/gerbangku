'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { deliveryOrderAPI, salesOrderAPI, type SalesOrderWithItems } from '@/lib/api'

export default function NewDOPage() {
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const soIdParam = searchParams.get('so_id')

  const [soData, setSOData] = useState<SalesOrderWithItems | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    so_id: soIdParam || '',
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    delivery_date: new Date().toISOString().split('T')[0],
    driver_name: '',
    driver_phone: '',
    vehicle_number: '',
    notes: '',
  })

  const [items, setItems] = useState<Array<{
    so_item_id: string; product_id: string; product_name: string
    quantity: number; unit: string; notes: string
  }>>([])

  // Load SO data if so_id provided
  useEffect(() => {
    if (!soIdParam || !activeBusiness) return
    salesOrderAPI.get(activeBusiness.id, soIdParam).then(so => {
      setSOData(so)
      setForm(f => ({
        ...f,
        customer_name: so.customer_name,
        customer_phone: so.customer_phone || '',
        delivery_address: so.customer_address || '',
      }))
      // Pre-fill items from SO (only not yet fully delivered)
      const soItems = so.items
        .filter(item => item.quantity > (item.delivered_qty || 0))
        .map(item => ({
          so_item_id: item.id,
          product_id: (item as any).product_id || '',
          product_name: item.product_name,
          quantity: item.quantity - (item.delivered_qty || 0),
          unit: item.unit,
          notes: '',
        }))
      setItems(soItems)
    }).catch(console.error)
  }, [soIdParam, activeBusiness])

  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i: number, k: string, v: any) =>
    setItems(items => items.map((item, idx) => idx !== i ? item : { ...item, [k]: v }))
  const addItem = () => setItems(i => [...i, { so_item_id: '', product_id: '', product_name: '', quantity: 1, unit: 'pcs', notes: '' }])
  const removeItem = (i: number) => setItems(items => items.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    if (!activeBusiness) return
    if (!form.customer_name || !form.delivery_address) {
      setError('Nama penerima dan alamat wajib diisi'); return
    }
    if (items.length === 0) { setError('Minimal 1 item'); return }
    setSaving(true); setError('')
    try {
      await deliveryOrderAPI.create(activeBusiness.id, {
        so_id: form.so_id || undefined,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        delivery_address: form.delivery_address,
        delivery_date: form.delivery_date,
        driver_name: form.driver_name,
        driver_phone: form.driver_phone,
        vehicle_number: form.vehicle_number,
        notes: form.notes,
        items: items.map(i => ({
          so_item_id: i.so_item_id || undefined,
          product_id: i.product_id || undefined,
          product_name: i.product_name,
          quantity: Number(i.quantity),
          unit: i.unit,
          notes: i.notes,
        })),
      })
      router.push('/dashboard/delivery-orders')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Buat Surat Jalan</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
              {soData ? `Dari SO: ${soData.so_number}` : 'Dokumen pengiriman barang'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Penerima */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Data Penerima</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Nama Penerima *</label>
              <input className="input" value={form.customer_name} onChange={e => setF('customer_name', e.target.value)} placeholder="Nama lengkap penerima" />
            </div>
            <div>
              <label className="label">No. HP Penerima</label>
              <input className="input" value={form.customer_phone} onChange={e => setF('customer_phone', e.target.value)} placeholder="08123456789" />
            </div>
            <div>
              <label className="label">Alamat Pengiriman *</label>
              <textarea className="input" rows={3} value={form.delivery_address}
                onChange={e => setF('delivery_address', e.target.value)}
                placeholder="Alamat tujuan pengiriman lengkap..."
                style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className="label">Tanggal Pengiriman</label>
              <input className="input" type="date" value={form.delivery_date} onChange={e => setF('delivery_date', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Driver */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Info Pengiriman</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Nama Driver</label>
              <input className="input" value={form.driver_name} onChange={e => setF('driver_name', e.target.value)} placeholder="Nama driver / kurir" />
            </div>
            <div>
              <label className="label">No. HP Driver</label>
              <input className="input" value={form.driver_phone} onChange={e => setF('driver_phone', e.target.value)} placeholder="08123456789" />
            </div>
            <div>
              <label className="label">No. Kendaraan</label>
              <input className="input" value={form.vehicle_number} onChange={e => setF('vehicle_number', e.target.value)} placeholder="DK 1234 AB" style={{ textTransform: 'uppercase' }} />
            </div>
            <div>
              <label className="label">Catatan</label>
              <textarea className="input" rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} placeholder="Catatan pengiriman..." style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
            Daftar Barang
            {soData && <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400, marginLeft: 8 }}>dari SO {soData.so_number}</span>}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah Barang</button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: 14 }}>
            Belum ada barang. Klik "Tambah Barang" untuk menambahkan.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: 8 }}>
              {['Nama Barang', 'Jumlah', 'Satuan', 'Keterangan', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                <div>
                  <input className="input" value={item.product_name}
                    onChange={e => setItem(i, 'product_name', e.target.value)}
                    placeholder="Nama barang..."
                    readOnly={!!item.so_item_id}
                    style={{ background: item.so_item_id ? '#F9FAFB' : '#fff' }} />
                </div>
                <input className="input" type="number" value={item.quantity}
                  onChange={e => setItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                  min={0.1} step={0.1} />
                <input className="input" value={item.unit}
                  onChange={e => setItem(i, 'unit', e.target.value)}
                  readOnly={!!item.so_item_id}
                  style={{ background: item.so_item_id ? '#F9FAFB' : '#fff' }} />
                <input className="input" value={item.notes}
                  onChange={e => setItem(i, 'notes', e.target.value)}
                  placeholder="Catatan..." />
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(i)}
                  disabled={!!item.so_item_id && items.length === 1}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0FDF4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
          📦 Total <strong>{items.length} jenis barang</strong> · Total qty: <strong>{items.reduce((s, i) => s + i.quantity, 0)}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={() => router.back()}>Batal</button>
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={saving || items.length === 0}>
          {saving ? 'Menyimpan...' : '📋 Buat Surat Jalan'}
        </button>
      </div>
    </div>
  )
}
