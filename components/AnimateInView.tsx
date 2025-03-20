'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimateInViewProps {
  children: ReactNode
  delay?: number
}

export default function AnimateInView({ children, delay = 0 }: AnimateInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
} 