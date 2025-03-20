'use client'

import { motion } from 'framer-motion'
import AnimateInView from './AnimateInView'

const features = [
  {
    icon: "⚡️",
    title: "Instant Payments",
    description: "Receive USDC payments instantly with no delays or complications"
  },
  {
    icon: "🔒",
    title: "Secure Wallets",
    description: "Built-in wallet management with no seed phrases to remember"
  },
  {
    icon: "🤖",
    title: "Automated Delivery",
    description: "Automatic product delivery once payment is confirmed"
  },
  {
    icon: "📊",
    title: "Payment Dashboard",
    description: "Track all your transactions in one simple dashboard"
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to accept crypto payments, simplified
          </p>
        </AnimateInView>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {features.map((feature, index) => (
            <AnimateInView key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
} 