// ── Gerbangku Unified API Client ─────────────────────────────
// Used by: Dashboard, Storefront, Landing

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

// ── Core request helper ───────────────────────────────────────

function getToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('gerbangku_token') || ''
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Request failed')
  return data.data as T
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } })
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || 'Request failed')
  return data.data as T
}

// ── Types ─────────────────────────────────────────────────────

export type User = { id: string; email: string; full_name: string; phone: string }

export type Business = {
  id: string; user_id: string; name: string; slug: string
  business_type: string; description: string; address: string
  city: string; phone: string; email: string; logo_url: string
  is_active: boolean; enable_public_storefront: boolean; plan: string
  created_at: string; updated_at: string
}

export type DashboardStats = {
  total_revenue: number; total_orders: number; pending_orders: number
  total_customers: number; total_products: number; low_stock_count: number
  unpaid_invoices: number; revenue_this_month: number
}

export type Product = {
  id: string; business_id: string; category_id?: string; category_name?: string
  name: string; description: string; sku: string; price: number; cost_price: number
  unit: string; stock_quantity: number; min_stock: number
  image_url: string; rating: number; is_bestseller: boolean; is_active: boolean
  tax_type: string; created_at: string; updated_at: string
}

export type ProductPublic = {
  id: string; name: string; description: string; category: string
  price: number; unit: string; image_url: string
  rating: number; is_bestseller: boolean; in_stock: boolean
}

export type ProductCategory = { id: string; name: string; slug: string; sort_order: number }
export type StockMovement = { id: string; movement_type: string; quantity: number; qty_before: number; qty_after: number; notes: string; created_at: string }

export type Customer = {
  id: string; name: string; phone: string; email: string; address: string
  city: string; npwp: string; customer_type: string; credit_limit: number
  payment_term: number; price_level: string; is_active: boolean; created_at: string
}

export type Supplier = {
  id: string; name: string; phone: string; email: string; address: string
  city: string; npwp: string; payment_term: number; notes: string; is_active: boolean
  created_at: string; updated_at: string
}

export type SalesOrder = {
  id: string; so_number: string; customer_name: string; customer_phone: string
  customer_address: string; status: string; order_date: string
  subtotal: number; discount_amount: number; tax_type: string; tax_rate: number
  tax_amount: number; shipping_cost: number; grand_total: number
  paid_amount: number; payment_status: string; payment_method: string; source: string
  notes: string; created_at: string
}

export type SalesOrderItem = {
  id: string; product_name: string; quantity: number; delivered_qty: number
  unit: string; unit_price: number; discount_amount: number; subtotal: number
}

export type SalesOrderWithItems = SalesOrder & { items: SalesOrderItem[] }

export type PurchaseOrder = {
  id: string; po_number: string; supplier_name?: string; status: string
  order_date: string; expected_date?: string
  subtotal: number; discount_amount: number; tax_amount: number
  shipping_cost: number; grand_total: number; paid_amount: number
  payment_status: string; notes: string; created_at: string
}

export type PurchaseOrderItem = {
  id: string; product_name: string; quantity: number; received_qty: number
  unit: string; unit_price: number; discount_amount: number; subtotal: number
}

export type PurchaseOrderWithItems = PurchaseOrder & { items: PurchaseOrderItem[] }

export type DeliveryOrder = {
  id: string; do_number: string; so_number?: string; status: string
  delivery_date: string; customer_name: string; customer_phone: string
  delivery_address: string; driver_name: string; driver_phone: string
  vehicle_number: string; notes: string; created_at: string
}

export type DeliveryOrderItem = { id: string; product_name: string; quantity: number; unit: string; notes: string }
export type DeliveryOrderWithItems = DeliveryOrder & { items: DeliveryOrderItem[] }

export type Invoice = {
  id: string; invoice_number: string; faktur_pajak?: string; status: string
  invoice_date: string; due_date?: string; customer_name: string
  customer_address: string; customer_npwp: string
  subtotal: number; discount_amount: number; tax_type: string
  tax_rate: number; tax_amount: number; additional_charges: number
  grand_total: number; paid_amount: number; payment_method: string
  notes: string; created_at: string
}

export type InvoiceItem = {
  id: string; product_name: string; description: string
  quantity: number; unit: string; unit_price: number
  discount_pct: number; discount_amount: number; subtotal: number
}

export type InvoiceWithItems = Invoice & { items: InvoiceItem[] }

export type Payment = {
  id: string; payment_number: string; reference_type: string; reference_id: string
  payment_date: string; amount: number; payment_method: string; bank_name: string
  bank_account: string; reference_no: string; notes: string; created_at: string
}

export type WABotConfig = {
  id: string; flow_type: string; welcome_message: string; close_message: string
  is_active: boolean; fonnte_device: string; auto_reply: boolean
}

export type WAConversation = {
  id: string; customer_phone: string; customer_name: string; status: string
  current_step: string; last_message: string; last_message_at?: string; updated_at: string
}

