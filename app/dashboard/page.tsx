'use client'

import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { CreateLinkModal } from '@/components/CreateLinkModal'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  status: 'Completed' | 'Pending';
  payer: string;
  amount: number;
  timestamp: string;
}

const transactions: Transaction[] = []

interface User {
  username: string;
  name: string;
  email: string;
  image: string;
  public_key: string | null;
  link: string;
  balance: number;
}

interface Link {
  id: string;
  user_id: string;
  link: string;
  created_at: string;
}

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()
  const { user } = usePrivy()
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [links, setLinks] = useState<Link[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState({
    user: false,
    links: false
  })

  const isFullyLoaded = !isLoading && userData !== null && links.length >= 0

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links/fetch', {
        method: 'POST',
        body: JSON.stringify({ privy_id: user?.id })
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
      setIsDataLoaded(prev => ({ ...prev, links: true }))
    }
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/fetch', {
          method: 'POST',
          body: JSON.stringify({ privy_id: user?.id })
        })
        const data = await response.json()

        if(data.error) {
          console.log(data.error)
        }

        if(response.ok){
          if(!data.onboarded) {
            console.log('User not onboarded')
            router.push('/onboarding')
            return
          }
    
          const userdata = {
            username: data.username,
            name: data.name,
            email: data.email,
            image: data.image,
            public_key: data.public_key,
            link: data.link,
            balance: data.balance
          }

          setUserData(userdata)

          if(localStorage.getItem('userdata') === null || JSON.parse(localStorage.getItem('userdata') || '{}').username !== userdata.username) {
            localStorage.setItem('userdata', JSON.stringify(userdata))
          }
          
          console.log(userdata)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsDataLoaded(prev => ({ ...prev, user: true }))
      }
    }
    
    if (user?.id) {
      console.log(user)
      fetchUserData()
      fetchLinks()
    } else {
      setIsDataLoaded({ user: true, links: true })
    }
  }, [user?.id, router])

  // Update loading state when both data sources are loaded
  useEffect(() => {
    if (isDataLoaded.user && isDataLoaded.links) {
      setIsLoading(false)
    }
  }, [isDataLoaded])
  
  if (!isFullyLoaded) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            {/* Welcome Card Skeleton */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 relative overflow-hidden animate-pulse">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-1/3 mt-8"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2].map((item) => (
                  <div key={item} className="p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-200 rounded-lg w-1/5"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-1/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Welcome Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-deep to-purple-light rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              
              {/* Mobile Layout */}
              <div className="sm:hidden relative space-y-5">
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-semibold">
                    Welcome back, {userData?.name}
                  </h1>
                  <p className="text-sm text-white/80">
                    Your balance is growing steadily
                  </p>
                </div>

                <div>
                  <div className="text-3xl font-bold">
                    ${userData?.balance}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                    <ArrowUpIcon className="w-3.5 h-3.5" />
                    <span>12.5% from last month</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10"
                >
                  + Create Link
                </motion.button>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block relative">
                <div className="flex justify-between items-center gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold">
                      Welcome back, {userData?.name}
                    </h1>
                    <p className="text-white/80">
                      Your balance is growing steadily
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10"
                  >
                    + Create Link
                  </motion.button>
                </div>
                <div className="mt-8">
                  <div className="text-5xl font-bold">
                    ${userData?.balance}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <ArrowUpIcon className="w-3.5 h-3.5" />
                    <span>12.5% from last month</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Active Links</h3>
                  <span className="bg-purple-50 text-purple-deep px-3 py-1 rounded-full text-sm font-medium">
                    {links.length} Total
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {links.length}
                </div>
                <p className="mt-2 text-sm text-gray-500">Links with recent activity</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Transactions</h3>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    This Week
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="mt-2 text-sm text-gray-500">0 new transactions</p>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                  <button className="text-sm text-purple-deep hover:text-purple-light">
                    View All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          tx.status === 'Completed' ? 'bg-green-50' : 'bg-yellow-50'
                        }`}>
                          {tx.type === 'incoming' ? (
                            <ArrowDownIcon className={`w-5 h-5 ${
                              tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                          ) : (
                            <ArrowUpIcon className={`w-5 h-5 ${
                              tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">{tx.payer}</p>
                            <p className="font-medium text-gray-900">
                              ${tx.amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                            <p className={`text-sm ${
                              tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {tx.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No transactions yet
                  </div>
                )}
              </div>
            </motion.div>
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