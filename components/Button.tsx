import Link from 'next/link'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export function Button({ 
  children, 
  href, 
  onClick, 
  variant = 'primary',
  className,
  disabled 
}: ButtonProps) {
  const baseStyles = 'inline-block px-8 py-4 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'
  
  const variants = {
    primary: 'bg-orange text-offwhite hover:bg-orange/90',
    secondary: 'bg-transparent border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-offwhite'
  }

  const classes = clsx(baseStyles, variants[variant], className, disabled && 'opacity-50 cursor-not-allowed')

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}

