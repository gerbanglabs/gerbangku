'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Edit2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supplierAPI, type Supplier } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'

export default function SuppliersPage() {
  const { activeBusiness } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    supplierAPI.list(activeBusiness.id, search)
      .then(setSuppliers).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [activeBusiness, search])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Supplier</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{suppliers.length} supplier terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditSupplier(null); setShowForm(true) }}>
          <Plus size={15} /> Tambah Supplier
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input className="input" style={{ paddingLeft: 34 }} placeholder="Cari nama atau HP..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Supplier</th><th>No. HP</th><th>Kota</th><th>Tempo Bayar</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {loading ? Array(4).fill(0).map((_, i) => (
                <tr key={i}>{Array(5).fill(0).map((_, j) => <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>)}</tr>
              )) : suppliers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Belum ada supplier</td></tr>
              ) : suppliers.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.email || '—'}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{s.phone || '—'}</td>
                  <td style={{ fontSize: 13 }}>{s.city || '—'}</td>
                  <td style={{ fontSize: 13 }}>{s.payment_term > 0 ? `${s.payment_term} hari` : 'Cash'}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditSupplier(s); setShowForm(true) }}><Edit2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <SupplierFormModal supplier={editSupplier} businessId={activeBusiness?.id || ''} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load() }} />}
    </div>
  )
}

function SupplierFormModal({ supplier, businessId, onClose, onSaved }: any) {
  const [form, setForm] = useState({ name: supplier?.name || '', phone: supplier?.phone || '', email: supplier?.email || '', address: supplier?.address || '', city: supplier?.city || '', npwp: supplier?.npwp || '', payment_term: supplier?.payment_term?.toString() || '0', notes: supplier?.notes || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name) { setError('Nama wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, payment_term: parseInt(form.payment_term) }
      if (supplier) { await supplierAPI.update(businessId, supplier.id, payload) } else { await supplierAPI.create(businessId, payload) }
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <Modal title={supplier ? 'Edit Supplier' : 'Tambah Supplier'} onClose={onClose}>
      {error && <div className="badge badge-danger" style={{ marginBottom: 14, display: 'block', padding: '8px 12px' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Nama Supplier *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div><label className="label">No. HP</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div><label className="label">Kota</label><input className="input" value={form.city} onChange={e => set('city', e.target.value)} /></div>
        <div><label className="label">NPWP</label><input className="input" value={form.npwp} onChange={e => set('npwp', e.target.value)} /></div>
        <div><label className="label">Tempo Bayar (hari)</label><input className="input" type="number" value={form.payment_term} onChange={e => set('payment_term', e.target.value)} /></div>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Alamat</label><textarea className="input" rows={2} value={form.address} onChange={e => set('address', e.target.value)} style={{ resize: 'vertical' }} /></div>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Catatan</label><input className="input" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </Modal>
  )
}
