'use client'

import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { CreateLinkModal } from '@/components/CreateLinkModal'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

const mockTransactions = [
  {
    id: '1',
    payer: 'alice.sol',
    amount: 100,
    status: 'Completed',
    timestamp: '2024-03-10T10:00:00Z',
    type: 'incoming'
  },
  {
    id: '2',
    payer: 'bob.sol',
    amount: 50,
    status: 'Pending',
    timestamp: '2024-03-10T09:30:00Z',
    type: 'incoming'
  },
]

interface User {
  username: string;
  name: string;
  email: string;
  image: string;
  public_key: string | null;
  link: string;
  balance: number;
}

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()
  const { authenticated, user } = usePrivy()
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
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

          if(!userdata.public_key) {
            const publicKey = user?.linkedAccounts.find(
              account => account.type === "wallet" && account.chainType === "solana"
          ) as { address: string } | undefined;

            const update_public_key = await fetch('api/users/update/public-key', {
              method: 'POST',
              body: JSON.stringify({ public_key: publicKey, privy_id: user?.id })
            })

            if(!update_public_key.ok) {
              console.log('Error updating public key')
            }
            
            userdata.public_key = publicKey
          }

          setUserData(userdata)
          console.log(userdata)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user?.id) {
      fetchUserData()
    } else {
      setIsLoading(false)
    }
  }, [user?.id, router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-deep/20 border-t-purple-deep rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
                    Welcome back, Alex
                  </h1>
                  <p className="text-sm text-white/80">
                    Your balance is growing steadily
                  </p>
                </div>

                <div>
                  <div className="text-3xl font-bold">
                    $1,234.56
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
                      Welcome back, Alex
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
                    $1,234.56
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
                    5 Total
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">3</div>
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
                <div className="text-3xl font-bold text-gray-900">48</div>
                <p className="mt-2 text-sm text-gray-500">8 new transactions</p>
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
                {mockTransactions.map((tx, index) => (
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
                ))}
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