'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { reportAPI, formatRupiah, type SalesReport, type InventoryReport, type ProfitLossReport } from '@/lib/api'

export default function ReportsPage() {
  const { activeBusiness } = useAuth()
  const [tab, setTab] = useState<'sales' | 'inventory' | 'pl'>('sales')
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null)
  const [plReport, setPlReport] = useState<ProfitLossReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    const params = { start_date: startDate, end_date: endDate }
    Promise.all([
      reportAPI.sales(activeBusiness.id, params),
      reportAPI.inventory(activeBusiness.id),
      reportAPI.profitLoss(activeBusiness.id, params),
    ]).then(([s, inv, pl]) => {
      setSalesReport(s)
      setInventoryReport(inv)
      setPlReport(pl)
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness])

  const TABS = [
    { key: 'sales', label: '📊 Penjualan' },
    { key: 'inventory', label: '📦 Inventori' },
    { key: 'pl', label: '💰 Laba/Rugi' },
  ] as const

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Analisis bisnis Anda</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: 'auto' }} />
          <span style={{ color: '#6B7280' }}>—</span>
          <input className="input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: 'auto' }} />
          <button className="btn btn-primary" onClick={load}>Tampilkan</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E8640C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Memuat laporan...
        </div>
      )}

      {/* Sales Report */}
      {!loading && tab === 'sales' && salesReport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Pendapatan', value: formatRupiah(salesReport.summary.total_revenue), color: '#10B981' },
              { label: 'Total Order', value: salesReport.summary.total_orders.toString(), color: '#3B82F6' },
              { label: 'Rata-rata/Order', value: salesReport.summary.total_orders > 0 ? formatRupiah(salesReport.summary.total_revenue / salesReport.summary.total_orders) : 'Rp 0', color: '#E8640C' },
            ].map((card, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          {salesReport.monthly.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Pendapatan per Bulan</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salesReport.monthly.map(m => ({ ...m, month: m.month.slice(0, 7), revenue: m.total_revenue }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={v => `${(v/1000000).toFixed(0)}Jt`} />
                  <Tooltip formatter={(v: any) => formatRupiah(v)} labelStyle={{ fontWeight: 600 }} />
                  <Bar dataKey="revenue" name="Pendapatan" fill="#E8640C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Products */}
          {salesReport.top_products.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Produk Terlaris</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {salesReport.top_products.map((p, i) => {
                  const maxRevenue = salesReport.top_products[0].total_revenue
                  const pct = (p.total_revenue / maxRevenue) * 100
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{i + 1}. {p.product_name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#E8640C' }}>{formatRupiah(p.total_revenue)}</span>
                      </div>
                      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99 }}>
                        <div style={{ height: '100%', borderRadius: 99, background: `hsl(${30 - i * 5}, 90%, ${50 + i * 3}%)`, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Report */}
      {!loading && tab === 'inventory' && inventoryReport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Produk', value: inventoryReport.summary.total_products.toString(), color: '#3B82F6' },
              { label: 'Nilai Stok', value: formatRupiah(inventoryReport.summary.total_value), color: '#10B981' },
              { label: 'Stok Menipis', value: inventoryReport.summary.low_stock_count.toString(), color: '#EF4444' },
            ].map((card, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{card.label}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Produk</th><th>Kategori</th><th>Stok</th><th>Min</th><th>Nilai Stok</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {inventoryReport.items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
                      </td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{item.category}</td>
                      <td style={{ fontWeight: 600, color: item.is_low_stock ? '#EF4444' : '#111827' }}>
                        {item.stock_quantity} {item.unit}
                      </td>
                      <td style={{ fontSize: 13, color: '#9CA3AF' }}>{item.min_stock}</td>
                      <td style={{ fontWeight: 500 }}>{formatRupiah(item.stock_value)}</td>
                      <td>
                        {item.stock_quantity <= 0 ? <span className="badge badge-danger">Habis</span>
                          : item.is_low_stock ? <span className="badge badge-warning">Menipis</span>
                          : <span className="badge badge-success">OK</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* P&L Report */}
      {!loading && tab === 'pl' && plReport && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Laporan Laba/Rugi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Pendapatan Kotor', value: plReport.income.revenue, color: '#111827', indent: 0, bold: false },
                { label: 'Diskon', value: -plReport.income.discounts, color: '#EF4444', indent: 1, bold: false },
                { label: 'Penjualan Bersih', value: plReport.income.net_sales, color: '#111827', indent: 0, bold: true },
                { label: 'HPP (Cost of Goods Sold)', value: -plReport.cogs, color: '#EF4444', indent: 1, bold: false },
                { label: 'Laba Kotor', value: plReport.gross_profit.amount, color: plReport.gross_profit.amount >= 0 ? '#10B981' : '#EF4444', indent: 0, bold: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                  borderBottom: i === 2 || i === 4 ? '2px solid #E5E7EB' : '1px solid #F3F4F6',
                  paddingLeft: row.indent * 16,
                }}>
                  <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 400, color: '#374151' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 500, color: row.color }}>
                    {row.value < 0 ? `(${formatRupiah(Math.abs(row.value))})` : formatRupiah(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Gross Margin</h3>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: plReport.gross_profit.margin >= 30 ? '#10B981' : plReport.gross_profit.margin >= 15 ? '#F59E0B' : '#EF4444' }}>
                {plReport.gross_profit.margin.toFixed(1)}%
              </div>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>Gross Profit Margin</div>
              <div style={{ marginTop: 20, height: 12, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, transition: 'width 0.8s ease',
                  background: `linear-gradient(90deg, #E8640C, #10B981)`,
                  width: `${Math.min(plReport.gross_profit.margin, 100)}%`
                }} />
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
                {plReport.gross_profit.margin >= 30 ? '✅ Margin sangat baik' : plReport.gross_profit.margin >= 15 ? '⚠️ Margin cukup' : '❌ Margin rendah'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
