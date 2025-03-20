'use client'

import { motion } from 'framer-motion'
import AnimateInView from './AnimateInView'

const steps = [
  {
    icon: "🔗",
    title: "Create a Payment Link",
    description: "Generate a secure payment link in seconds with your desired amount"
  },
  {
    icon: "✉️",
    title: "Share with Clients",
    description: "Send the payment link to your clients via email, message, or embed it"
  },
  {
    icon: "💰",
    title: "Get Paid Instantly",
    description: "Receive USDC payments directly with automated delivery confirmation"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get started with Breeeve in three simple steps
          </p>
        </AnimateInView>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <AnimateInView key={index} delay={index * 0.2}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
} 