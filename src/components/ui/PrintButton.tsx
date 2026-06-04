'use client'
import { Printer } from 'lucide-react'

export function PrintButton({ label = 'Cetak' }: { label?: string }) {
  return (
    <button className="btn btn-secondary" onClick={() => window.print()}>
      <Printer size={15} /> {label}
    </button>
  )
}

export function PrintStyles() {
  return (
    <style>{`
      @media print {
        .no-print { display: none !important; }
        .sidebar  { display: none !important; }
        .main-content { margin-left: 0 !important; padding: 0 !important; }
        .print-page { padding: 24px; }
        body { background: #fff !important; }
        .card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
      }
    `}</style>
  )
}
