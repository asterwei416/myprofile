'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import cloudinaryLoader from '@/utils/cloudinaryLoader'

interface CloudinaryImageProps extends Omit<ImageProps, 'loader'> {
  src: string
  alt: string
  className?: string
}

export function CloudinaryImage({ src, alt, className, ...props }: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Generate a tiny low-res blurred placeholder URL
  // This is a manual construction because we can't easily use the loader for a different transformation *inside* the component props logic cleanly for blurDataURL without being static
  // But we can use specific Cloudinary params for the "loading" state if we used a background image approach.
  // Here we use a CSS class approach combined with Next.js Image's onLoadingComplete.

  return (
    <div
      className={`image-container ${className || ''}`}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
    >
      <Image
        loader={cloudinaryLoader}
        src={src}
        alt={alt}
        fill
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
      {isLoading && (
        <div
          className="absolute inset-0 blur-xl scale-110"
          style={{
            backgroundImage: `url(${getBlurUrl(src)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          }}
        />
      )}
    </div>
  )
}

// Helper to get a tiny blurred image for the placeholder
function getBlurUrl(src: string): string {
  if (!src || !src.includes('res.cloudinary.com')) return ''
  const parts = src.split('/upload/')
  if (parts.length !== 2) return src
  // w_20: tiny width, e_blur:1000: max blur
  return `${parts[0]}/upload/w_20,e_blur:1000,f_auto,q_auto/${parts[1]}`
}
