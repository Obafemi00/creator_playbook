import { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function Section({ children, className, noPadding }: SectionProps) {
  return (
    <section className={clsx(
      !noPadding && 'py-24 px-6 lg:px-8',
      className
    )}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </section>
  )
}

