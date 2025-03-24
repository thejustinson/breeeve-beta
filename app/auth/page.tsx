'use client'

import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthPage() {
    const { login, logout, ready, authenticated, user } = usePrivy()
    const router = useRouter()


    useEffect(() => {
        const confirmUser = async () => {
            if (authenticated && user) {
                const response = await fetch(`/api/users/confirm`, {
                    method: 'POST',
                    body: JSON.stringify({ privy_id: user.id })
                })
                const data = await response.json()
                console.log(data)

                if (!response.ok) { console.log("An error occurred while confirming the user") }

                if (data.message === 'exists') {
                    console.log("User already exists")
                }

                if (data.message === 'new') {
                    console.log("User is new")
                }
            }
        }
        confirmUser()
    }, [authenticated, user, router])

    if (!ready) {
        return null
    }

    const handleLogin = async () => {
        await login()
    }


    // const confirmUser = async () => {

    //     const response = await fetch(`/api/confirm-user?privy_id=did:privy:cm88x1rpl03kq13tx1tvapu49`)
    //     const data = await response.json()
    //     console.log(data)
    // }

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
                        onClick={handleLogin}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-purple-deep hover:bg-purple-light text-white py-4 rounded-lg font-medium transition-colors"
                    >
                        Continue with Privy
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


            {/* <button onClick={confirmUser} className='bg-purple-deep text-white px-4 py-2 rounded-lg font-medium transition-colors active:scale-95 mt-4'>Confirm User</button> */}
        </div>
    )
} 