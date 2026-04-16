// app/layout.tsx
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gerbangku - Business Suite',
  description: 'Platform bisnis all-in-one untuk Bali',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif", margin: 0, padding: 0, background: '#f5f4f0' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}