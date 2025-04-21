'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'

type ReceiveModalProps = {
  onClose: () => void
}

export function ReceiveModal({ onClose }: ReceiveModalProps) {
  const [isCopied, setIsCopied] = useState(false)
  const address = '0x1234...5678' // TODO: Replace with actual wallet address

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Receive USDC</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl border-2 border-gray-100">
              <QRCodeSVG 
                value={address}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#382261"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                readOnly
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-purple-deep"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`px-4 rounded-xl font-medium transition-colors ${
                  isCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isCopied ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  'Copy'
                )}
              </motion.button>
            </div>
          </div>

          <p className="text-sm text-center text-gray-500">
            Send only USDC to this address
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
} 