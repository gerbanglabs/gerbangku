export const formatRp = (n: number): string => 
  'Rp ' + n.toLocaleString('id-ID')

export const formatPhone = (phone: string): boolean =>
  /^0[0-9]{8,12}$/.test(phone)

export const formatEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)