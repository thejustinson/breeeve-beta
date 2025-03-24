'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

type Step = {
  title: string
  description: string
}

type ProgressProps = {
  steps: Step[]
  currentStep: number
}

export function OnboardingProgress({ steps, currentStep }: ProgressProps) {
  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative mb-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: index < currentStep - 1 ? '#382261' : index === currentStep - 1 ? '#A390F5' : '#E5E7EB',
                  scale: index === currentStep - 1 ? 1.1 : 1
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
              >
                {index < currentStep - 1 ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-[calc(100%+8px)] w-[calc(100%-8px)] h-0.5 bg-gray-200" />
              )}
            </div>
            <p className="text-xs font-medium text-gray-900">{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 