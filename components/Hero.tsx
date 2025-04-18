'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background Pattern - Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgb(107 114 128 / 0.3) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: '0px 0px',
          zIndex: 5
        }}
      />

      {/* Background Pattern - Bouncing Shapes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 10 }}>
        {/* Large Squares */}
        <motion.div
          initial={{ x: -100, y: -100, opacity: 0.3 }}
          animate={{ 
            x: [0, 100, 0, -100, 0],
            y: [0, 100, 200, 100, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-purple-light/30 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 100, y: 100, opacity: 0.3 }}
          animate={{ 
            x: [0, -100, 0, 100, 0],
            y: [0, -100, -200, -100, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-purple-deep/30 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        
        {/* Large Circles */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, 150, 0, -150, 0],
            y: [0, 200, 0, -200, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/3 w-24 sm:w-40 h-24 sm:h-40 bg-purple-light/20 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, -200, 0, 200, 0],
            y: [0, -150, 0, 150, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 left-1/3 w-28 sm:w-48 h-28 sm:h-48 bg-purple-deep/20 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        
        {/* Medium Squares */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 0, 100, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-12 sm:h-16 bg-purple-light/30 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, -150, 0, 150, 0],
            y: [0, 150, 0, -150, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/2 right-1/2 w-14 sm:w-20 h-14 sm:h-20 bg-purple-deep/25 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        
        {/* Small Circles */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, 80, 0, -80, 0],
            y: [0, -80, 0, 80, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 left-3/4 w-8 sm:w-12 h-8 sm:h-12 bg-purple-light/25 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, -120, 0, 120, 0],
            y: [0, 120, 0, -120, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 23,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-3/4 right-3/4 w-10 sm:w-14 h-10 sm:h-14 bg-purple-deep/25 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, 150, 0, -150, 0],
            y: [0, -100, 0, 100, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 27,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/6 left-1/6 w-12 sm:w-16 h-12 sm:h-16 bg-purple-light/20 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, -100, 0, 100, 0],
            y: [0, 150, 0, -150, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 29,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/6 right-1/6 w-10 sm:w-14 h-10 sm:h-14 bg-purple-deep/20 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, 120, 0, -120, 0],
            y: [0, -120, 0, 120, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-5/6 left-5/6 w-8 sm:w-12 h-8 sm:h-12 bg-purple-light/25 rounded-lg cursor-pointer pointer-events-auto z-20"
        />
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0.3 }}
          animate={{ 
            x: [0, -80, 0, 80, 0],
            y: [0, 100, 0, -100, 0],
            opacity: [0.3, 0.4, 0.3, 0.4, 0.3]
          }}
          whileHover={{ 
            scale: 1.2,
            opacity: 0.6,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.9,
            transition: { duration: 0.1 }
          }}
          transition={{ 
            duration: 31,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-5/6 right-5/6 w-12 sm:w-16 h-12 sm:h-16 bg-purple-deep/25 rounded-full cursor-pointer pointer-events-auto z-20"
        />
        
        {/* Gradient overlay - reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/70 pointer-events-none" style={{ zIndex: 15 }} />
      </div>

      <div className="relative max-w-5xl mx-auto py-20" style={{ zIndex: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-purple-light/10 rounded-full"
          >
            <span className="text-purple-deep font-medium">
              💫 Early Access
            </span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight">
            Accept USDC Payments{' '}
            <span className="bg-gradient-to-r from-purple-light to-purple-deep bg-clip-text text-transparent">
              Without The Complexity
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Accept payments, automate product delivery, and manage earnings with ease. 
            No wallet setup required.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-deep hover:bg-purple-light text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 shadow-lg shadow-purple-light/20"
            >
              Get Started →
            </motion.button>
            </Link>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl text-lg font-semibold text-gray-600 hover:text-purple-deep transition-colors duration-200"
            >
              Learn More
            </motion.button> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-8 text-sm text-gray-500 flex items-center justify-center gap-8"
          >
            <span className="flex items-center gap-2">
              ✨ No Seed Phrase
            </span>
            <span className="flex items-center gap-2">
              🔒 Secure Transactions
            </span>
            <span className="flex items-center gap-2">
              ⚡️ Instant Payments
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 