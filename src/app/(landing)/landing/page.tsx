'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, FileText, MessageSquare, BarChart2, Star, CheckCircle, ArrowRight, Zap, Globe, ShoppingCart } from 'lucide-react'

const FEATURES = [
  { icon: Package, title: 'Manajemen Produk & Stok', desc: 'Kelola ribuan produk, pantau stok real-time, set minimum stok, dan catat semua pergerakan barang.', color: '#E8640C', bg: '#FFEDD5' },
  { icon: ShoppingCart, title: 'Sales & Purchase Order', desc: 'Buat SO dan PO dengan cepat, track status pengiriman, dan kelola pembayaran dengan mudah.', color: '#3B82F6', bg: '#DBEAFE' },
  { icon: FileText, title: 'Invoice & Faktur Pajak', desc: 'Buat invoice profesional dengan PPN otomatis, cetak PDF, dan pantau piutang dengan AR Aging.', color: '#10B981', bg: '#D1FAE5' },
  { icon: MessageSquare, title: 'WhatsApp Bot Otomatis', desc: '3 mode flow: Guided, Catalog Code, dan Hybrid. Order masuk otomatis ke sistem tanpa admin.', color: '#8B5CF6', bg: '#EDE9FE' },
  { icon: Globe, title: 'Toko Online Instan', desc: 'Aktifkan storefront dalam 1 klik. Pelanggan bisa browse produk dan order langsung via WhatsApp.', color: '#F59E0B', bg: '#FEF3C7' },
  { icon: BarChart2, title: 'Laporan & Analitik', desc: 'Laporan penjualan, inventory, laba/rugi, dan AR aging untuk keputusan bisnis yang lebih baik.', color: '#EF4444', bg: '#FEE2E2' },
]

const PLANS = [
  { name: 'Starter', price: 'Gratis', period: 'selamanya', color: '#6B7280', highlight: false, features: ['1 bisnis', '50 produk', 'Storefront dasar', 'WA Bot (50 chat/bln)', 'Laporan dasar'] },
  { name: 'Bisnis', price: 'Rp 149.000', period: '/bulan', color: '#E8640C', highlight: true, features: ['3 bisnis', '500 produk', 'WA Bot unlimited', 'Broadcast WA', 'Laporan lengkap', 'Faktur Pajak PPN', 'Priority support'] },
  { name: 'Pro', price: 'Rp 349.000', period: '/bulan', color: '#8B5CF6', highlight: false, features: ['10 bisnis', 'Produk tak terbatas', 'API akses penuh', 'Custom storefront', 'Multi-user', 'Dedicated support'] },
]

