'use client'
import { useEffect, useState } from 'react'
import { MessageSquare, Send, Settings, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { waAPI, formatDate, type WAConversation, type WAMessage, type WABotConfig, type WAStats } from '@/lib/api'

export default function WhatsAppPage() {
  const { activeBusiness } = useAuth()
  const [tab, setTab] = useState<'monitor' | 'config'>('monitor')
  const [conversations, setConversations] = useState<WAConversation[]>([])
  const [messages, setMessages] = useState<WAMessage[]>([])
  const [selectedConv, setSelectedConv] = useState<WAConversation | null>(null)
  const [config, setConfig] = useState<WABotConfig | null>(null)
  const [stats, setStats] = useState<WAStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [manualMsg, setManualMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [configForm, setConfigForm] = useState({ flow_type: 'guided', welcome_message: '', close_message: '', is_active: true, fonnte_device: '', auto_reply: true })

  const load = () => {
    if (!activeBusiness) return
    setLoading(true)
    Promise.all([
      waAPI.getConversations(activeBusiness.id),
      waAPI.getStats(activeBusiness.id),
      waAPI.getConfig(activeBusiness.id).catch(() => null)
    ]).then(([convs, st, cfg]) => {
      setConversations(convs)
      setStats(st)
      if (cfg) {
        setConfig(cfg)
        setConfigForm({ flow_type: cfg.flow_type, welcome_message: cfg.welcome_message, close_message: cfg.close_message, is_active: cfg.is_active, fonnte_device: cfg.fonnte_device, auto_reply: cfg.auto_reply })
      }
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [activeBusiness])

  useEffect(() => {
    if (!selectedConv || !activeBusiness) return
    waAPI.getMessages(activeBusiness.id, selectedConv.id).then(setMessages).catch(console.error)
  }, [selectedConv, activeBusiness])

  const handleSendManual = async () => {
    if (!selectedConv || !manualMsg || !activeBusiness) return
    setSending(true)
    try {
      await waAPI.sendMessage(activeBusiness.id, selectedConv.customer_phone, manualMsg)
      setManualMsg('')
      waAPI.getMessages(activeBusiness.id, selectedConv.id).then(setMessages)
    } catch (e: any) { alert(e.message) } finally { setSending(false) }
  }

  const handleSaveConfig = async () => {
    if (!activeBusiness) return
    try {
      const saved = await waAPI.saveConfig(activeBusiness.id, configForm)
      setConfig(saved)
      alert('Konfigurasi berhasil disimpan!')
    } catch (e: any) { alert(e.message) }
  }

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://api.gerbangku.com'}/webhook/fonnte/${activeBusiness?.slug}`

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">WhatsApp Bot</h1>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Monitor percakapan & konfigurasi bot</p>
        </div>
        <button className="btn btn-ghost" onClick={load}><RefreshCw size={14} /></button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Percakapan Aktif', value: stats.active_conversations, icon: '💬', color: '#3B82F6' },
            { label: 'Selesai Hari Ini', value: stats.resolved_today, icon: '✅', color: '#10B981' },
            { label: 'Pesan Hari Ini', value: stats.total_messages_today, icon: '📨', color: '#8B5CF6' },
            { label: 'Order dari WA (bulan ini)', value: stats.orders_from_wa_this_month, icon: '🛒', color: '#E8640C' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <button className={`btn btn-sm ${tab === 'monitor' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('monitor')}>
          <MessageSquare size={13} /> Monitor
        </button>
        <button className={`btn btn-sm ${tab === 'config' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('config')}>
          <Settings size={13} /> Konfigurasi
        </button>
      </div>

      {tab === 'monitor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, height: 520 }}>
          {/* Conversation List */}
          <div className="card" style={{ overflow: 'auto', padding: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', fontWeight: 600, fontSize: 13 }}>
              Percakapan ({conversations.length})
            </div>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ background: '#F3F4F6', borderRadius: 4, height: 13, width: '60%', marginBottom: 6 }} />
                  <div style={{ background: '#F3F4F6', borderRadius: 4, height: 11, width: '80%' }} />
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Belum ada percakapan
              </div>
            ) : conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: '1px solid #F9FAFB',
                  background: selectedConv?.id === conv.id ? '#FFF7ED' : 'transparent',
                  borderLeft: selectedConv?.id === conv.id ? '3px solid #E8640C' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{conv.customer_name || conv.customer_phone}</div>
                  <span className={`badge ${conv.status === 'active' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
                    {conv.status === 'active' ? '🟢' : '⚪'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{conv.customer_phone}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.last_message || '—'}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                  {conv.current_step && <span className="badge badge-info" style={{ fontSize: 10 }}>{conv.current_step}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            {!selectedConv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                <div style={{ textAlign: 'center' }}>
                  <MessageSquare size={40} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <div style={{ fontSize: 14 }}>Pilih percakapan</div>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #25D366, #128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {selectedConv.customer_name?.[0]?.toUpperCase() || 'W'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedConv.customer_name || selectedConv.customer_phone}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{selectedConv.customer_phone} • Step: {selectedConv.current_step || '—'}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: 20 }}>Tidak ada pesan</div>
                  ) : messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.direction === 'out' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '8px 12px', borderRadius: msg.direction === 'out' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: msg.direction === 'out' ? (msg.is_bot ? '#E8640C' : '#1A1A2E') : '#F3F4F6',
                        color: msg.direction === 'out' ? '#fff' : '#111827',
                        fontSize: 13, lineHeight: 1.5,
                      }}>
                        {msg.is_bot && msg.direction === 'out' && <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>🤖 Bot</div>}
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        <div style={{ fontSize: 10, opacity: 0.6, textAlign: 'right', marginTop: 3 }}>
                          {new Date(msg.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Manual Send */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    style={{ flex: 1 }}
                    placeholder="Ketik pesan manual..."
                    value={manualMsg}
                    onChange={e => setManualMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendManual() } }}
                  />
                  <button className="btn btn-primary" onClick={handleSendManual} disabled={sending || !manualMsg}>
                    <Send size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Konfigurasi Bot</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Tipe Flow</label>
                <select className="input" value={configForm.flow_type} onChange={e => setConfigForm(f => ({ ...f, flow_type: e.target.value }))}>
                  <option value="guided">Guided (menu interaktif)</option>
                  <option value="catalog_code">Catalog Code (kode produk)</option>
                  <option value="hybrid">Hybrid (auto-detect)</option>
                </select>
              </div>
              <div>
                <label className="label">Nomor WA (Fonnte Device)</label>
                <input className="input" value={configForm.fonnte_device} onChange={e => setConfigForm(f => ({ ...f, fonnte_device: e.target.value }))} placeholder="628123456789" />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={configForm.is_active} onChange={e => setConfigForm(f => ({ ...f, is_active: e.target.checked }))} />
                  Bot Aktif
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={configForm.auto_reply} onChange={e => setConfigForm(f => ({ ...f, auto_reply: e.target.checked }))} />
                  Auto Reply
                </label>
              </div>
              <div>
                <label className="label">Pesan Sambutan</label>
                <textarea className="input" rows={4} value={configForm.welcome_message} onChange={e => setConfigForm(f => ({ ...f, welcome_message: e.target.value }))} placeholder="Halo! Selamat datang di toko kami..." style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="label">Pesan Penutup</label>
                <textarea className="input" rows={3} value={configForm.close_message} onChange={e => setConfigForm(f => ({ ...f, close_message: e.target.value }))} placeholder="Terima kasih sudah berbelanja! 🙏" style={{ resize: 'vertical' }} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveConfig}>Simpan Konfigurasi</button>
            </div>
          </div>

          {/* Webhook Info */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Setup Fonnte Webhook</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 6 }}>URL Webhook Anda:</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#15803D', wordBreak: 'break-all', background: '#DCFCE7', padding: '8px 10px', borderRadius: 6 }}>
                  {webhookUrl}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 8, background: '#16A34A', color: '#fff' }} onClick={() => navigator.clipboard?.writeText(webhookUrl)}>
                  Salin URL
                </button>
              </div>

              <div style={{ fontSize: 13, color: '#374151' }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>Cara setup di Fonnte:</div>
                {[
                  'Login ke fonnte.com/dashboard',
                  'Pilih device/nomor WA Anda',
                  'Klik "Webhook" atau "Integration"',
                  'Paste URL webhook di atas',
                  'Aktifkan webhook dan simpan',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E8640C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 14px', background: '#FFF7ED', borderRadius: 8, border: '1px solid #FED7AA', fontSize: 13, color: '#9A3412' }}>
                <strong>Flow Types:</strong><br />
                <b>Guided</b> — Bot tanya jawab step by step<br />
                <b>Catalog Code</b> — Customer kirim kode: <code style={{ background: '#FFEDD5', padding: '1px 4px', borderRadius: 3 }}>A1x2 B3x1</code><br />
                <b>Hybrid</b> — Auto-detect dari input customer
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
