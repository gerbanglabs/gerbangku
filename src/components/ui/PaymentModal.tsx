'use client'
import { useState } from 'react'
import { paymentAPI, formatRupiah } from '@/lib/api'
import { Modal } from './Modal'

type Props = {
  businessId: string
  referenceType: 'invoice' | 'sales_order'
  referenceId: string
  referenceNumber: string
  outstanding: number
  onClose: () => void
  onSaved: () => void
}

export function PaymentModal({ businessId, referenceType, referenceId, referenceNumber, outstanding, onClose, onSaved }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    amount: outstanding.toString(),
    payment_date: today,
    payment_method: 'transfer',
    bank_name: '',
    bank_account: '',
    reference_no: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Jumlah pembayaran tidak valid'); return }
    setSaving(true); setError('')
    try {
      await paymentAPI.create(businessId, {
        reference_type: referenceType,
        reference_id: referenceId,
        payment_date: form.payment_date,
        amount: parseFloat(form.amount),
        payment_method: form.payment_method,
        bank_name: form.bank_name,
        bank_account: form.bank_account,
        reference_no: form.reference_no,
        notes: form.notes,
      })
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <Modal title="Catat Pembayaran" onClose={onClose} maxWidth={460}>
      <div style={{ marginBottom: 16, padding: '10px 14px', background: '#F9FAFB', borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: '#6B7280' }}>Untuk: <strong>{referenceNumber}</strong></div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
          Outstanding: <strong style={{ color: '#EF4444' }}>{formatRupiah(outstanding)}</strong>
        </div>
      </div>
      {error && <div className="badge badge-danger" style={{ display: 'block', padding: '8px 12px', marginBottom: 14 }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="label">Jumlah Bayar (Rp) *</label>
          <input className="input" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label className="label">Tanggal Bayar</label>
            <input className="input" type="date" value={form.payment_date} onChange={e => set('payment_date', e.target.value)} />
          </div>
          <div>
            <label className="label">Metode</label>
            <select className="input" value={form.payment_method} onChange={e => set('payment_method', e.target.value)}>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer Bank</option>
              <option value="qris">QRIS</option>
              <option value="kartu">Kartu</option>
            </select>
          </div>
        </div>
        {form.payment_method === 'transfer' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="label">Bank</label>
                <input className="input" value={form.bank_name} onChange={e => set('bank_name', e.target.value)} placeholder="BCA, Mandiri, dll" />
              </div>
              <div>
                <label className="label">No. Rekening</label>
                <input className="input" value={form.bank_account} onChange={e => set('bank_account', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">No. Referensi Transfer</label>
              <input className="input" value={form.reference_no} onChange={e => set('reference_no', e.target.value)} placeholder="Nomor bukti transfer" />
            </div>
          </>
        )}
        <div>
          <label className="label">Catatan</label>
          <input className="input" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : '💰 Catat Pembayaran'}
        </button>
      </div>
    </Modal>
  )
}
