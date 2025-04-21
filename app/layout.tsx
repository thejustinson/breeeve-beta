import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PrivyProviderWrapper } from "@/components/PrivyProviderWrapper";
import { AuthStatus } from "@/components/AuthStatus";
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Breeeve - Seamless USDC Payments Platform',
  description: 'Accept payments, automate product delivery, and manage earnings with ease. No wallet setup required.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <PrivyProviderWrapper>
          <AuthStatus />
          <body className="font-sans bg-white dark:bg-gray-900">
            {children}
          </body>
      </PrivyProviderWrapper>
    </html>
  )
}