'use client'

import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'

export default function AuthPage() {
  const { login, logout, ready, authenticated } = usePrivy()

  if (!ready) {
    return null
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Dev logout button */}
      {authenticated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => logout()}
          className="fixed top-4 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium"
        >
          Logout (Dev)
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
      >
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">bree</span>
              <span className="text-purple-light">eve</span>
            </h1>
          </Link>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xl text-gray-900 font-medium">
              Accept Payments
            </p>
            <p className="text-gray-500">
              No wallet setup required
            </p>
          </div>

          <motion.button
            onClick={() => login()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-purple-deep hover:bg-purple-light text-white py-4 rounded-lg font-medium transition-colors"
          >
            Continue with Privy
          </motion.button>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex-1 border-t border-gray-200" />
            <span>Secure login</span>
            <span className="flex-1 border-t border-gray-200" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-purple-deep hover:text-purple-light">
            Terms
          </Link>
          {' '}&{' '}
          <Link href="/privacy" className="text-purple-deep hover:text-purple-light">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  )
} 