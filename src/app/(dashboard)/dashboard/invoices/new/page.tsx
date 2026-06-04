'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { invoiceAPI, productAPI, customerAPI, formatRupiah, type Product, type Customer } from '@/lib/api'

export default function NewInvoicePage() {
  const { activeBusiness } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customer_name: '', customer_address: '', customer_npwp: '',
    customer_id: '', invoice_date: new Date().toISOString().split('T')[0],
    due_date: '', tax_type: 'none', tax_rate: 11,
    discount_amount: 0, additional_charges: 0,
    payment_method: 'transfer', notes: '', faktur_pajak: '',
  })
  const [items, setItems] = useState([{ product_id: '', product_name: '', description: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_pct: 0 }])

  useEffect(() => {
    if (!activeBusiness) return
    Promise.all([productAPI.list(activeBusiness.id), customerAPI.list(activeBusiness.id)])
      .then(([prods, custs]) => {
        const list = Array.isArray(prods) ? prods : (prods as any).data || []
        setProducts(list); setCustomers(custs)
      })
  }, [activeBusiness])

  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i: number, k: string, v: any) => {
    setItems(items => items.map((item, idx) => {
      if (idx !== i) return item
      const updated = { ...item, [k]: v }
      if (k === 'product_id') {
        const prod = products.find(p => p.id === v)
        if (prod) { updated.product_name = prod.name; updated.unit_price = prod.price; updated.unit = prod.unit }
      }
      return updated
    }))
  }
  const addItem = () => setItems(i => [...i, { product_id: '', product_name: '', description: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_pct: 0 }])
  const removeItem = (i: number) => setItems(items => items.filter((_, idx) => idx !== i))

  const selectCustomer = (id: string) => {
    const c = customers.find(c => c.id === id)
    if (c) setForm(f => ({ ...f, customer_id: c.id, customer_name: c.name, customer_address: c.address, customer_npwp: c.npwp || '' }))
  }

  const subtotal = items.reduce((s, item) => {
    const raw = item.quantity * item.unit_price
    return s + raw - (raw * item.discount_pct / 100)
  }, 0)
  const afterDisc = subtotal - form.discount_amount
  const taxAmt = form.tax_type === 'ppn' ? afterDisc * form.tax_rate / 100 : 0
  const grandTotal = afterDisc + taxAmt + form.additional_charges

  const handleSubmit = async () => {
    if (!activeBusiness) return
    if (!form.customer_name) { setError('Nama pelanggan wajib diisi'); return }
    if (items.some(i => !i.product_name || i.quantity <= 0)) { setError('Lengkapi semua item'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        discount_amount: Number(form.discount_amount),
        additional_charges: Number(form.additional_charges),
        tax_rate: form.tax_type === 'ppn' ? form.tax_rate : 0,
        due_date: form.due_date || undefined,
        items: items.map(i => ({
          product_id: i.product_id || undefined,
          product_name: i.product_name, description: i.description,
          quantity: Number(i.quantity), unit: i.unit,
          unit_price: Number(i.unit_price), discount_pct: Number(i.discount_pct),
        })),
      }
      await invoiceAPI.create(activeBusiness.id, payload)
      router.push('/dashboard/invoices')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="page-title">Buat Invoice</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Faktur penjualan untuk pelanggan</p>
          </div>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '10px 14px', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
              <input className="input" value={form.customer_name} onChange={e => setF('customer_name', e.target.value)} />
            </div>
            <div>
              <label className="label">NPWP</label>
              <input className="input" value={form.customer_npwp} onChange={e => setF('customer_npwp', e.target.value)} placeholder="00.000.000.0-000.000" />
            </div>
            <div>
              <label className="label">Alamat</label>
              <textarea className="input" rows={2} value={form.customer_address} onChange={e => setF('customer_address', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Info Invoice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="label">Tgl. Invoice</label>
                <input className="input" type="date" value={form.invoice_date} onChange={e => setF('invoice_date', e.target.value)} />
              </div>
              <div>
                <label className="label">Jatuh Tempo</label>
                <input className="input" type="date" value={form.due_date} onChange={e => setF('due_date', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Metode Bayar</label>
              <select className="input" value={form.payment_method} onChange={e => setF('payment_method', e.target.value)}>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div>
              <label className="label">No. Faktur Pajak</label>
              <input className="input" value={form.faktur_pajak} onChange={e => setF('faktur_pajak', e.target.value)} placeholder="000.000-00.00000000" />
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
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Item</h3>
          <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
              <div>
                {i === 0 && <label className="label">Nama Item</label>}
                <select className="input" value={item.product_id} onChange={e => setItem(i, 'product_id', e.target.value)}>
                  <option value="">— Pilih Produk —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {!item.product_id && <input className="input" style={{ marginTop: 4 }} value={item.product_name} onChange={e => setItem(i, 'product_name', e.target.value)} placeholder="Nama item..." />}
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
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(i)} disabled={items.length === 1}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>PPN & Biaya Tambahan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Tipe Pajak</label>
              <select className="input" value={form.tax_type} onChange={e => setF('tax_type', e.target.value)}>
                <option value="none">Tanpa PPN</option>
                <option value="ppn">PPN {form.tax_rate}%</option>
              </select>
            </div>
            <div>
              <label className="label">Diskon (Rp)</label>
              <input className="input" type="number" value={form.discount_amount} onChange={e => setF('discount_amount', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Biaya Tambahan (Rp)</label>
              <input className="input" type="number" value={form.additional_charges} onChange={e => setF('additional_charges', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#374151' }}>Ringkasan</h3>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: 'Diskon', value: -form.discount_amount },
            ...(form.tax_type === 'ppn' ? [{ label: `PPN ${form.tax_rate}%`, value: taxAmt }] : []),
            { label: 'Biaya Tambahan', value: form.additional_charges },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
              <span style={{ color: '#6B7280' }}>{row.label}</span>
              <span style={{ color: row.value < 0 ? '#EF4444' : '#111827' }}>{formatRupiah(Math.abs(row.value))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 16, fontWeight: 700 }}>
            <span>Total Invoice</span>
            <span style={{ color: '#E8640C' }}>{formatRupiah(grandTotal)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Menyimpan...' : '🧾 Buat Invoice'}
          </button>
        </div>
      </div>
    </div>
  )
}
