'use client'

import { motion } from 'framer-motion'

export function WhyNow() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 text-lg text-charcoal/80 leading-relaxed"
      >
        <h2 className="font-display text-4xl font-bold mb-8 text-charcoal">Why now</h2>
        <p>
          The world is loud. Information overload. Everywhere you look, someone is telling you what to do, how to do it, and when to do it. It&apos;s confusing. It&apos;s overwhelming. And it&apos;s not working.
        </p>
        <p>
          Creator Playbook isn&apos;t about finding the perfect strategy or following someone else&apos;s path. It&apos;s about creating your own. It&apos;s about taking what works, leaving what doesn&apos;t, and building something that matters to you.
        </p>
        <div className="bg-orange/10 border-l-4 border-orange p-6 rounded-r-lg my-8">
          <p className="font-semibold text-charcoal italic">
            Not from the finish line. From the middle.
          </p>
        </div>
        <p>
          This is for creators who are in the middle of it. Who are building, creating, and figuring it out as they go. Who want to move forward with intention, not perfection.
        </p>
      </motion.div>
    </section>
  )
}

