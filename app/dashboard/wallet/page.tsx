'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { SendModal } from '@/components/wallet/SendModal'
import { ReceiveModal } from '@/components/wallet/ReceiveModal'
import { TransactionList } from '@/components/wallet/TransactionList'

export default function WalletPage() {
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const balance = 0 // TODO: Replace with actual balance

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Balance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <motion.div
              key={balance}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="mt-1 flex items-baseline gap-2"
            >
              <h1 className="text-3xl font-bold text-gray-900">
                {balance.toLocaleString()}
              </h1>
              <span className="text-lg text-gray-500">USDC</span>
            </motion.div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSendOpen(true)}
                className="flex items-center justify-center gap-2 bg-purple-deep hover:bg-purple-deep/90 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              >
                <ArrowUpIcon className="w-4 h-4" />
                Send
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsReceiveOpen(true)}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-3 rounded-xl font-medium text-sm border border-gray-200 transition-colors"
              >
                <ArrowDownIcon className="w-4 h-4" />
                Receive
              </motion.button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-900">Recent Activity</h2>
                <button className="text-sm text-purple-deep hover:text-purple-light">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <TransactionList />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isSendOpen && (
          <SendModal onClose={() => setIsSendOpen(false)} />
        )}
        {isReceiveOpen && (
          <ReceiveModal onClose={() => setIsReceiveOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
} 