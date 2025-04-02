'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useContext, createContext } from 'react'
import { 
  HomeIcon, 
  LinkIcon, 
  CurrencyDollarIcon,
  WalletIcon,
  CogIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
const navItems = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: HomeIcon,
    badge: null
  },
  { 
    name: 'Wallet', 
    href: '/dashboard/wallet', 
    icon: WalletIcon,
    badge: null
  },
  { 
    name: 'Payment Links', 
    href: '/dashboard/links', 
    icon: LinkIcon,
    badge: '5'
  },
  { 
    name: 'Transactions',
    href: '/dashboard/transactions',
    icon: CurrencyDollarIcon,
    badge: null
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: CogIcon,
    badge: null
  },
]

type SideNavProps = {
  isOpen: boolean;
  onClose: () => void;
}

const SideNavContext = createContext({ onClose: () => {} })

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="h-16 fixed top-0 right-0 left-0 z-10 bg-white border-b border-gray-100">
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo - show on all screens */}
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold">
            <span className="text-gray-900">bree</span>
            <span className="text-purple-light">eve</span>
          </span>
        </Link>

        {/* Right side icons */}
        <div className="flex items-center gap-6">
          <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-deep rounded-full" />
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-deep to-purple-light flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <span className="text-sm font-medium hidden sm:block">Alex</span>
          </button>
          <button onClick={onMenuClick} className="text-gray-500 lg:hidden">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
  const pathname = usePathname()

  return (
    <SideNavContext.Provider value={{ onClose }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed top-0 left-0 h-screen bg-white border-r border-gray-100">
        <div className="h-16 px-6 flex items-center border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-gray-900">bree</span>
              <span className="text-purple-light">eve</span>
            </span>
          </Link>
        </div>

        <NavContent pathname={pathname} />
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-gray-900">bree</span>
              <span className="text-purple-light">eve</span>
            </span>
          </Link>
          <button onClick={onClose} className="text-gray-500">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <NavContent pathname={pathname} />
      </div>
    </SideNavContext.Provider>
  )
}

function NavContent({ pathname }: { pathname: string }) {
  const { onClose } = useContext(SideNavContext)
  const { logout } = usePrivy()
  const router = useRouter()

  return (
    <div className="p-4 space-y-2">
      <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Main Menu
      </p>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onClose()}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative group ${
              isActive 
                ? 'text-purple-deep bg-purple-50' 
                : 'text-gray-500 hover:text-purple-deep hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${
              isActive ? 'text-purple-deep' : 'text-gray-400 group-hover:text-purple-deep'
            }`} />
            <span>{item.name}</span>
            {item.badge && (
              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                isActive 
                  ? 'bg-purple-deep/10 text-purple-deep' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-deep'
              }`}>
                {item.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute left-0 w-1 h-6 bg-purple-deep rounded-full my-auto top-0 bottom-0"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </Link>
        )
      })}

      {/* Bottom section */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="p-4 rounded-2xl bg-gray-50">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Need help?
          </p>
          <p className="text-sm text-gray-500 mb-3">
            We&apos;re here to assist you
          </p>
          <button className="w-full bg-white text-gray-700 hover:text-purple-deep px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-gray-200 hover:border-purple-deep/20">
            Contact Support
          </button>
        </div>

        <button className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        onClick={() => {
          logout()
          router.push('/')
        }}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
} 