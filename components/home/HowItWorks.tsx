'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    title: 'Watch',
    description: 'Monthly events that capture a moment in the journey.',
  },
  {
    title: 'Think',
    description: 'Simple strategies designed to help you think clearer.',
  },
  {
    title: 'Act',
    description: 'One clear action. No fluff. Just progress.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="font-display text-4xl font-bold mb-12 text-center">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 ${
              index === 0 ? 'md:translate-y-4' : index === 2 ? 'md:translate-y-4' : ''
            }`}
          >
            <h3 className="font-display text-2xl font-bold mb-4 text-orange">{step.title}</h3>
            <p className="text-charcoal/80">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

