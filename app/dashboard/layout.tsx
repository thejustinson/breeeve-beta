'use client'

import { useState } from 'react'
import { TopNav, SideNav } from '@/components/DashboardNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
      <SideNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="lg:pl-64 pt-16">
        <main>
          {children}
        </main>
      </div>
    </div>
  )
} 