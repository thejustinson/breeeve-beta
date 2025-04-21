'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  ClipboardIcon, 
  CheckIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LinkIcon,
  BellIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { EditLinkModal } from '@/components/EditLinkModal'
import { DeleteLinkModal } from '@/components/DeleteLinkModal'
import { usePrivy } from '@privy-io/react-auth'
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
  product?: Product
}

type Product = {
  id: string
  link_id: string
  download_link: string
  image_urls: string[]
  created_at: string
}

export default function LinkDashboard({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = usePrivy()
  const [link, setLink] = useState<PaymentLink | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchLink = async () => {
      if (!user?.id) return
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/links/fetch', {
          method: 'POST',
          body: JSON.stringify({ 
            privy_id: user.id,
            link_id: params.id
          })
        })
        
        const result = await response.json()
        
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          const linkData = result.data[0]
          setLink(linkData)
          
          // Set product data if it exists
          if (linkData.product) {
            setProduct(linkData.product)
          }
        } else {
          setError('Link not found')
        }
      } catch (error) {
        console.error('Error fetching link:', error)
        setError('Failed to load link details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLink()
  }, [user?.id, params.id])

  // Function to determine the actual status of a link
  const getActualStatus = (link: PaymentLink): string => {
    // Check if the link is expired
    const now = new Date();
    const expiryDate = link.expires_at ? new Date(link.expires_at) : null;
    if (expiryDate && now > expiryDate) {
      return 'expired';
    }
    
    // Check if the link has reached its payment limit
    // Only apply "used" status if payment_limit is not null
    if (link.payment_limit !== null && link.sales >= link.payment_limit) {
      return 'used';
    }
    
    // Otherwise, use the status from the database
    return link.status;
  }

  const copyToClipboard = async () => {
    if (!link) return
    
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${link.link}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      case 'inactive':
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
      case 'used':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
      default:
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
    }
  }

  const handleEditSuccess = (updatedLink: PaymentLink) => {
    setLink(updatedLink)
  }

  const handleDeleteSuccess = () => {
    router.push('/dashboard/links')
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-red-600">{error || 'Link not found'}</p>
          <button 
            onClick={() => router.push('/dashboard/links')}
            className="mt-4 text-sm text-red-600 hover:text-red-700"
          >
            Return to Links
          </button>
        </div>
      </div>
    )
  }

  const actualStatus = getActualStatus(link)

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard/links')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {link.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {formatDate(link.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-purple-deep text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-deep/90 transition-colors shadow-sm"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Link Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Link Info */}
            <div className="flex-1 space-y-6">
              {/* Product Images Section - Only show if it's a product link */}
              {link.type === 'product' && product && product.image_urls && product.image_urls.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {product.image_urls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <img 
                          src={url} 
                          alt={`Product image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Link Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Payment Link</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-gray-900 font-mono text-sm truncate">
                          {window.location.origin}{link.link}
                        </p>
                        <button 
                          onClick={copyToClipboard}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {copied ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <ClipboardIcon className="w-4 h-4" />
                          )}
                        </button>
                        <a 
                          href={`${window.location.origin}${link.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="mt-1 text-gray-900">
                        {formatAmount(link.amount, link.is_flexible_amount, link.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ChartBarIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(actualStatus)}`}>
                          {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {link.description && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-deep">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1 text-gray-900">{link.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {link.type === 'product' && product && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <PhotoIcon className="w-5 h-5 text-purple-deep" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Download Link</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-gray-900 font-mono text-sm truncate">
                            {product.download_link}
                          </p>
                          <a 
                            href={product.download_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Stats */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Performance</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Clicks</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{link.clicks}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Sales</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{link.sales}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Amount Sold</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {link.amount_sold ? `${link.currency === 'USDC' ? '$' : ''}${link.amount_sold.toLocaleString()}` : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {link.clicks > 0 ? `${Math.round((link.sales / link.clicks) * 100)}%` : '-'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Expiration</p>
                      <p className="mt-1 text-gray-900">
                        {link.expires_at ? formatDate(link.expires_at) : 'No expiration'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ChartBarIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Payment Limit</p>
                      <p className="mt-1 text-gray-900">
                        {link.payment_limit !== null ? `${link.payment_limit} payments` : 'No limit'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Redirect URL</p>
                      <p className="mt-1 text-gray-900">
                        {link.redirect_url || 'No redirect'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <BellIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Notifications</p>
                      <p className="mt-1 text-gray-900">
                        {link.enable_notifications ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Link Modal */}
      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        link={link}
        onSuccess={handleEditSuccess}
      />
      
      {/* Delete Link Modal */}
      <DeleteLinkModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        link={link}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
} 