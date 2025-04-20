'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { CreateLinkModal } from '@/components/CreateLinkModal'
import { EditLinkModal } from '@/components/EditLinkModal'
import { DeleteLinkModal } from '@/components/DeleteLinkModal'
import { usePrivy } from '@privy-io/react-auth'

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

export default function PaymentLinks() {
  const router = useRouter()
  const { user } = usePrivy()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null)
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingLink, setDeletingLink] = useState<PaymentLink | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch('/api/links/fetch', {
          method: 'POST',
          body: JSON.stringify({ privy_id: user.id })
        })
        const result = await response.json()
        
        if (result.data && Array.isArray(result.data)) {
          setLinks(result.data)
        } else {
          console.error('Invalid link data format:', result)
          setLinks([])
        }
      } catch (error) {
        console.error('Error fetching links:', error)
        setLinks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinks()
  }, [user?.id])

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         link.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || link.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const copyToClipboard = async (url: string, id: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const formatAmount = (amount: number, isFlexible: boolean, currency: string) => {
    if (isFlexible) return 'Any Amount'
    return `${currency === 'USDC' ? '$' : ''}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
      case 'expired':
        return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
      case 'disabled':
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
      default:
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
    }
  }
  
  // Edit link functions
  const openEditModal = (link: PaymentLink, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingLink(link)
    setIsEditModalOpen(true)
  }
  
  const handleEditSuccess = (updatedLink: PaymentLink) => {
    // Update the links list with the edited link
    setLinks(prevLinks => 
      prevLinks.map(link => 
        link.id === updatedLink.id 
          ? updatedLink 
          : link
      )
    )
  }
  
  // Delete link functions
  const openDeleteModal = (link: PaymentLink, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingLink(link)
    setIsDeleteModalOpen(true)
  }
  
  const handleDeleteSuccess = (linkId: string) => {
    // Remove the deleted link from the list
    setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId))
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-64 mt-2"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-10 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden lg:block">
            <div className="h-12 bg-gray-50/50 animate-pulse"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 border-b border-gray-100 animate-pulse"></div>
            ))}
          </div>
          <div className="lg:hidden divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Payment Links
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {links.length} {links.length === 1 ? 'link' : 'links'} created
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-purple-deep text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-deep/90 transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Link</span>
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[140px] px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
            <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:border-purple-deep/20 hover:bg-purple-50 transition-colors">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links Table/Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Link Details</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLinks.map((link) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                    className="group"
                    // onClick={() => router.push(`/dashboard/links/${link.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 group-hover:text-purple-deep transition-colors">
                        {link.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {link.description || 'No description'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">
                        {formatAmount(link.amount, link.is_flexible_amount, link.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {formatDate(link.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                          onClick={() => copyToClipboard(link.link, link.id)}
                        >
                          {copiedId === link.id ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <ClipboardIcon className="w-5 h-5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                          onClick={(e) => openEditModal(link, e)}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(e) => openDeleteModal(link, e)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-100">
            {filteredLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/dashboard/links/${link.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{link.name}</p>
                    <p className="text-sm text-gray-500">{link.description || 'No description'}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatAmount(link.amount, link.is_flexible_amount, link.currency)}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                    {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {formatDate(link.created_at)}
                  </span>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={() => copyToClipboard(link.link, link.id)}
                    >
                      {copiedId === link.id ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={(e) => openEditModal(link, e)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => openDeleteModal(link, e)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {/* Edit Link Modal */}
      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        link={editingLink}
        onSuccess={handleEditSuccess}
      />
      
      {/* Delete Link Modal */}
      <DeleteLinkModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        link={deletingLink}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
} 