'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { purchaseOrderAPI, supplierAPI, productAPI, formatRupiah, type Supplier, type Product } from '@/lib/api'

export default function NewPOPage() {
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    supplier_id: '', order_date: new Date().toISOString().split('T')[0],
    expected_date: '', discount_amount: 0, tax_amount: 0,
    shipping_cost: 0, payment_method: 'transfer', notes: '',
  })
  const [items, setItems] = useState([{
    product_id: '', product_name: '', quantity: 1,
    unit: 'pcs', unit_price: 0, discount_amount: 0
  }])

  useEffect(() => {
    if (!activeBusiness) return
    Promise.all([
      supplierAPI.list(activeBusiness.id),
      productAPI.list(activeBusiness.id),
    ]).then(([sups, prods]) => {
      setSuppliers(sups)
      const list = Array.isArray(prods) ? prods : (prods as any).data || []
      setProducts(list)
    })
  }, [activeBusiness])

  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i: number, k: string, v: any) => {
    setItems(items => items.map((item, idx) => {
      if (idx !== i) return item
      const updated = { ...item, [k]: v }
      if (k === 'product_id') {
        const prod = products.find(p => p.id === v)
        if (prod) {
          updated.product_name = prod.name
          updated.unit_price = prod.cost_price || 0
          updated.unit = prod.unit
        }
      }
      return updated
    }))
  }

  const addItem = () => setItems(i => [...i, { product_id: '', product_name: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_amount: 0 }])
  const removeItem = (i: number) => setItems(items => items.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((s, item) => s + (item.quantity * item.unit_price) - item.discount_amount, 0)
  const grandTotal = subtotal - form.discount_amount + form.tax_amount + form.shipping_cost

  const handleSubmit = async () => {
    if (!activeBusiness) return
    if (items.some(i => !i.product_name || i.quantity <= 0)) {
      setError('Lengkapi semua item'); return
    }
    setSaving(true); setError('')
    try {
      await purchaseOrderAPI.create(activeBusiness.id, {
        ...form,
        discount_amount: Number(form.discount_amount),
        tax_amount: Number(form.tax_amount),
        shipping_cost: Number(form.shipping_cost),
        supplier_id: form.supplier_id || undefined,
        expected_date: form.expected_date || undefined,
        items: items.map(i => ({
          product_id: i.product_id || undefined,
          product_name: i.product_name,
          quantity: Number(i.quantity),
          unit: i.unit,
          unit_price: Number(i.unit_price),
          discount_amount: Number(i.discount_amount),
        })),
      })
      router.push('/dashboard/purchase-orders')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Buat Purchase Order</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Order pembelian ke supplier</p>
          </div>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Supplier</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Pilih Supplier</label>
              <select className="input" value={form.supplier_id} onChange={e => setF('supplier_id', e.target.value)}>
                <option value="">— Pilih Supplier —</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tanggal PO</label>
              <input className="input" type="date" value={form.order_date} onChange={e => setF('order_date', e.target.value)} />
            </div>
            <div>
              <label className="label">Estimasi Tiba</label>
              <input className="input" type="date" value={form.expected_date} onChange={e => setF('expected_date', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Detail Order</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Metode Pembayaran</label>
              <select className="input" value={form.payment_method} onChange={e => setF('payment_method', e.target.value)}>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="tempo">Tempo</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="label">Diskon (Rp)</label>
                <input className="input" type="number" value={form.discount_amount} onChange={e => setF('discount_amount', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Pajak (Rp)</label>
                <input className="input" type="number" value={form.tax_amount} onChange={e => setF('tax_amount', parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <label className="label">Ongkir (Rp)</label>
              <input className="input" type="number" value={form.shipping_cost} onChange={e => setF('shipping_cost', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Catatan</label>
              <input className="input" value={form.notes} onChange={e => setF('notes', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Item Pembelian</h3>
          <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah Item</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
              <div>
                {i === 0 && <label className="label">Produk</label>}
                <select className="input" value={item.product_id} onChange={e => setItem(i, 'product_id', e.target.value)}>
                  <option value="">— Pilih / Ketik —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {!item.product_id && (
                  <input className="input" style={{ marginTop: 4 }} value={item.product_name}
                    onChange={e => setItem(i, 'product_name', e.target.value)} placeholder="Nama produk..." />
                )}
              </div>
              <div>
                {i === 0 && <label className="label">Qty</label>}
                <input className="input" type="number" value={item.quantity}
                  onChange={e => setItem(i, 'quantity', parseFloat(e.target.value))} />
              </div>
              <div>
                {i === 0 && <label className="label">Satuan</label>}
                <input className="input" value={item.unit} onChange={e => setItem(i, 'unit', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label className="label">Harga Beli</label>}
                <input className="input" type="number" value={item.unit_price}
                  onChange={e => setItem(i, 'unit_price', parseFloat(e.target.value))} />
              </div>
              <div>
                {i === 0 && <div style={{ height: 22 }} />}
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(i)} disabled={items.length === 1}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <div className="card" style={{ padding: 20, width: 320 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Ringkasan</h3>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: 'Diskon', value: -form.discount_amount },
            { label: 'Pajak', value: form.tax_amount },
            { label: 'Ongkir', value: form.shipping_cost },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: '#6B7280' }}>{row.label}</span>
              <span style={{ color: row.value < 0 ? '#EF4444' : '#111827' }}>{formatRupiah(Math.abs(row.value))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16 }}>
            <span>Total PO</span>
            <span style={{ color: '#E8640C' }}>{formatRupiah(grandTotal)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Menyimpan...' : '📦 Buat Purchase Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
