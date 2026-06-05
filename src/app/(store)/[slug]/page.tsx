'use client'
import { useEffect, useState, use } from 'react'
import { Search, X } from 'lucide-react'
import { storefrontAPI, formatRupiah, type BusinessPublicInfo, type Product } from '@/lib/api'
import { useCart } from '@/hooks/useCart'
import StoreHeader from '@/components/store/StoreHeader'
import StoreHero from '@/components/store/StoreHero'
import ProductCard from '@/components/store/ProductCard'
import Cart from '@/components/store/Cart'
import CheckoutModal from '@/components/store/CheckoutModal'

export default function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [business, setBusiness] = useState<BusinessPublicInfo | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { cart, isOpen, setIsOpen, addToCart, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      storefrontAPI.getBusinessInfo(slug),
      storefrontAPI.getProducts(slug),
    ]).then(([biz, prods]) => {
      setBusiness(biz)
      setProducts(prods)
      setFiltered(prods)
      const cats = Array.from(new Set(prods.map(p => p.category).filter(Boolean)))
      setCategories(cats)
    }).catch(err => setError(err.message || 'Toko tidak ditemukan'))
    .finally(() => setLoading(false))
  }, [slug])

  // Filter: category + search
  useEffect(() => {
    let result = products
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [activeCategory, search, products])

  const handleCheckout = async (customer: { name: string; phone: string; address: string; notes: string }) => {
    try {
      const result = await storefrontAPI.createOrder(slug, {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        items: cart.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        notes: customer.notes,
        source: 'web',
      })
      clearCart()
      setIsOpen(false)
      return result as any
    } catch { return {} }
  }

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #F5F5F4', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F5F5F4' }} className="pulse" />
        <div>
          <div style={{ width: 160, height: 16, background: '#F5F5F4', borderRadius: 6, marginBottom: 4 }} className="pulse" />
          <div style={{ width: 80, height: 11, background: '#F5F5F4', borderRadius: 4 }} className="pulse" />
        </div>
      </div>
      <div style={{ height: 200, background: 'linear-gradient(135deg, #1C0A00, #431407)' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E7E5E4' }}>
              <div style={{ height: 140, background: '#F5F5F4' }} className="pulse" />
              <div style={{ padding: 16 }}>
                <div style={{ height: 14, background: '#F5F5F4', borderRadius: 4, marginBottom: 8 }} className="pulse" />
                <div style={{ height: 11, background: '#F5F5F4', borderRadius: 4, width: '60%' }} className="pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Error ──
  if (error || !business) return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Toko Tidak Ditemukan</h2>
        <p style={{ color: '#78716C', fontSize: 14, lineHeight: 1.6 }}>
          {error || `Toko "${slug}" tidak tersedia atau storefront belum diaktifkan.`}
        </p>
      </div>
    </div>
  )

  const bestsellers = products.filter(p => p.is_bestseller && p.in_stock)

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      <StoreHeader business={business} totalItems={totalItems} onCartOpen={() => setIsOpen(true)} />
      <StoreHero business={business} totalProducts={products.length} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Paling Laris</h2>
            </div>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
              {bestsellers.map(p => (
                <div key={p.id} style={{ flexShrink: 0, width: 220 }}>
                  <ProductCard product={p} onAdd={addToCart}
                    cartQty={cart.find(i => i.product.id === p.id)?.quantity || 0}
                    onDetail={() => setSelectedProduct(p)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search + Category filter */}
        <div style={{ marginBottom: 20 }}>
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#A8A29E', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk..."
              style={{
                width: '100%', maxWidth: 420,
                padding: '11px 40px 11px 42px',
                border: '1.5px solid #E7E5E4', borderRadius: 12,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
                background: '#fff', color: '#1C1917',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#E8640C'}
              onBlur={e => e.target.style.borderColor = '#E7E5E4'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 360, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
              {['all', ...categories].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: '8px 18px', borderRadius: 99, fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                  border: '1.5px solid',
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                  background: activeCategory === cat ? '#E8640C' : '#fff',
                  borderColor: activeCategory === cat ? '#E8640C' : '#E7E5E4',
                  color: activeCategory === cat ? '#fff' : '#44403C',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(232,100,12,0.25)' : 'none',
                }}>
                  {cat === 'all' ? '🛍️ Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products grid */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>
              {search ? `Hasil "${search}"` : activeCategory === 'all' ? 'Semua Produk' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#A8A29E', marginLeft: 8 }}>({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A8A29E' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>
                {search ? `Produk "${search}" tidak ditemukan` : 'Tidak ada produk di kategori ini'}
              </p>
              {search && (
                <button onClick={() => setSearch('')} style={{ marginTop: 12, background: '#E8640C', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                  Hapus Pencarian
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {filtered.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProductCard product={p} onAdd={addToCart}
                    cartQty={cart.find(c => c.product.id === p.id)?.quantity || 0}
                    onDetail={() => setSelectedProduct(p)} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Float cart button */}
      {totalItems > 0 && !isOpen && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 30, animation: 'fadeUp 0.3s ease' }}>
          <button onClick={() => setIsOpen(true)} style={{
            background: 'linear-gradient(135deg, #E8640C, #F59E0B)',
            color: '#fff', border: 'none', borderRadius: 99,
            padding: '14px 28px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(232,100,12,0.45)', whiteSpace: 'nowrap',
          }}>
            🛒 {totalItems} item · Lihat Keranjang
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60, padding: 0 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: '24px 24px 0 0', padding: '0 0 32px', animation: 'fadeUp 0.3s ease', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: 36, height: 4, background: '#E7E5E4', borderRadius: 99 }} />
            </div>
            <div style={{ padding: '12px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-info" style={{ fontSize: 11 }}>{selectedProduct.category}</span>
              <button onClick={() => setSelectedProduct(null)} style={{ background: '#F5F5F4', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, margin: '12px 0' }}>
              {selectedProduct.image_url?.length <= 4 ? selectedProduct.image_url : '🥜'}
            </div>
            <div style={{ padding: '0 24px' }}>
              {selectedProduct.is_bestseller && (
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #F59E0B, #E8640C)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, marginBottom: 8 }}>
                  ⭐ TERLARIS
                </div>
              )}
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#1C1917' }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.6, marginBottom: 16 }}>
                {selectedProduct.description || 'Produk berkualitas tinggi dari kami.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#E8640C' }}>{formatRupiah(selectedProduct.price)}</div>
                  <div style={{ fontSize: 12, color: '#A8A29E' }}>per {selectedProduct.unit}</div>
                </div>
                {selectedProduct.rating > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>⭐ {selectedProduct.rating}</div>
                    <div style={{ fontSize: 11, color: '#A8A29E' }}>Rating</div>
                  </div>
                )}
              </div>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }}
                disabled={!selectedProduct.in_stock}
                style={{
                  width: '100%', padding: '14px',
                  background: selectedProduct.in_stock ? 'linear-gradient(135deg, #E8640C, #F59E0B)' : '#E7E5E4',
                  border: 'none', borderRadius: 12, color: selectedProduct.in_stock ? '#fff' : '#A8A29E',
                  fontSize: 15, fontWeight: 700, cursor: selectedProduct.in_stock ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', boxShadow: selectedProduct.in_stock ? '0 4px 16px rgba(232,100,12,0.3)' : 'none',
                }}>
                {selectedProduct.in_stock ? '🛒 Tambah ke Keranjang' : '❌ Stok Habis'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Cart cart={cart} isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdateQty={updateQty} onRemove={removeItem} totalItems={totalItems} totalPrice={totalPrice} onCheckout={() => { setIsOpen(false); setShowCheckout(true) }} />

      {showCheckout && (
        <CheckoutModal business={business} cart={cart} totalPrice={totalPrice} onClose={() => setShowCheckout(false)} onConfirm={handleCheckout} />
      )}

      <footer style={{ background: '#1C0A00', color: '#A8A29E', textAlign: 'center', padding: '20px', fontSize: 13 }}>
        <p>© 2024 {business.name} · Powered by <span style={{ color: '#F59E0B', fontWeight: 600 }}>Gerbangku</span></p>
        {business.phone && (
          <p style={{ marginTop: 4 }}>
            📱 <a href={`https://wa.me/${business.phone}`} style={{ color: '#25D366', textDecoration: 'none' }}>Hubungi via WhatsApp</a>
          </p>
        )}
      </footer>
    </div>
  )
}