const TESTIMONIALS = [
  { name: 'Wayan Sari', biz: 'Sambal Kacang Bu Tini', text: 'WA bot-nya luar biasa! Sekarang order masuk otomatis, saya tinggal konfirmasi. Omzet naik 40% dalam 2 bulan.', rating: 5 },
  { name: 'Made Putra', biz: 'Distributor Seafood Bali', text: 'Invoice PPN-nya sangat membantu untuk pelaporan pajak. Dashboard laporan juga sangat clear dan mudah dipahami.', rating: 5 },
  { name: 'Nyoman Dewi', biz: 'Kerajinan Perak Celuk', text: 'Storefront online saya jadi lebih profesional. Pelanggan dari luar Bali sekarang bisa order dengan mudah.', rating: 5 },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3000)
    return () => clearInterval(interval)
  }, [])

  const navStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid #F3F4F6' : 'none',
    transition: 'all 0.3s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111827' }}>

      {/* Navbar */}
      <nav style={navStyle}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏪</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Gerbangku</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[['#features', 'Fitur'], ['#pricing', 'Harga'], ['#testimonials', 'Testimoni']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none' }}>Masuk</Link>
            <Link href="/register" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(232,100,12,0.25)' }}>Daftar Gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, #0F3460 100%)', padding: 'clamp(60px,10vw,120px) 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,100,12,0.2), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 99, padding: '6px 16px', marginBottom: 24, color: '#FCD34D', fontSize: 13, fontWeight: 600 }}>
            <Zap size={13} fill="#FCD34D" /> Platform #1 untuk UMKM Bali
          </div>
          <h1 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Kelola Bisnis UMKM Bali
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #E8640C, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Lebih Mudah & Cerdas
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#94A3B8', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            Satu platform untuk inventory, sales order, invoice PPN, WhatsApp bot, dan toko online. Dirancang khusus untuk UMKM Bali.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 24px rgba(232,100,12,0.4)' }}>
              Mulai Gratis Sekarang <ArrowRight size={18} />
            </Link>
            <Link href="/sambal-kacang-bu-tini" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
              Lihat Demo Toko 🛍️
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[['500+', 'Bisnis Aktif'], ['4.9★', 'Rating'], ['10rb+', 'Order/Bulan'], ['Gratis', 'Mulai dari']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#F59E0B' }}>{val}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#FFEDD5', color: '#E8640C', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>FITUR LENGKAP</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 10 }}>Semua yang dibutuhkan bisnis Anda</h2>
            <p style={{ color: '#6B7280', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Dari pencatatan stok hingga WhatsApp bot, semua tersedia dalam satu platform terintegrasi.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div key={i} onMouseEnter={() => setActiveFeature(i)} style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1.5px solid ${activeFeature === i ? feat.color : '#F3F4F6'}`, transition: 'all 0.3s', boxShadow: activeFeature === i ? `0 8px 24px ${feat.color}20` : 'none' }}>
                  <div style={{ width: 44, height: 44, background: feat.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={22} color={feat.color} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#DBEAFE', color: '#1E40AF', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>CARA KERJA</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800 }}>Mulai dalam 3 langkah mudah</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { step: '01', icon: '📝', title: 'Daftar & Setup Bisnis', desc: 'Buat akun gratis, isi info bisnis, pilih tipe bisnis Anda. Selesai dalam 2 menit.' },
              { step: '02', icon: '📦', title: 'Tambah Produk & Setting WA', desc: 'Upload produk, atur harga & stok, aktifkan WhatsApp bot dengan nomor Fonnte.' },
              { step: '03', icon: '🚀', title: 'Terima Order Otomatis', desc: 'Share link toko ke pelanggan. Order masuk otomatis, invoice dibuat otomatis.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 20px', borderRadius: 16, background: '#FAFAF8', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#E8640C', letterSpacing: '0.1em', marginBottom: 12 }}>STEP {s.step}</div>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>HARGA</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, marginBottom: 10 }}>Mulai gratis, bayar saat tumbuh</h2>
            <p style={{ color: '#6B7280', fontSize: 14 }}>Tidak ada biaya tersembunyi. Upgrade atau downgrade kapan saja.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{ background: plan.highlight ? 'linear-gradient(135deg, #1A1A2E, #16213E)' : '#fff', borderRadius: 20, padding: '28px 24px', border: `2px solid ${plan.highlight ? plan.color : '#E5E7EB'}`, position: 'relative', boxShadow: plan.highlight ? '0 16px 48px rgba(232,100,12,0.2)' : 'none' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #E8640C, #F59E0B)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                    ⭐ PALING POPULER
                  </div>
                )}
                <h3 style={{ fontSize: 18, fontWeight: 800, color: plan.highlight ? '#fff' : '#111827', marginBottom: 6 }}>{plan.name}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 30, fontWeight: 900, color: plan.color }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: plan.highlight ? '#94A3B8' : '#9CA3AF' }}> {plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: plan.highlight ? '#E2E8F0' : '#374151' }}>
                      <CheckCircle size={14} color={plan.color} style={{ flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
                <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, background: plan.highlight ? `linear-gradient(135deg, ${plan.color}, #F59E0B)` : '#F3F4F6', color: plan.highlight ? '#fff' : '#111827' }}>
                  {plan.name === 'Starter' ? 'Mulai Gratis' : `Pilih ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#EDE9FE', color: '#6D28D9', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>TESTIMONI</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800 }}>Dipercaya pebisnis Bali</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#FAFAF8', borderRadius: 16, padding: 24, border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {Array(t.rating).fill(0).map((_, si) => <Star key={si} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A2E, #0F3460)', padding: 'clamp(60px,8vw,100px) 20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>Siap kelola bisnis lebih cerdas?</h2>
          <p style={{ color: '#94A3B8', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>Bergabung dengan ratusan UMKM Bali yang sudah menggunakan Gerbangku. Daftar gratis, tidak perlu kartu kredit.</p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 14, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 17, boxShadow: '0 8px 32px rgba(232,100,12,0.4)' }}>
            Daftar Gratis Sekarang <ArrowRight size={20} />
          </Link>
          <p style={{ marginTop: 14, fontSize: 13, color: '#64748B' }}>✓ Gratis selamanya &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Setup 2 menit</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A0A14', color: '#6B7280', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #E8640C, #F59E0B)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏪</div>
                <span style={{ color: '#F3F4F6', fontWeight: 700 }}>Gerbangku</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>Platform SaaS manajemen bisnis UMKM Bali.</p>
            </div>
            <div>
              <h4 style={{ color: '#E8640C', fontWeight: 600, marginBottom: 10, fontSize: 12 }}>Produk</h4>
              {['Dashboard', 'Storefront', 'WA Bot', 'Laporan'].map(item => <div key={item} style={{ fontSize: 12, marginBottom: 5 }}>{item}</div>)}
            </div>
            <div>
              <h4 style={{ color: '#E8640C', fontWeight: 600, marginBottom: 10, fontSize: 12 }}>Untuk Bisnis</h4>
              {['Supplier', 'Kuliner', 'Penginapan', 'Retail'].map(item => <div key={item} style={{ fontSize: 12, marginBottom: 5 }}>{item}</div>)}
            </div>
            <div>
              <h4 style={{ color: '#E8640C', fontWeight: 600, marginBottom: 10, fontSize: 12 }}>Kontak</h4>
              <div style={{ fontSize: 12, marginBottom: 5 }}>📧 hello@gerbangku.com</div>
              <div style={{ fontSize: 12, marginBottom: 5 }}>📱 +62 812-3456-789</div>
              <div style={{ fontSize: 12 }}>📍 Denpasar, Bali</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, textAlign: 'center', fontSize: 12 }}>
            © 2024 Gerbangku. Dibuat dengan ❤️ di Bali.
          </div>
        </div>
      </footer>
    </div>
  )
}
