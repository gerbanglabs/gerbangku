'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, AlertTriangle, Edit2, Trash2, BarChart2, RefreshCw, Package } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { productAPI, formatRupiah, type Product, type ProductCategory } from '@/lib/api'
import { Modal, StatusBadge } from '@/components/ui/Modal'

export default function ProductsPage() {
  const { activeBusiness } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterLow, setFilterLow] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAdjust, setShowAdjust] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (filterCat) params.category_id = filterCat
    if (filterLow) params.low_stock = 'true'
    Promise.all([
      productAPI.list(activeBusiness.id, params),
      productAPI.getCategories(activeBusiness.id),
    ]).then(([prodData, cats]) => {
      const list = Array.isArray(prodData) ? prodData : (prodData as any).data || []
      setProducts(list)
      setCategories(cats)
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, search, filterCat, filterLow])

  const handleDelete = async (id: string) => {
    if (!activeBusiness || !confirm('Hapus produk ini?')) return
    await productAPI.delete(activeBusiness.id, id)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Produk</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{products.length} produk terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowForm(true) }}>
          <Plus size={15} /> Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input className="input" style={{ paddingLeft: 34 }} placeholder="Cari nama atau SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 'auto', minWidth: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className={`btn ${filterLow ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setFilterLow(!filterLow)}>
          <AlertTriangle size={14} /> Stok Menipis
        </button>
        <button className="btn btn-ghost" onClick={load}><RefreshCw size={14} /></button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produk</th><th>SKU</th><th>Kategori</th>
                <th>Harga Jual</th><th>HPP</th><th>Stok</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => (
                  <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>
                ))}</tr>
              )) : products.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  <Package size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                  Belum ada produk
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {p.image_url && p.image_url.length <= 4 ? p.image_url : '📦'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280' }}>{p.sku}</td>
                  <td>{p.category_name ? <span className="badge badge-info">{p.category_name}</span> : '—'}</td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(p.price)}</td>
                  <td style={{ color: '#6B7280' }}>{formatRupiah(p.cost_price)}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: p.stock_quantity <= p.min_stock ? '#EF4444' : '#111827' }}>
                      {p.stock_quantity} {p.unit}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>min {p.min_stock}</div>
                  </td>
                  <td>
                    {p.stock_quantity <= 0 ? <span className="badge badge-danger">Habis</span>
                      : p.stock_quantity <= p.min_stock ? <span className="badge badge-warning">Menipis</span>
                      : <span className="badge badge-success">Tersedia</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowAdjust(p)}><BarChart2 size={13} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditProduct(p); setShowForm(true) }}><Edit2 size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <ProductFormModal product={editProduct} businessId={activeBusiness?.id || ''} categories={categories} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load() }} />}
      {showAdjust && <AdjustStockModal product={showAdjust} businessId={activeBusiness?.id || ''} onClose={() => setShowAdjust(null)} onSaved={() => { setShowAdjust(null); load() }} />}
    </div>
  )
}

function ProductFormModal({ product, businessId, categories, onClose, onSaved }: any) {
  const [form, setForm] = useState({ name: product?.name || '', sku: product?.sku || '', description: product?.description || '', category_id: product?.category_id || '', price: product?.price?.toString() || '', cost_price: product?.cost_price?.toString() || '', unit: product?.unit || 'pcs', min_stock: product?.min_stock?.toString() || '0', stock_quantity: product?.stock_quantity?.toString() || '0', image_url: product?.image_url || '', tax_type: product?.tax_type || 'none' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name || !form.price || !form.unit) { setError('Nama, harga, dan satuan wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, price: parseFloat(form.price), cost_price: parseFloat(form.cost_price || '0'), min_stock: parseFloat(form.min_stock), stock_quantity: parseFloat(form.stock_quantity), category_id: form.category_id || undefined }
      if (product) { await productAPI.update(businessId, product.id, payload) } else { await productAPI.create(businessId, payload) }
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <Modal title={product ? 'Edit Produk' : 'Tambah Produk'} onClose={onClose}>
      {error && <div className="badge badge-danger" style={{ marginBottom: 16, display: 'block', padding: '8px 12px' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Nama Produk *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Sambal Kacang Original" /></div>
        <div><label className="label">SKU</label><input className="input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU-001" /></div>
        <div><label className="label">Kategori</label><select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)}><option value="">— Pilih —</option>{categories.map((c: ProductCategory) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="label">Harga Jual *</label><input className="input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="25000" /></div>
        <div><label className="label">HPP / Modal</label><input className="input" type="number" value={form.cost_price} onChange={e => set('cost_price', e.target.value)} placeholder="12000" /></div>
        <div><label className="label">Satuan *</label><input className="input" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="pcs / kg / liter" /></div>
        <div><label className="label">Pajak</label><select className="input" value={form.tax_type} onChange={e => set('tax_type', e.target.value)}><option value="none">Tanpa PPN</option><option value="ppn">PPN 11%</option></select></div>
        <div><label className="label">Stok Awal</label><input className="input" type="number" value={form.stock_quantity} onChange={e => set('stock_quantity', e.target.value)} /></div>
        <div><label className="label">Stok Min.</label><input className="input" type="number" value={form.min_stock} onChange={e => set('min_stock', e.target.value)} /></div>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Emoji / Gambar</label><input className="input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="🥜 atau https://..." /></div>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Deskripsi</label><textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </Modal>
  )
}

function AdjustStockModal({ product, businessId, onClose, onSaved }: any) {
  const [qty, setQty] = useState(''); const [notes, setNotes] = useState(''); const [saving, setSaving] = useState(false)
  const handleSave = async () => {
    if (!qty) return; setSaving(true)
    try { await productAPI.adjustStock(businessId, product.id, parseFloat(qty), notes); onSaved() } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }
  return (
    <Modal title="Adjust Stok" onClose={onClose} maxWidth={400}>
      <div style={{ marginBottom: 16, padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
        <div style={{ fontWeight: 600 }}>{product.name}</div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Stok saat ini: <strong>{product.stock_quantity} {product.unit}</strong></div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label className="label">Penyesuaian (+ tambah / - kurang)</label>
        <input className="input" type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="10 atau -5" />
        {qty && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Stok setelah: <strong>{product.stock_quantity + (parseFloat(qty) || 0)} {product.unit}</strong></div>}
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="label">Keterangan</label>
        <input className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Stok opname, retur, dll..." />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !qty}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </Modal>
  )
}
