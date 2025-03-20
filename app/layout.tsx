import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Breeeve - Seamless USDC Payments Platform',
  description: 'Accept payments, automate product delivery, and manage earnings with ease. No wallet setup required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans bg-white dark:bg-gray-900">
        {children}
      </body>
    </html>
  )
}