export type WAMessage = { id: string; direction: string; content: string; is_bot: boolean; sent_at: string }

export type WAStats = {
  active_conversations: number; resolved_today: number
  total_messages_today: number; orders_from_wa_this_month: number
}

export type SalesReport = {
  period: { start_date: string; end_date: string }
  summary: { total_revenue: number; total_orders: number }
  monthly: Array<{ month: string; total_orders: number; total_revenue: number }>
  top_products: Array<{ product_name: string; total_qty: number; total_revenue: number }>
}

export type InventoryReport = {
  summary: { total_products: number; total_value: number; low_stock_count: number }
  items: Array<{ id: string; name: string; sku: string; unit: string; stock_quantity: number; min_stock: number; stock_value: number; is_low_stock: boolean; category: string }>
}

export type ProfitLossReport = {
  income: { revenue: number; discounts: number; net_sales: number }
  cogs: number
  gross_profit: { amount: number; margin: number }
}

export type ARAgingData = {
  items: Array<{ invoice_number: string; customer_name: string; due_date: string; outstanding: number; days_overdue: number; aging_bucket: string }>
  summary: Record<string, number>
}

export type BusinessPublicInfo = {
  name: string; slug: string; business_type: string
  description: string; address: string; city: string
  phone: string; email: string; logo_url: string
}

export type CartItem = { product: ProductPublic; quantity: number }

export type PaginatedData<T> = { data?: T[]; meta?: { total_items: number } } | T[]

// ── Helpers ───────────────────────────────────────────────────

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function buildWAMessage(businessName: string, cart: CartItem[], customer: { name: string; phone: string; address: string }, orderNumber?: string): string {
  let msg = `*PESANAN - ${businessName.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━\n\n`
  if (orderNumber) msg += `No. Pesanan: *${orderNumber}*\n\n`
  msg += `*${customer.name}*\n${customer.phone}\n${customer.address}\n\n`
  let total = 0
  cart.forEach((item, i) => {
    const sub = item.product.price * item.quantity
    msg += `${i + 1}. ${item.product.name}\n   ${item.quantity} ${item.product.unit} x ${formatRupiah(item.product.price)} = ${formatRupiah(sub)}\n\n`
    total += sub
  })
  msg += `━━━━━━━━━━━━━━━━━━━\n*TOTAL: ${formatRupiah(total)}*\n\n_Terima kasih! 🙏_`
  return msg
}

// ── API Modules ───────────────────────────────────────────────

export const authAPI = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { email: string; password: string; full_name: string; phone?: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request<User>('/profile'),
}

