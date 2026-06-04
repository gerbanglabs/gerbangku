'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { salesOrderAPI, productAPI, customerAPI, formatRupiah, type Product, type Customer } from '@/lib/api'

export default function NewSOPage() {
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    customer_address: '', customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    tax_type: 'none', tax_rate: 11,
    shipping_cost: 0, discount_amount: 0,
    payment_method: 'transfer', payment_term: 0,
    source: 'manual', notes: '',
  })
  const [items, setItems] = useState([{ product_id: '', product_name: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_pct: 0 }])

  useEffect(() => {
    if (!activeBusiness) return
    Promise.all([
      productAPI.list(activeBusiness.id),
      customerAPI.list(activeBusiness.id),
    ]).then(([prods, custs]) => {
      const list = Array.isArray(prods) ? prods : (prods as any).data || []
      setProducts(list)
      setCustomers(custs)
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
          updated.unit_price = prod.price
          updated.unit = prod.unit
        }
      }
      return updated
    }))
  }

  const addItem = () => setItems(i => [...i, { product_id: '', product_name: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_pct: 0 }])
  const removeItem = (i: number) => setItems(items => items.filter((_, idx) => idx !== i))

  const selectCustomer = (id: string) => {
    const c = customers.find(c => c.id === id)
    if (c) setForm(f => ({ ...f, customer_id: c.id, customer_name: c.name, customer_phone: c.phone, customer_email: c.email, customer_address: c.address, payment_term: c.payment_term }))
  }

  // Totals
  const subtotal = items.reduce((s, item) => {
    const raw = item.quantity * item.unit_price
    const disc = raw * (item.discount_pct / 100)
    return s + (raw - disc)
  }, 0)
  const afterDisc = subtotal - form.discount_amount
  const taxAmt = form.tax_type === 'ppn' ? afterDisc * form.tax_rate / 100 : 0
  const grandTotal = afterDisc + taxAmt + form.shipping_cost

  const handleSubmit = async () => {
    if (!activeBusiness) return
    if (!form.customer_name) { setError('Nama pelanggan wajib diisi'); return }
    if (items.length === 0 || items.some(i => !i.product_name || i.quantity <= 0)) {
      setError('Minimal 1 item dengan nama dan qty valid'); return
    }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        shipping_cost: Number(form.shipping_cost),
        discount_amount: Number(form.discount_amount),
        payment_term: Number(form.payment_term),
        tax_rate: form.tax_type === 'ppn' ? form.tax_rate : 0,
        items: items.map(i => ({
          product_id: i.product_id || undefined,
          product_name: i.product_name,
          quantity: Number(i.quantity),
          unit: i.unit,
          unit_price: Number(i.unit_price),
          discount_pct: Number(i.discount_pct),
        })),
      }
      await salesOrderAPI.create(activeBusiness.id, payload)
      router.push('/dashboard/sales-orders')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Buat Sales Order</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Isi detail pesanan pelanggan</p>
          </div>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Customer Info */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Data Pelanggan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Pilih Pelanggan</label>
              <select className="input" value={form.customer_id} onChange={e => selectCustomer(e.target.value)}>
                <option value="">— Pelanggan Baru —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nama *</label>
              <input className="input" value={form.customer_name} onChange={e => setF('customer_name', e.target.value)} placeholder="Nama pelanggan" />
            </div>
            <div>
              <label className="label">No. HP</label>
              <input className="input" value={form.customer_phone} onChange={e => setF('customer_phone', e.target.value)} placeholder="08123456789" />
            </div>
            <div>
              <label className="label">Alamat Pengiriman</label>
              <textarea className="input" rows={2} value={form.customer_address} onChange={e => setF('customer_address', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Info Order</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Tanggal Order</label>
              <input className="input" type="date" value={form.order_date} onChange={e => setF('order_date', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="label">Metode Bayar</label>
                <select className="input" value={form.payment_method} onChange={e => setF('payment_method', e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                  <option value="qris">QRIS</option>
                  <option value="tempo">Tempo</option>
                </select>
              </div>
              <div>
                <label className="label">Tempo (hari)</label>
                <input className="input" type="number" value={form.payment_term} onChange={e => setF('payment_term', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Sumber Order</label>
              <select className="input" value={form.source} onChange={e => setF('source', e.target.value)}>
                <option value="manual">Manual</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="web">Web</option>
              </select>
            </div>
            <div>
              <label className="label">Catatan</label>
              <input className="input" value={form.notes} onChange={e => setF('notes', e.target.value)} placeholder="Catatan tambahan..." />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Item Pesanan</h3>
          <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah Item</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
              <div>
                {i === 0 && <label className="label">Produk</label>}
                <select className="input" value={item.product_id} onChange={e => setItem(i, 'product_id', e.target.value)}>
                  <option value="">— Pilih/Ketik —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {!item.product_id && <input className="input" style={{ marginTop: 4 }} value={item.product_name} onChange={e => setItem(i, 'product_name', e.target.value)} placeholder="Atau ketik nama..." />}
              </div>
              <div>
                {i === 0 && <label className="label">Qty</label>}
                <input className="input" type="number" value={item.quantity} onChange={e => setItem(i, 'quantity', parseFloat(e.target.value))} min={0} />
              </div>
              <div>
                {i === 0 && <label className="label">Satuan</label>}
                <input className="input" value={item.unit} onChange={e => setItem(i, 'unit', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label className="label">Harga</label>}
                <input className="input" type="number" value={item.unit_price} onChange={e => setItem(i, 'unit_price', parseFloat(e.target.value))} />
              </div>
              <div>
                {i === 0 && <label className="label">Diskon %</label>}
                <input className="input" type="number" value={item.discount_pct} onChange={e => setItem(i, 'discount_pct', parseFloat(e.target.value))} min={0} max={100} />
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

      {/* Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>PPN & Biaya</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Tipe Pajak</label>
              <select className="input" value={form.tax_type} onChange={e => setF('tax_type', e.target.value)}>
                <option value="none">Tanpa PPN</option>
                <option value="ppn">PPN {form.tax_rate}%</option>
              </select>
            </div>
            <div>
              <label className="label">Diskon Order (Rp)</label>
              <input className="input" type="number" value={form.discount_amount} onChange={e => setF('discount_amount', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Ongkos Kirim (Rp)</label>
              <input className="input" type="number" value={form.shipping_cost} onChange={e => setF('shipping_cost', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Ringkasan</h3>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: `Diskon`, value: -form.discount_amount },
            ...(form.tax_type === 'ppn' ? [{ label: `PPN ${form.tax_rate}%`, value: taxAmt }] : []),
            { label: 'Ongkir', value: form.shipping_cost },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
              <span style={{ color: '#6B7280' }}>{row.label}</span>
              <span style={{ color: row.value < 0 ? '#EF4444' : '#111827' }}>{formatRupiah(Math.abs(row.value))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 16, fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: '#E8640C' }}>{formatRupiah(grandTotal)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Menyimpan...' : '✅ Buat Sales Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
