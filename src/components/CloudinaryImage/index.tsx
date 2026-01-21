'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import cloudinaryLoader from '@/utils/cloudinaryLoader'

interface CloudinaryImageProps extends Omit<ImageProps, 'loader'> {
  src: string
  alt: string
  className?: string
}

export function CloudinaryImage({
  src,
  alt,
  className,
  fill = true,
  ...props
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // 決定外層容器樣式：如果 fill=true，則強制佔滿；否則依內容或 className 決定
  const containerStyle = fill
    ? { position: 'relative' as const, overflow: 'hidden', width: '100%', height: '100%' }
    : { position: 'relative' as const, overflow: 'hidden' } // Height/Width controlled by parent or props

  // 決定 Image 元件樣式
  const imageClassName = `transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`

  return (
    <div className={`image-container ${className || ''}`} style={containerStyle}>
      <Image
        loader={cloudinaryLoader}
        src={src}
        alt={alt}
        fill={fill}
        className={imageClassName}
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
