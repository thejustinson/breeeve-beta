'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

type FAQCategory = {
  icon: string
  title: string
  questions: {
    q: string
    a: string | string[]
  }[]
}

const faqData: FAQCategory[] = [
  {
    icon: "💰",
    title: "Payments & Transactions",
    questions: [
      {
        q: "What is Breeeve?",
        a: "Breeeve is a crypto payment platform that allows freelancers, digital creators, and online merchants to accept USDC payments effortlessly. It simplifies the process by offering payment links, embedded wallets, and automated product delivery—no technical knowledge required."
      },
      {
        q: "How do I get paid with Breeeve?",
        a: [
          "Step 1: Create a payment link from your Breeeve dashboard.",
          "Step 2: Share the link with your customer or client.",
          "Step 3: Once they pay in USDC, the funds reflect instantly in your wallet."
        ]
      },
      {
        q: "Do I need a Web3 wallet to use Breeeve?",
        a: "No. Breeeve provides an embedded wallet for every user, meaning you can receive payments without setting up an external crypto wallet. However, if you already have a Web3 wallet, you can link it to Breeeve for withdrawals."
      },
      {
        q: "What cryptocurrencies does Breeeve support?",
        a: "Currently, Breeeve supports USDC on Solana. More stablecoins and blockchains will be added in the future."
      },
      {
        q: "Is there a transaction fee?",
        a: "Yes, Breeeve charges a small processing fee per transaction. The exact amount depends on the network fees at the time of payment."
      }
    ]
  },
  {
    icon: "🛍️",
    title: "Selling Digital Products",
    questions: [
      {
        q: "Can I sell digital products with Breeeve?",
        a: "Yes! You can attach a link to your digital product when setting up a payment. Once a customer completes their purchase, Breeeve will automatically send them the product link."
      },
      {
        q: "What types of products can I sell?",
        a: "You can sell e-books, courses, templates, software licenses, PDFs, and other downloadable digital products."
      },
      {
        q: "Will I have a store or product listing page?",
        a: "Not yet. The initial focus is on payment links, but we plan to introduce a storefront feature where you can list multiple products in the future."
      }
    ]
  },
  {
    icon: "🔄",
    title: "Withdrawals & Off-Ramping",
    questions: [
      {
        q: "How do I withdraw my USDC?",
        a: "You can send USDC to any external wallet at any time. If you don't have a wallet, Breeeve can guide you in setting one up."
      },
      {
        q: "Can I convert my USDC to fiat (cash)?",
        a: "Breeeve does not handle off-ramping directly. However, we are working on P2P (peer-to-peer) partnerships where you can trade USDC for cash easily."
      },
      {
        q: "Can I use local bank transfers for withdrawals?",
        a: "Not at the moment, but our P2P partners may offer bank withdrawals in the near future."
      }
    ]
  },
  {
    icon: "🛡️",
    title: "Security & Reliability",
    questions: [
      {
        q: "Is Breeeve secure?",
        a: "Yes. Breeeve is built on blockchain technology, ensuring transparent, tamper-proof transactions. Additionally, we use strong encryption and wallet protection to keep your funds safe."
      },
      {
        q: "Can Breeeve hold my funds?",
        a: "No. Breeeve does not custody your funds. Your money is always in your embedded wallet, and you have full control over it."
      },
      {
        q: "What happens if I lose access to my account?",
        a: "If you lose access, you can recover your account via email authentication. We do not store seed phrases, so your wallet remains secure."
      }
    ]
  },
  {
    icon: "🚀",
    title: "Getting Started",
    questions: [
      {
        q: "How do I sign up for Breeeve?",
        a: "You can join the waitlist or sign up when access is available. Registration is simple—just enter your email, create an account, and start accepting payments immediately."
      },
      {
        q: "Is Breeeve available globally?",
        a: "Yes! Breeeve is a global payment solution, and anyone can use it as long as they have access to USDC transactions."
      },
      {
        q: "Can businesses use Breeeve?",
        a: "Absolutely. Breeeve is ideal for freelancers, digital creators, and businesses that want to accept crypto payments without technical complexity."
      }
    ]
  }
]

function FAQItem({ question, answer }: { question: string; answer: string | string[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-purple-light"
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600">
              {Array.isArray(answer) ? (
                <ul className="list-disc pl-4 space-y-2">
                  {answer.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              ) : (
                answer
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Breeeve and how it works
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {faqData.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200
                  ${activeTab === index 
                    ? 'bg-purple-deep text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{category.icon}</span>
                <span>{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                {faqData[activeTab].questions.map((item, index) => (
                  <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
} 