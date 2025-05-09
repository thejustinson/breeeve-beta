'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold"
          >
            <Link href="/">
              <span className="text-gray-900">bree</span>
              <span className="text-purple-light">eve</span>
            </Link>
          </motion.div>

          {/* <div className="flex items-center">
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-purple-deep hover:bg-purple-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </motion.button>
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-gray-600 hover:text-purple-deep transition-colors duration-200"
    >
      {children}
    </Link>
  )
} 