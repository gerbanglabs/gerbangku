// types/index.ts
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  bizType?: string
  bizInfo?: BusinessInfo
}

export interface BusinessInfo {
  id?: string
  name: string
  phone: string
  wa?: string
  email?: string
  area: string
  addr?: string
  npwp?: string
  is_pkp?: boolean
}

export interface Business {
  id: string
  name: string
  type: 'penginapan' | 'supplier' | 'kuliner' | 'pengrajin' | 'retail' | 'jasa'
  area: string
  emoji: string
  color: string
}

export interface Stat {
  label: string
  value: string
  unit: string
  change: string
  up: boolean | null
  icon: string
}

export interface Customer {
  id: string
  code: string
  name: string
  type: 'wholesale' | 'premium' | 'retail'
  phone: string
  address: string
  area: string
  npwp: string
  is_pkp: boolean
  payment_terms: number
  price_group: string
  outstanding_ar: number
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string 
  uom: string
  price: number 
  prices: Record<string, number>
  stock: number
  tax_rate: number
  active: boolean 
}

export interface Warehouse {
  id: string
  name: string
  code: string
}

export interface SORow {
  id: number
  product_id: string
  qty: number
  uom: string
  unit_price: number
  disc_pct: number
  tax_rate: number
}

export interface SOItem {
  id: string
  sku: string
  name: string
  uom: string
  qty_so: number
  price: number
}

export interface Driver {
  id: string
  name: string
  vehicle: string
  phone: string
}

export interface DOFormData {
  drv: Driver | null
  manualDriver: string
  addr: string
  picName: string
  picPhone: string
  date: string
  waktu: string
  notes: string
  selected: SOItem[]
  checks: Record<string, { on: boolean; qty: number }>
  totalQty: number
  totalVal: number
}

export interface InvoiceProduct {
  id: string
  sku: string
  name: string
  uom: string
  price: number
  tax: number
}

export interface InvoiceRow {
  id: number
  pid: string
  uom: string
  qty: string | number
  price: string | number
  disc: string | number
  tax: number
  desc: string
}

export interface InvoiceFormData {
  cust: Customer | null
  invDate: string
  dueDate: string
  po: string
  notes: string
  terms: string
  rows: InvoiceRow[]
  discGlobal: number
  discGlobAmt: number
  addOther: number
  otherLabel: string
  subtotalAll: number
  discItemsAll: number
  taxBase: number
  totalTax: number
  grandTotal: number
}

export interface FakturPajakItem {
  name: string
  qty: number
  uom: string
  harga: number
  disc_pct: number
  ppn_pct: number
}

export interface FakturPajakBuyer {
  type: 'pkp' | 'nonpkp' | 'nik'
  npwp: string
  nik: string
  name: string
  addr: string
}

export interface FakturPajakInvoice {
  id: string
  number: string
  date: string
  customer_id: string
  subtotal: number
  disc: number
  tax_base: number
  ppn: number
  total: number
}

export interface FakturPajakFormData {
  inv: FakturPajakInvoice | null
  fpDate: string
  kode: string
  fpSerial: string
  buyer: FakturPajakBuyer
  items: FakturPajakItem[]
  dpp: number
  ppn: number
  notes: string
}

export interface KodeTransaksi {
  kode: string
  label: string
}

export interface SalesOrder {
  id: string
  customer: string
  date: string
  items: number
  total: number
  status: 'confirmed' | 'delivered'
  payment: 'unpaid' | 'paid' | 'partial' | 'dp'
}

export interface InventoryItem {
  id: number
  sku: string
  name: string
  category: string
  stock: number
  uom: string
  min: number
  price: number
  status: 'ok' | 'low' | 'critical'
}

export interface PaymentMethod {
  id: 'transfer' | 'cash' | 'qris' | 'giro'
  label: string
  icon: string
  hint: string
}

export interface PaymentInvoice {
  id: string
  number: string
  date: string
  due: string
  customer: string
  customer_id: string
  phone: string
  total: number
  paid: number
  status: 'unpaid' | 'partial' | 'paid'
  overdue?: boolean
}

export interface PaymentFormData {
  inv: PaymentInvoice | null
  method: 'transfer' | 'cash' | 'qris' | 'giro'
  bank: string
  ref: string
  date: string
  amtNum: number
  notes: string
  newPaid: number
  newSisa: number
  newStatus: 'unpaid' | 'partial' | 'paid'
}

// ============ INVENTORY ============
export interface InventoryProduct {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  uom: string
  min_stock: number
  price: number
  status: 'ok' | 'low' | 'critical'
}

export interface StockMovement {
  id: string
  product_id: string
  type: 'in' | 'out'
  qty: number
  reason: string
  date: string
  reference?: string
}

// ============ WA ORDER ============
export interface WAMessage {
  id: string
  phone: string
  name: string
  time: string
  msg: string
  direction: 'in' | 'out'
  flow: 'catalog_code' | 'guided'
  status: 'active' | 'completed'
}

export interface WAOrder {
  id: string
  phone: string
  customer_name: string
  items: Array<{ product_id: string; qty: number }>
  total: number
  status: 'draft' | 'confirmed' | 'completed'
  created_at: string
}

// ============ REPORTS ============
export interface ReportSummary {
  period: string
  revenue: number
  cost: number
  profit: number
  orders: number
  customers: number
}

export interface RevenueData {
  month: string
  amount: number
}

export interface ARAgingData {
  period: string
  amount: number
  count: number
}

// ============ ACCOUNTING ============
export interface JournalEntry {
  id: string
  date: string
  account: string
  description: string
  debit: number
  credit: number
  reference: string
}

export interface Account {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense'
  balance: number
}

// ============ BUSINESS ============
export interface Business {
  id: string
  name: string
  tipe: string
  emoji: string
  address: string
  phone: string
  email?: string
  npwp?: string
  area: string
  created_at: string
}

// ============ SETTINGS ============
export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: 'owner' | 'admin' | 'staff'
  avatar?: string
}

export interface BusinessSettings {
  company_name: string
  legal_name: string
  address: string
  phone: string
  email: string
  npwp: string
  bank_name: string
  bank_account: string
  bank_holder: string
  website?: string
}

export interface UserSettings {
  notifications_email: boolean
  notifications_sms: boolean
  notifications_whatsapp: boolean
  timezone: string
  currency: string
  date_format: string
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login?: (email: string, password: string) => Promise<void>
  logout?: () => void
  isLoading?: boolean
}