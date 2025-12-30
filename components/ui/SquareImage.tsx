'use client'

import Image from 'next/image'

interface SquareImageProps {
  src: string
  alt: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  priority?: boolean
}

const sizeClasses = {
  small: 'w-28 h-28 md:w-32 md:h-32',      // 112px mobile, 128px tablet/desktop
  medium: 'w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52', // 128px mobile, 160px tablet, 208px desktop
  large: 'w-40 h-40 md:w-52 md:h-52 lg:w-56 lg:h-56',  // 160px mobile, 208px tablet, 224px desktop
}

export function SquareImage({ 
  src, 
  alt, 
  size = 'medium',
  className = '',
  priority = false
}: SquareImageProps) {
  const sizeClass = sizeClasses[size]
  const sizeValue = size === 'small' ? 128 : size === 'medium' ? 208 : 224
  
  return (
    <div className={`relative ${sizeClass} aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes={`${sizeValue}px`}
        priority={priority}
      />
    </div>
  )
}
