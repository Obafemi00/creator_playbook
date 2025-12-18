'use client'

import { motion } from 'framer-motion'

export function WhatIs() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-4xl font-bold mb-6">What is Creator Playbook?</h2>
        <ul className="space-y-4 text-lg text-charcoal/80">
          <li className="flex items-start gap-3">
            <span className="text-orange mt-1">•</span>
            <span>Monthly check-in, 1st of every month</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange mt-1">•</span>
            <span>Simple strategies you can actually use</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange mt-1">•</span>
            <span>One clear action per event</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange mt-1">•</span>
            <span>No noise. No hype.</span>
          </li>
        </ul>
      </motion.div>
    </section>
  )
}

