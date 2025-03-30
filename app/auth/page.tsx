'use client'

import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthPage() {
    const { login, logout, ready, authenticated, user } = usePrivy()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Function to confirm or create user
    const handleUserConfirmation = async () => {
        if (!user) return null;

        try {
            // Confirm user existence
            const confirmResponse = await fetch('/api/users/confirm', {
                method: 'POST',
                body: JSON.stringify({ privy_id: user.id })
            })
            const confirmData = await confirmResponse.json()

            // Handle different user states
            if (!confirmResponse.ok) {
                console.error("Error confirming user")
                return null
            }

            if (confirmData.message === 'new') {
                // Create new user if not exists
                const createResponse = await fetch('/api/users/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        privy_id: user.id, 
                        email: user.email?.address 
                    })
                })
                const createData = await createResponse.json()

                if (createData.message === 'created') {
                    router.push('/onboarding')
                }
            }

            return confirmData
        } catch (error) {
            console.error("User confirmation failed", error)
            return null
        }
    }

    // Comprehensive sign-in handler
    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await login()
            // The useEffect will handle post-login logic
        } catch (error) {
            console.error("Login failed", error)
            setIsLoading(false)
        }
    }

    // Handle user confirmation after authentication
    useEffect(() => {
        if (authenticated && user) {
            handleUserConfirmation()
                .finally(() => setIsLoading(false))
        }
    }, [authenticated, user])

    // Don't render anything if Privy is not ready
    if (!ready) {
        return null
    }

    // Loading animation component
    const LoginLoadingAnimation = () => (
        <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 1, 0.3],
                        transition: { 
                            duration: 1.5, 
                            delay: (dot - 1) * 0.3,
                            repeat: Infinity 
                        }
                    }}
                />
            ))}
        </div>
    )

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
            {authenticated && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => logout()}
                    className="fixed top-4 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium"
                >
                    Logout (Dev)
                </motion.button>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-bold">
                            <span className="text-gray-900">bree</span>
                            <span className="text-purple-light">eve</span>
                        </h1>
                    </Link>
                </div>

                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <p className="text-xl text-gray-900 font-medium">
                            Accept Payments
                        </p>
                        <p className="text-gray-500">
                            No wallet setup required
                        </p>
                    </div>

                    <motion.button
                        onClick={handleSignIn}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={isLoading}
                        className="w-full bg-purple-deep hover:bg-purple-light text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <LoginLoadingAnimation />
                        ) : (
                            "Continue with Privy"
                        )}
                    </motion.button>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex-1 border-t border-gray-200" />
                        <span>Secure login</span>
                        <span className="flex-1 border-t border-gray-200" />
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-purple-deep hover:text-purple-light">
                        Terms
                    </Link>
                    {' '}&{' '}
                    <Link href="/privacy" className="text-purple-deep hover:text-purple-light">
                        Privacy Policy
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}