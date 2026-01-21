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
  // 決定外層容器樣式
  const containerStyle = fill
    ? { position: 'relative' as const, overflow: 'hidden', width: '100%', height: '100%' }
    : { position: 'relative' as const, overflow: 'hidden' }

  return (
    <div className={`image-container ${className || ''}`} style={containerStyle}>
      <Image loader={cloudinaryLoader} src={src} alt={alt} fill={fill} {...props} />
    </div>
  )
}
