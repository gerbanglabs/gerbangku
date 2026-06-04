'use client'
import { useEffect } from 'react'

export function Modal({ title, onClose, children, maxWidth = 560 }: {
  title: string; onClose: () => void; children: React.ReactNode; maxWidth?: number
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 100, padding: 16
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="card animate-fade-in" style={{
        width: '100%', maxWidth, maxHeight: '90vh',
        overflow: 'auto', padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}
            style={{ fontSize: 22, lineHeight: 1, padding: '2px 8px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'badge-success', delivered: 'badge-success', paid: 'badge-success',
    pending: 'badge-warning', processing: 'badge-warning', partial: 'badge-warning',
    draft: 'badge-neutral', sent: 'badge-info', overdue: 'badge-danger',
    cancelled: 'badge-danger', unpaid: 'badge-danger', in_transit: 'badge-info',
  }
  const labels: Record<string, string> = {
    confirmed: 'Dikonfirmasi', delivered: 'Terkirim', paid: 'Lunas',
    pending: 'Pending', processing: 'Diproses', partial: 'Sebagian',
    draft: 'Draft', sent: 'Terkirim', overdue: 'Jatuh Tempo',
    cancelled: 'Dibatalkan', unpaid: 'Belum Bayar', in_transit: 'Dalam Pengiriman',
  }
  return (
    <span className={`badge ${map[status] || 'badge-neutral'}`}>
      {labels[status] || status}
    </span>
  )
}
