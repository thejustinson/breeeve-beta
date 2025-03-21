'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

type CreateLinkModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    isFlexibleAmount: false,
    expirationDate: '',
    paymentLimit: '',
    downloadLink: '',
    redirectUrl: '',
    enableEmailNotifications: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log(formData)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Create Payment Link
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                          placeholder="e.g., Freelance Payment"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                          placeholder="Add a description for your reference"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Amount
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={!formData.isFlexibleAmount}
                              onChange={() => setFormData({ ...formData, isFlexibleAmount: false })}
                              className="h-4 w-4 text-purple-deep focus:ring-purple-deep/20"
                            />
                            <label className="ml-2 text-sm text-gray-700">Fixed Amount (USDC)</label>
                          </div>
                          {!formData.isFlexibleAmount && (
                            <input
                              type="number"
                              value={formData.amount}
                              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                              placeholder="Enter amount in USDC"
                            />
                          )}
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={formData.isFlexibleAmount}
                              onChange={() => setFormData({ ...formData, isFlexibleAmount: true, amount: '' })}
                              className="h-4 w-4 text-purple-deep focus:ring-purple-deep/20"
                            />
                            <label className="ml-2 text-sm text-gray-700">Allow any amount</label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.expirationDate}
                          onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Limit (Optional)
                        </label>
                        <input
                          type="number"
                          value={formData.paymentLimit}
                          onChange={(e) => setFormData({ ...formData, paymentLimit: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                          placeholder="Maximum number of payments allowed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Digital Product Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.downloadLink}
                          onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                          placeholder="Enter download link (Google Drive, IPFS, etc.)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.redirectUrl}
                          onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                          placeholder="Enter URL to redirect after payment"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.enableEmailNotifications}
                          onChange={(e) => setFormData({ ...formData, enableEmailNotifications: e.target.checked })}
                          className="h-4 w-4 text-purple-deep focus:ring-purple-deep/20 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Enable email notifications for payments
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                        step === 1
                          ? 'invisible'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type={step === 3 ? 'submit' : 'button'}
                      onClick={() => step < 3 && setStep(step + 1)}
                      className="px-5 py-2.5 bg-purple-deep text-white rounded-xl text-sm font-medium hover:bg-purple-deep/90 transition-colors"
                    >
                      {step === 3 ? 'Create Link' : 'Next'}
                    </motion.button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 