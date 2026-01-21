'use client'

import Image, { ImageProps } from 'next/image'
import { useMemo } from 'react'
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
  // 從 src 中解析出路徑，並插入模糊化參數
  let blurUrl = ''
  if (src && src.includes('/upload/')) {
    const parts = src.split('/upload/')
    if (parts.length === 2) {
      // w_20: 極小寬度 (降低檔案大小)
      // e_blur:1000: 強烈模糊 (美化過渡效果)
      // q_1: 最低品質 (極致壓縮)
      // f_auto: 自動格式 (通常是 webp/avif)
      const params = ['w_20', 'e_blur:1000', 'q_1', 'f_auto']

      // Keep aspect ratio in LQIP to match main image
      if (aspectRatio) params.push(`ar_${aspectRatio}`)
      if (crop) params.push(`c_${crop}`)
      if (gravity) params.push(`g_${gravity}`)

      blurUrl = `${parts[0]}/upload/${params.join(',')}/${parts[1]}`
    }
  }

  // 決定外層容器樣式
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(fill ? { width: '100%', height: '100%' } : {}),
    // 設置模糊預覽圖為背景
    ...(blurUrl
      ? {
          backgroundImage: `url(${blurUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}),
  }

  return (
    <div className={`image-container ${className || ''}`} style={containerStyle}>
      <Image
        loader={loader}
        src={src}
        alt={alt}
        fill={fill}
        quality={typeof quality === 'number' ? quality : undefined}
        {...props}
        // 圖片載入後淡入效果 (Next.js 預設有，但可以確保一下)
        style={{
          ...props.style,
          opacity: 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        onLoadingComplete={(img) => {
          img.style.opacity = '1'
        }}
        onLoad={(e) => {
          const img = e.currentTarget
          img.style.opacity = '1'
        }}
      />
    </div>
  )
}
