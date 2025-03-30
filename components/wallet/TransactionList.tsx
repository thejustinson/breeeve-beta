'use client'

import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

type Transaction = {
  id: string
  type: 'sent' | 'received'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: Date
  address: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: 500,
    status: 'completed',
    date: new Date(),
    address: '0x1234...5678'
  },
  // Add more mock transactions as needed
]

export function TransactionList() {
  return (
    <div className="space-y-4">
      {mockTransactions.map((tx) => (
        <motion.div
          key={tx.id}
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${
              tx.type === 'received' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-purple-100 text-purple-deep'
            }`}>
              {tx.type === 'received' ? (
                <ArrowDownIcon className="w-5 h-5" />
              ) : (
                <ArrowUpIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {tx.type === 'received' ? 'Received' : 'Sent'} USDC
              </p>
              <p className="text-sm text-gray-500">{tx.address}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">
              {tx.type === 'received' ? '+' : '-'}{tx.amount} USDC
            </p>
            <div className="flex items-center gap-1 text-sm">
              {tx.status === 'completed' && (
                <CheckIcon className="w-4 h-4 text-green-500" />
              )}
              {tx.status === 'pending' && (
                <ClockIcon className="w-4 h-4 text-yellow-500" />
              )}
              {tx.status === 'failed' && (
                <XMarkIcon className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-500">
                {tx.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 