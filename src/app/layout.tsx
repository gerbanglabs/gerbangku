import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['300','400','500','600','700'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','500'] })

export const metadata: Metadata = {
  title: { default: 'Gerbangku — Platform Bisnis UMKM Bali', template: '%s | Gerbangku' },
  description: 'Kelola bisnis UMKM Bali dengan mudah — inventory, sales, invoice, WA bot dalam satu platform.',
  openGraph: { type: 'website', locale: 'id_ID', siteName: 'Gerbangku' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
