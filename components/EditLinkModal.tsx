import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'

type PaymentLink = {
  id: string
  user_id: string
  type: string
  product_id: string | null
  name: string
  description: string
  link: string
  status: string
  amount: number
  is_flexible_amount: boolean
  currency: string
  payment_limit: number | null
  clicks: number
  created_at: string
  expires_at: string | null
  redirect_url: string | null
  enable_notifications: boolean
  sales: number
  amount_sold: number | null
}

interface EditLinkModalProps {
  isOpen: boolean
  onClose: () => void
  link: PaymentLink | null
  onSuccess: (updatedLink: PaymentLink) => void
}

export function EditLinkModal({ isOpen, onClose, link, onSuccess }: EditLinkModalProps) {
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    is_flexible_amount: false,
    currency: 'USDC',
    status: 'active',
    enable_notifications: true,
    payment_limit: null as number | null,
    expires_at: null as string | null,
    redirect_url: null as string | null
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Update form data when link changes
  useEffect(() => {
    if (link) {
      // Determine if the link is expired or used
      const now = new Date();
      const expiryDate = link.expires_at ? new Date(link.expires_at) : null;
      const isExpired = expiryDate && now > expiryDate;
      
      // Only consider a link "used" if payment_limit is not null
      const isUsed = link.payment_limit !== null && link.sales >= link.payment_limit;
      
      // If the link is expired or used, we should set it to inactive
      const effectiveStatus = isExpired || isUsed ? 'inactive' : link.status;
      
      setEditFormData({
        name: link.name,
        description: link.description || '',
        amount: link.amount,
        is_flexible_amount: link.is_flexible_amount,
        currency: link.currency,
        status: effectiveStatus,
        enable_notifications: link.enable_notifications,
        payment_limit: link.payment_limit,
        expires_at: link.expires_at,
        redirect_url: link.redirect_url
      })
    }
  }, [link])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setEditFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }))
    } else if (name === 'amount' || name === 'payment_limit') {
      setEditFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseFloat(value)
      }))
    } else if (name === 'expires_at') {
      setEditFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : value
      }))
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link) return
    
    setIsEditing(true)
    setEditError(null)
    
    try {
      // Validate status
      if (editFormData.status !== 'active' && editFormData.status !== 'inactive') {
        setEditError('Invalid status value. Status must be either active or inactive.')
        setIsEditing(false)
        return
      }

      // Check if the link should be expired based on expiration date
      const now = new Date();
      const expiryDate = editFormData.expires_at ? new Date(editFormData.expires_at) : null;
      const isExpired = expiryDate && now > expiryDate;
      
      // If the link is expired, we should set it to inactive instead
      if (isExpired && editFormData.status === 'active') {
        setEditError('This link has expired. Please set it to inactive.')
        setIsEditing(false)
        return
      }

      const response = await fetch('/api/links/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          link_id: link.id,
          ...editFormData
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Call the success callback with the updated link
        onSuccess({ ...link, ...editFormData })
        onClose()
      } else {
        setEditError(result.error || 'Failed to update link')
      }
    } catch (error) {
      console.error('Error updating link:', error)
      setEditError('An unexpected error occurred')
    } finally {
      setIsEditing(false)
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 15, transition: { duration: 0.3 } }
  };

  if (!link) return null;

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Edit Link
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      {...fadeInUp}
                      className="space-y-8"
                    >
                      {editError && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                          {editError}
                        </div>
                      )}
                      
                      {/* Basic Information Section */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Link Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditChange}
                              rows={3}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Settings Section */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Amount Type
                            </label>
                            <div className="space-y-4">
                              <div className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  id="fixed-amount"
                                  checked={!editFormData.is_flexible_amount}
                                  onChange={() =>
                                    setEditFormData({
                                      ...editFormData,
                                      is_flexible_amount: false,
                                    })
                                  }
                                  className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20"
                                />
                                <label htmlFor="fixed-amount" className="ml-3 text-sm text-gray-700 font-medium">
                                  Fixed Amount
                                </label>
                              </div>
                              {!editFormData.is_flexible_amount && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="ml-8"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditChange}
                                        className="w-full pl-[68px] pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                                        min="0"
                                        step="0.01"
                                      />
                                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">
                                        {editFormData.currency}
                                      </div>
                                    </div>
                                    <div>
                                      <select
                                        id="currency"
                                        name="currency"
                                        value={editFormData.currency}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 shadow-sm text-gray-900"
                                      >
                                        <option value="USDC">USDC</option>
                                      </select>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              <div className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  id="flexible-amount"
                                  checked={editFormData.is_flexible_amount}
                                  onChange={() =>
                                    setEditFormData({
                                      ...editFormData,
                                      is_flexible_amount: true,
                                      amount: 0,
                                    })
                                  }
                                  className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20"
                                />
                                <label htmlFor="flexible-amount" className="ml-3 text-sm text-gray-700 font-medium">
                                  Flexible Amount (Buyer chooses)
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="payment_limit" className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Limit
                            </label>
                            <input
                              type="number"
                              id="payment_limit"
                              name="payment_limit"
                              value={editFormData.payment_limit || ''}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                              min="0"
                              placeholder="No limit"
                            />
                            <p className="mt-1 text-xs text-gray-500">Maximum number of times this link can be used. Leave empty for unlimited.</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Settings Section */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="datetime-local"
                              id="expires_at"
                              name="expires_at"
                              value={editFormData.expires_at || ''}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                            />
                            <p className="mt-1 text-xs text-gray-500">Leave empty for no expiration date.</p>
                          </div>

                          <div>
                            <label htmlFor="redirect_url" className="block text-sm font-medium text-gray-700 mb-1">
                              Redirect URL
                            </label>
                            <input
                              type="url"
                              id="redirect_url"
                              name="redirect_url"
                              value={editFormData.redirect_url || ''}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                              placeholder="https://example.com"
                            />
                            <p className="mt-1 text-xs text-gray-500">URL to redirect to after payment. Leave empty for no redirect.</p>
                          </div>

                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={editFormData.status}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                              Note: Links will automatically be marked as expired when they reach their expiration date, and as used when they reach their payment limit. You can only manually set a link to active or inactive.
                            </p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white transition-colors">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="enable_notifications"
                                name="enable_notifications"
                                checked={editFormData.enable_notifications}
                                onChange={handleEditChange}
                                className="h-5 w-5 text-purple-deep focus:ring-purple-deep/20 rounded"
                              />
                              <label htmlFor="enable_notifications" className="ml-3 text-sm font-medium text-gray-700">
                                Enable notifications
                              </label>
                            </div>
                            <p className="mt-1 ml-8 text-xs text-gray-500">
                              Get notified when someone makes a payment to this link
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEditing}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium bg-purple-deep text-white hover:bg-purple-deep/90 transition-colors disabled:opacity-50"
                    >
                      {isEditing ? 'Saving...' : 'Save Changes'}
                    </button>
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