'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { customerAPI, type Customer } from '@/lib/api'
import { Modal } from '@/components/ui/Modal'

export default function CustomersPage() {
  const { activeBusiness } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    customerAPI.list(activeBusiness.id, search)
      .then(setCustomers).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness, search])

  const typeLabel: Record<string, string> = { retail: 'Retail', reseller: 'Reseller', distributor: 'Distributor' }
  const typeBadge: Record<string, string> = { retail: 'badge-neutral', reseller: 'badge-info', distributor: 'badge-orange' }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pelanggan</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{customers.length} pelanggan terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditCustomer(null); setShowForm(true) }}>
          <Plus size={15} /> Tambah Pelanggan
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input className="input" style={{ paddingLeft: 34 }} placeholder="Cari nama atau nomor HP..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Pelanggan</th><th>Tipe</th><th>No. HP</th><th>Kota</th><th>Tempo Bayar</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j}><div style={{ background: '#F3F4F6', borderRadius: 4, height: 14, width: '80%' }} /></td>)}</tr>
              )) : customers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                  <Users size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                  Belum ada pelanggan
                </td></tr>
              ) : customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E8640C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{c.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${typeBadge[c.customer_type] || 'badge-neutral'}`}>{typeLabel[c.customer_type] || c.customer_type}</span></td>
                  <td style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                  <td style={{ fontSize: 13 }}>{c.city || '—'}</td>
                  <td style={{ fontSize: 13 }}>{c.payment_term > 0 ? `${c.payment_term} hari` : 'Cash'}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditCustomer(c); setShowForm(true) }}><Edit2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <CustomerFormModal customer={editCustomer} businessId={activeBusiness?.id || ''} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load() }} />}
    </div>
  )
}

function CustomerFormModal({ customer, businessId, onClose, onSaved }: any) {
  const [form, setForm] = useState({ name: customer?.name || '', phone: customer?.phone || '', email: customer?.email || '', address: customer?.address || '', city: customer?.city || '', npwp: customer?.npwp || '', customer_type: customer?.customer_type || 'retail', payment_term: customer?.payment_term?.toString() || '0', price_level: customer?.price_level || 'normal', notes: customer?.notes || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name) { setError('Nama wajib diisi'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, payment_term: parseInt(form.payment_term) }
      if (customer) { await customerAPI.update(businessId, customer.id, payload) } else { await customerAPI.create(businessId, payload) }
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <Modal title={customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'} onClose={onClose}>
      {error && <div className="badge badge-danger" style={{ marginBottom: 14, display: 'block', padding: '8px 12px' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}><label className="label">Nama *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama pelanggan" /></div>
        <div><label className="label">No. HP</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08123456789" /></div>
        <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div><label className="label">Kota</label><input className="input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Denpasar" /></div>
        <div><label className="label">NPWP</label><input className="input" value={form.npwp} onChange={e => set('npwp', e.target.value)} /></div>
        <div><label className="label">Tipe Pelanggan</label>
          <select className="input" value={form.customer_type} onChange={e => set('customer_type', e.target.value)}>
            <option value="retail">Retail</option><option value="reseller">Reseller</option><option value="distributor">Distributor</option>
          </select>
        </div>
        <div><label className="label">Level Harga</label>
          <select className="input" value={form.price_level} onChange={e => set('price_level', e.target.value)}>
            <option value="normal">Normal</option><option value="reseller">Reseller</option><option value="distributor">Distributor</option>
          </select>
        </div>
        <div><label className="label">Tempo Bayar (hari)</label><input className="input" type="number" value={form.payment_term} onChange={e => set('payment_term', e.target.value)} placeholder="0 = cash" /></div>
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
