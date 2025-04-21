'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  LinkIcon,
  ChartBarIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

type PaymentLink = {
  id: string
  user_id: string
  type: string
  name: string
  description: string | null
  link: string
  status: string
  amount: number | null
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
  products?: Product[] | null
}

type Product = {
  id: string
  link_id: string
  download_link: string
  image_urls: string[] | null
  created_at: string
}

type User = {
  id: string
  username: string
  name: string
  image: string
  public_key?: string
}

export default function CreatorPage() {
  const params = useParams()
  const { username } = params
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshPage = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch the user by username
        const userResponse = await fetch(`/api/users/fetch-by-username?username=${username}`)
        const userResult = await userResponse.json()
        
        if (!userResult.privy_id) {
          setError('Creator not found')
          setIsLoading(false)
          return
        }
        
        setUser(userResult)
        
        // Fetch the creator's active payment links
        const linksResponse = await fetch(`/api/links/fetch-by-user?privyId=${userResult.privy_id}`)
        const linksResult = await linksResponse.json()
        
        setLinks(linksResult)
      } catch (error) {
        console.error('Error fetching creator data:', error)
        setError('Failed to load creator profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreatorData()
  }, [username, refreshTrigger])

  const formatAmount = (amount: number | null, currency: string) => {
    if (amount === null) return '0'
    return `${currency === 'USDC' ? '$' : ''}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCopyAddress = async () => {
    if (user?.public_key) {
      await navigator.clipboard.writeText(user.public_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-50 rounded-full mb-4">
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Creator Not Found</h1>
            <p className="text-gray-500 mb-6">{error || 'This creator does not exist'}</p>
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
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="text-xl font-bold">
                  <span className="text-gray-900">bree</span>
                  <span className="text-purple-600">eve</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Creator Profile */}
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex items-center space-x-6">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-purple-50">
                  <Image
                    src={user.image || '/default-avatar.png'}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <p className="text-gray-500 text-lg">@{user.username}</p>
                </div>
              </div>

              {user.public_key && (
                <div className="flex flex-col items-center space-y-4 bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
                  <p className="text-sm font-semibold text-purple-700">Scan to tip</p>
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <QRCodeSVG 
                      value={user.public_key}
                      size={140}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors bg-white px-4 py-2 rounded-lg border border-purple-100 hover:border-purple-200"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Copy address</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Links Grid */}
          {links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={`/${username}/${link.link.split('/').pop()}`}
                  className="group block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-purple-100"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{link.name}</h2>
                    {link.description && (
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">{link.description}</p>
                    )}
                    
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 mr-3">
                          <CurrencyDollarIcon className="w-4 h-4" />
                        </div>
                        <span className="text-gray-700">
                          {link.is_flexible_amount 
                            ? 'Flexible Amount' 
                            : formatAmount(link.amount, link.currency)}
                        </span>
                      </div>
                      
                      {link.expires_at && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 mr-3">
                            <ClockIcon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700">Expires {formatDate(link.expires_at)}</span>
                        </div>
                      )}
                      
                      {link.payment_limit !== null && (
                        <div className="flex items-center text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 mr-3">
                            <ChartBarIcon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700">{link.sales} of {link.payment_limit} payments used</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 bg-purple-50 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Links Yet</h3>
              <p className="text-gray-500">This creator hasn&apos;t created any payment links yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 