export const businessAPI = {
  list: () => request<Business[]>('/businesses'),
  get: (id: string) => request<Business>(`/businesses/${id}`),
  create: (data: Partial<Business>) => request<Business>('/businesses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Business>) => request<Business>(`/businesses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getDashboard: (id: string) => request<DashboardStats>(`/businesses/${id}/dashboard`),
}

export const productAPI = {
  list: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<PaginatedData<Product>>(`/businesses/${bizId}/products${q}`)
  },
  get: (bizId: string, id: string) => request<Product>(`/businesses/${bizId}/products/${id}`),
  create: (bizId: string, data: Partial<Product>) => request<Product>(`/businesses/${bizId}/products`, { method: 'POST', body: JSON.stringify(data) }),
  update: (bizId: string, id: string, data: Partial<Product>) => request<Product>(`/businesses/${bizId}/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (bizId: string, id: string) => request(`/businesses/${bizId}/products/${id}`, { method: 'DELETE' }),
  adjustStock: (bizId: string, id: string, quantity: number, notes: string) =>
    request(`/businesses/${bizId}/products/${id}/adjust-stock`, { method: 'POST', body: JSON.stringify({ quantity, notes }) }),
  getMovements: (bizId: string, id: string) => request<StockMovement[]>(`/businesses/${bizId}/products/${id}/movements`),
  getCategories: (bizId: string) => request<ProductCategory[]>(`/businesses/${bizId}/categories`),
  createCategory: (bizId: string, name: string) => request<ProductCategory>(`/businesses/${bizId}/categories`, { method: 'POST', body: JSON.stringify({ name }) }),
}

export const customerAPI = {
  list: (bizId: string, search?: string) => request<Customer[]>(`/businesses/${bizId}/customers${search ? `?search=${search}` : ''}`),
  get: (bizId: string, id: string) => request<Customer>(`/businesses/${bizId}/customers/${id}`),
  create: (bizId: string, data: Partial<Customer>) => request<Customer>(`/businesses/${bizId}/customers`, { method: 'POST', body: JSON.stringify(data) }),
  update: (bizId: string, id: string, data: Partial<Customer>) => request<Customer>(`/businesses/${bizId}/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

export const supplierAPI = {
  list: (bizId: string, search?: string) => request<Supplier[]>(`/businesses/${bizId}/suppliers${search ? `?search=${search}` : ''}`),
  get: (bizId: string, id: string) => request<Supplier>(`/businesses/${bizId}/suppliers/${id}`),
  create: (bizId: string, data: Partial<Supplier>) => request<Supplier>(`/businesses/${bizId}/suppliers`, { method: 'POST', body: JSON.stringify(data) }),
  update: (bizId: string, id: string, data: Partial<Supplier>) => request<Supplier>(`/businesses/${bizId}/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (bizId: string, id: string) => request(`/businesses/${bizId}/suppliers/${id}`, { method: 'DELETE' }),
}

export const salesOrderAPI = {
  list: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<SalesOrder[]>(`/businesses/${bizId}/sales-orders${q}`)
  },
  get: (bizId: string, id: string) => request<SalesOrderWithItems>(`/businesses/${bizId}/sales-orders/${id}`),
  create: (bizId: string, data: any) => request<SalesOrderWithItems>(`/businesses/${bizId}/sales-orders`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (bizId: string, id: string, status: string) => request(`/businesses/${bizId}/sales-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const purchaseOrderAPI = {
  list: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<PurchaseOrder[]>(`/businesses/${bizId}/purchase-orders${q}`)
  },
  get: (bizId: string, id: string) => request<PurchaseOrderWithItems>(`/businesses/${bizId}/purchase-orders/${id}`),
  create: (bizId: string, data: any) => request<PurchaseOrderWithItems>(`/businesses/${bizId}/purchase-orders`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (bizId: string, id: string, status: string) => request(`/businesses/${bizId}/purchase-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  receiveItems: (bizId: string, id: string, items: Array<{ item_id: string; received_qty: number }>) =>
    request(`/businesses/${bizId}/purchase-orders/${id}/receive`, { method: 'POST', body: JSON.stringify({ items }) }),
}

export const deliveryOrderAPI = {
  list: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<DeliveryOrder[]>(`/businesses/${bizId}/delivery-orders${q}`)
  },
  get: (bizId: string, id: string) => request<DeliveryOrderWithItems>(`/businesses/${bizId}/delivery-orders/${id}`),
  create: (bizId: string, data: any) => request<DeliveryOrderWithItems>(`/businesses/${bizId}/delivery-orders`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (bizId: string, id: string, status: string) => request(`/businesses/${bizId}/delivery-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const invoiceAPI = {
  list: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<Invoice[]>(`/businesses/${bizId}/invoices${q}`)
  },
  get: (bizId: string, id: string) => request<InvoiceWithItems>(`/businesses/${bizId}/invoices/${id}`),
  create: (bizId: string, data: any) => request<InvoiceWithItems>(`/businesses/${bizId}/invoices`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (bizId: string, id: string, status: string) => request(`/businesses/${bizId}/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getARAgeing: (bizId: string) => request<ARAgingData>(`/businesses/${bizId}/reports/ar-aging`),
}

export const paymentAPI = {
  list: (bizId: string) => request<Payment[]>(`/businesses/${bizId}/payments`),
  create: (bizId: string, data: any) => request(`/businesses/${bizId}/payments`, { method: 'POST', body: JSON.stringify(data) }),
}

export const reportAPI = {
  sales: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<SalesReport>(`/businesses/${bizId}/reports/sales${q}`)
  },
  inventory: (bizId: string) => request<InventoryReport>(`/businesses/${bizId}/reports/inventory`),
  profitLoss: (bizId: string, params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<ProfitLossReport>(`/businesses/${bizId}/reports/profit-loss${q}`)
  },
}

export const waAPI = {
  getConfig: (bizId: string) => request<WABotConfig>(`/businesses/${bizId}/wa/config`),
  saveConfig: (bizId: string, data: Partial<WABotConfig>) => request<WABotConfig>(`/businesses/${bizId}/wa/config`, { method: 'POST', body: JSON.stringify(data) }),
  getConversations: (bizId: string, status?: string) => request<WAConversation[]>(`/businesses/${bizId}/wa/conversations${status ? `?status=${status}` : ''}`),
  getMessages: (bizId: string, convId: string) => request<WAMessage[]>(`/businesses/${bizId}/wa/conversations/${convId}/messages`),
  sendMessage: (bizId: string, phone: string, message: string) => request(`/businesses/${bizId}/wa/send`, { method: 'POST', body: JSON.stringify({ phone, message }) }),
  getStats: (bizId: string) => request<WAStats>(`/businesses/${bizId}/wa/stats`),
}

export const storefrontAPI = {
  getBusinessInfo: (slug: string) => publicFetch<BusinessPublicInfo>(`/public/business/${slug}/info`),
  getProducts: (slug: string, category?: string) => {
    const q = category && category !== 'all' ? `?category=${category}` : ''
    return publicFetch<ProductPublic[]>(`/public/business/${slug}/products${q}`)
  },
  createOrder: (slug: string, payload: any) =>
    fetch(`${API_BASE}/public/business/${slug}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => r.json()).then(d => d.data),
}
