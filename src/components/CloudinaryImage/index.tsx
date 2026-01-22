'use client'

import Image, { ImageProps } from 'next/image'
import { useMemo, useState } from 'react'
import { createCloudinaryLoader } from '@/utils/cloudinaryLoader'

interface CloudinaryImageProps extends Omit<ImageProps, 'loader' | 'quality'> {
  src: string
  alt: string
  className?: string
  crop?: string
  gravity?: string
  aspectRatio?: string
  quality?: number | string
}

export function CloudinaryImage({
  src,
  alt,
  className,
  fill = true,
  crop,
  gravity,
  aspectRatio,
  quality = 'auto:low', // Default to low quality for better performance
  ...props
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Create a memoized loader with the specific options
  const loader = useMemo(
    () =>
      createCloudinaryLoader({
        crop,
        gravity,
        aspectRatio,
        fixedQuality: quality.toString(),
      }),
    [crop, gravity, aspectRatio, quality],
  )

  // 建立 LQIP (Low Quality Image Placeholder) URL
  const blurUrl = useMemo(() => {
    if (!src) return ''

    let targetSrc = src
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    // 如果網址是本地 API 路徑且有設定 Cloudinary，則嘗試轉換為 Cloudinary 路徑
    if (src.startsWith('/api/media/file/') && cloudName) {
      const fileName = src.split('/').pop()
      targetSrc = `https://res.cloudinary.com/${cloudName}/image/upload/v1/myprofile-media/${fileName}`
    }

    if (targetSrc.includes('/upload/')) {
      const parts = targetSrc.split('/upload/')
      if (parts.length === 2) {
        const params = ['w_20', 'e_blur:1000', 'q_1', 'f_auto']
        if (aspectRatio) params.push(`ar_${aspectRatio}`)
        if (crop) params.push(`c_${crop}`)
        if (gravity) params.push(`g_${gravity}`)
        return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`
      }
    }
    return ''
  }, [src, aspectRatio, crop, gravity])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(fill ? { width: '100%', height: '100%' } : {}),
  }

  return (
    <div className={`image-container ${className || ''}`} style={containerStyle}>
      {/* Blur Placeholder */}
      {blurUrl && (
        <img
          src={blurUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: fill ? 'cover' : 'contain',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none', // Avoid interfering with clicks
          }}
        />
      )}

      {/* Main Image */}
      <Image
        loader={loader}
        src={src}
        alt={alt}
        fill={fill}
        quality={typeof quality === 'number' ? quality : undefined}
        {...props}
        style={{
          ...props.style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        onLoad={(e) => {
          setIsLoaded(true)
          props.onLoad?.(e)
        }}
      />
    </div>
  )
}
