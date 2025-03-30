'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { OnboardingProgress } from '@/components/OnboardingProgress'
import { usePrivy } from '@privy-io/react-auth'
import { useUploadThing } from "@/utils/uploadthing"
import {
  UserIcon,
  EnvelopeIcon,
  PhotoIcon,
  LinkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import confetti from 'canvas-confetti'

const steps = [
  {
    title: 'Choose Username',
    description: 'Select your unique payment handle'
  },
  {
    title: 'Add Email',
    description: 'Stay updated on payments'
  },
  {
    title: 'Profile Image',
    description: 'Upload or generate avatar'
  },
  {
    title: 'Review',
    description: 'Confirm your details'
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { user } = usePrivy()
  const [formData, setFormData] = useState({
    email: user?.email?.address || '',
    link: "",
    username: '',
    image: null as File | null,
    fullName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [checkingOnboardingStatus, setCheckingOnboardingStatus] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      setCheckingOnboardingStatus(true)
      try {
        const response = await fetch('/api/users/onboarded', {
          method: 'POST',
          body: JSON.stringify({ privy_id: user?.id })
        })
        const data = await response.json()
        if (data.onboarded) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setCheckingOnboardingStatus(false)
      }
    }
    
    if (user?.id) {
      checkOnboardingStatus()
    } else {
      setCheckingOnboardingStatus(false)
    }
  }, [user?.id, router])
  

  const handleUsernameChange = async (value: string) => {
    setFormData({ ...formData, username: value })
    setUsernameError(null)

    // Basic validation
    if (value.length === 0) {
      setIsUsernameAvailable(false)
      return
    }

    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters long')
      setIsUsernameAvailable(false)
      return
    }

    // Check if username contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, and underscores')
      setIsUsernameAvailable(false)
      return
    }

    // TODO: Add your server-side username check here

    const response = await fetch(`/api/users/username/search?username=${value}`)
    const data = await response.json()

    if (!data.available) {
      setUsernameError('Username is already taken')
      setIsUsernameAvailable(false)
      return
    }
    setIsUsernameAvailable(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  // Upload image to uploadthing

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (data) => {
      console.log("upload complete", data);
      const fileUrl = data[0].ufsUrl

      // Onboard user
      const publicKey = user?.linkedAccounts.find(
        account => account.type === "wallet" && account.chainType === "solana"
    ) as { address: string } | undefined;
      const response = await fetch('/api/users/onboard', {
        method: 'POST',
        body: JSON.stringify({
          privy_id: user?.id,
          email: user?.email?.address,
          username: formData.username,
          name: formData.fullName,
          image: fileUrl,
          public_key: publicKey?.address,
          link: `pay.breeeve.com/${formData.username}`
        })
      })
  
      if (response.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        console.error('Failed to onboard user')
      }
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true)
    // TODO: Add actual form submission

    startUpload(formData.image ? [formData.image] : []);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-20">
      {checkingOnboardingStatus ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-deep/20 border-t-purple-deep rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Checking your account...</p>
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">bree</span>
              <span className="text-purple-light">eve</span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full"
          >
            <div className="flex flex-col gap-12">
              <OnboardingProgress steps={steps} currentStep={currentStep} />

              <div className="flex-1 min-w-[320px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 w-full"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Choose your username</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          This will be your payment handle
                        </p>
                      </div>

                      <div className="space-y-2 w-full">
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                            placeholder="Enter username"
                            required
                          />
                        </div>
                        <div className="min-h-[20px]">
                          {formData.username && (
                            <p className={`text-sm ${usernameError
                                ? 'text-red-600'
                                : isUsernameAvailable
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                              }`}>
                              {usernameError || (isUsernameAvailable ? '✓ Username is available' : 'Enter at least 3 characters')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-1 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <LinkIcon className="w-4 h-4" />
                          <span>pay.breeeve.com/{formData.username || 'username'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Add your details</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Help others recognize you
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email Address</label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={user?.email?.address || formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-deep/20 focus:ring-2 focus:ring-purple-deep/10 text-gray-900 placeholder:text-gray-400"
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Profile Image</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Upload an image or use generated avatar
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-center">
                          {formData.image ? (
                            <img
                              src={URL.createObjectURL(formData.image)}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-purple-deep/10 flex items-center justify-center">
                              <PhotoIcon className="w-12 h-12 text-purple-deep" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-purple-deep/20 hover:bg-purple-50 transition-colors"
                          >
                            Upload Image
                          </button>
                          <button
                            onClick={() => setFormData({ ...formData, image: null })}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-purple-deep/20 hover:bg-purple-50 transition-colors"
                          >
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Confirm your profile information
                        </p>
                      </div>

                      <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-4">
                          {formData.image ? (
                            <img
                              src={URL.createObjectURL(formData.image)}
                              alt="Profile"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-purple-deep/10 flex items-center justify-center">
                              <UserIcon className="w-8 h-8 text-purple-deep" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{formData.fullName}</p>
                            <p className="text-sm text-gray-500">@{formData.username}</p>
                            {formData.email && (
                              <p className="text-sm text-gray-500">{formData.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <LinkIcon className="w-4 h-4" />
                          <span>pay.breeeve.com/{formData.username}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${currentStep === 1
                        ? 'invisible'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (currentStep === 4) {
                        handleSubmit()
                      } else {
                        setCurrentStep(currentStep + 1)
                      }
                    }}
                    disabled={currentStep === 1 && !isUsernameAvailable}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isLoading
                        ? 'bg-purple-deep/50 cursor-not-allowed'
                        : 'bg-purple-deep hover:bg-purple-deep/90'
                      } text-white ${currentStep === 1 && !isUsernameAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Setting up...' : currentStep === 4 ? 'Complete Setup' : 'Continue'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 