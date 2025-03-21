'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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

type PaymentLink = {
  id: string
  name: string
  amount: number | 'Any Amount'
  status: 'Active' | 'Expired' | 'Disabled'
  createdAt: string
  url: string
  description: string
}

const mockLinks: PaymentLink[] = [
  {
    id: '1',
    name: 'Freelance Project Payment',
    description: 'Payment for website redesign project',
    amount: 1500,
    status: 'Active',
    createdAt: '2024-03-10T10:00:00Z',
    url: 'https://pay.breeve.com/freelance-project'
  },
  {
    id: '2',
    name: 'Monthly Subscription',
    description: 'Recurring payment for premium services',
    amount: 'Any Amount',
    status: 'Active',
    createdAt: '2024-03-09T15:30:00Z',
    url: 'https://pay.breeve.com/monthly-sub'
  },
  {
    id: '3',
    name: 'One-time Donation',
    description: 'Support our community initiatives',
    amount: 50,
    status: 'Expired',
    createdAt: '2024-03-08T09:15:00Z',
    url: 'https://pay.breeve.com/donation'
  }
]

export default function PaymentLinks() {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredLinks = mockLinks.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || link.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const copyToClipboard = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
              Manage and track your payment links
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
                    className="group cursor-pointer"
                    onClick={() => router.push(`/dashboard/links/${link.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 group-hover:text-purple-deep transition-colors">
                        {link.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {link.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">
                        {typeof link.amount === 'number' ? `$${link.amount.toLocaleString()}` : link.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        link.status === 'Active' 
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : link.status === 'Expired'
                          ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                          : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {new Date(link.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                          onClick={() => copyToClipboard(link.url, link.id)}
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
                        >
                          <PencilIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    <p className="text-sm text-gray-500">{link.description}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof link.amount === 'number' ? `$${link.amount.toLocaleString()}` : link.amount}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    link.status === 'Active' 
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                      : link.status === 'Expired'
                      ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                      : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
                  }`}>
                    {link.status}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(link.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-500 hover:text-purple-deep hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={() => copyToClipboard(link.url, link.id)}
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
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      <CreateLinkModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
} 