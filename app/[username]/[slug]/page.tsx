'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  LinkIcon, 
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

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
  product?: Product | null
}

type Product = {
  id: string
  link_id: string
  download_link: string
  image_urls: string[]
  created_at: string
}

type User = {
  id: string
  username: string
  name: string
  image: string
}

export default function CheckoutPage() {
  const params = useParams()
  const { username, slug } = params
  const [link, setLink] = useState<PaymentLink | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLinkData = async () => {
      if (!username || !slug) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // First, fetch the user by username
        const userResponse = await fetch(`/api/users/fetch-by-username?username=${username}`)
        const userResult = await userResponse.json()
        
        if (!userResult.id) {
          setError('User not found')
          setIsLoading(false)
          return
        }
        
        setUser(userResult)
        
        // Then fetch the link using the user ID and slug
        const linkPath = `/${username}/${slug}`
        const linkResponse = await fetch('/api/links/fetch-by-path', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userResult.id,
            link: linkPath
          })
        })
        
        const linkResult = await linkResponse.json()
        console.log(linkResult)
        
        if (!linkResult.data || linkResult.data.length === 0) {
          setError('Link not found')
          setIsLoading(false)
          return
        }
        
        const linkData = linkResult.data[0]
        
        // Check if the link is expired
        const now = new Date()
        const expiryDate = linkData.expires_at ? new Date(linkData.expires_at) : null
        if (expiryDate && now > expiryDate) {
          setError('This link has expired')
          setIsLoading(false)
          return
        }
        
        // Check if the link has reached its payment limit
        if (linkData.payment_limit !== null && linkData.sales >= linkData.payment_limit) {
          setError('This link has reached its payment limit')
          setIsLoading(false)
          return
        }
        
        // Check if the link is inactive
        if (linkData.status !== 'active') {
          setError('This link is not active')
          setIsLoading(false)
          return
        }
        
        // Set the initial amount if it's not flexible
        if (!linkData.is_flexible_amount) {
          setAmount(linkData.amount)
        }
        
        // Increment the click count
        await fetch('/api/links/increment-clicks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            link_id: linkData.id
          })
        })
        
        setLink(linkData)
      } catch (error) {
        console.error('Error fetching link data:', error)
        setError('Failed to load link details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinkData()
  }, [username, slug])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setAmount(isNaN(value) ? null : value)
  }

  const handlePayment = async () => {
    if (!link || !amount) return
    
    setIsProcessing(true)
    setPaymentStatus('processing')
    setPaymentError(null)
    
    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Record the sale
      const response = await fetch('/api/links/record-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          link_id: link.id,
          amount: amount
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to record sale')
      }
      
      setPaymentStatus('success')
      
      // If there's a redirect URL, redirect after a delay
      if (link.redirect_url) {
        setTimeout(() => {
          window.location.href = link.redirect_url!
        }, 2000)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setPaymentStatus('failed')
      setPaymentError('Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return `${currency === 'USDC' ? '$' : ''}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-md p-6">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-50 rounded-full mb-4">
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Link Unavailable</h1>
            <p className="text-gray-500 mb-6">{error || 'This link is not available'}</p>
            <a 
              href="/"
              className="text-purple-deep hover:text-purple-deep/80 font-medium"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold">
                <span className="text-gray-900">bree</span>
                <span className="text-purple-light">eve</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Start selling text */}
      <div className="fixed bottom-4 right-4 bg-purple-light rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
        <a href="/auth" className="text-sm text-purple-deep font-medium">
          Start selling with Breeeve
        </a>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Product Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{link.name}</h1>
                  {user && (
                    <p className="mt-1 text-sm text-gray-500">by {user.name}</p>
                  )}
                </div>
                
                {link.description && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-600">{link.description}</p>
                  </div>
                )}
                
                {/* Product Images Section - Only show if it's a product link */}
                {link.type === 'product' && link.product && link.product.image_urls && link.product.image_urls.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {link.product.image_urls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                          <Image 
                            src={url} 
                            alt={`Product image ${index + 1}`} 
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="mt-1 text-gray-900">
                        {link.is_flexible_amount 
                          ? 'Flexible Amount' 
                          : formatAmount(link.amount, link.currency)}
                      </p>
                    </div>
                  </div>
                  
                  {link.expires_at && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-purple-deep" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Expires</p>
                        <p className="mt-1 text-gray-900">{formatDate(link.expires_at)}</p>
                      </div>
                    </div>
                  )}
                  
                  {link.payment_limit !== null && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ChartBarIcon className="w-5 h-5 text-purple-deep" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Payment Limit</p>
                        <p className="mt-1 text-gray-900">
                          {link.sales} of {link.payment_limit} payments used
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Payment Form */}
              <div className="flex-1">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Complete Your Purchase</h2>
                  
                  {paymentStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <CheckIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                      <p className="text-gray-500 mb-4">Thank you for your purchase.</p>
                      {link.redirect_url ? (
                        <p className="text-sm text-gray-500">Redirecting you to the download page...</p>
                      ) : (
                        <p className="text-sm text-gray-500">You will receive your product shortly.</p>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                      {link.is_flexible_amount ? (
                        <div className="mb-6">
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Amount
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">{link.currency === 'USDC' ? '$' : ''}</span>
                            </div>
                            <input
                              type="number"
                              name="amount"
                              id="amount"
                              className="block w-full rounded-md border-0 py-3 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-deep sm:text-sm sm:leading-6"
                              placeholder="0.00"
                              value={amount || ''}
                              onChange={handleAmountChange}
                              min="0.01"
                              step="0.01"
                              required
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-gray-500 sm:text-sm">{link.currency}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-700 mb-1">Amount</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {formatAmount(link.amount, link.currency)}
                          </p>
                        </div>
                      )}
                      
                      {paymentStatus === 'failed' && (
                        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                          {paymentError || 'Payment failed. Please try again.'}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isProcessing || (link.is_flexible_amount && !amount)}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-deep hover:bg-purple-deep/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                      </button>
                      
                      <p className="mt-4 text-xs text-gray-500 text-center">
                        By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 