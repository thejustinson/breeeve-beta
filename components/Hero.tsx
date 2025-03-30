'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent,transparent_23px,#A390F508_23px,#A390F508_24px),repeating-linear-gradient(90deg,transparent,transparent_23px,#38226108_23px,#38226108_24px)]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-purple-light/10 rounded-full"
          >
            <span className="text-purple-deep font-medium">
              💫 Early Access
            </span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight">
            Accept USDC Payments{' '}
            <span className="bg-gradient-to-r from-purple-light to-purple-deep bg-clip-text text-transparent">
              Without The Complexity
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Accept payments, automate product delivery, and manage earnings with ease. 
            No wallet setup required.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-deep hover:bg-purple-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 shadow-lg shadow-purple-light/20"
            >
              Get Started →
            </motion.button>
            </Link>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl text-lg font-semibold text-gray-600 hover:text-purple-deep transition-colors duration-200"
            >
              Learn More
            </motion.button> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-8 text-sm text-gray-500 flex items-center justify-center gap-8"
          >
            <span className="flex items-center gap-2">
              ✨ No Seed Phrase
            </span>
            <span className="flex items-center gap-2">
              🔒 Secure Transactions
            </span>
            <span className="flex items-center gap-2">
              ⚡️ Instant Payments
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 