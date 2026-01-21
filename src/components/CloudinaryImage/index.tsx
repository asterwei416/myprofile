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
      blurUrl = `${parts[0]}/upload/w_20,e_blur:1000,q_1,f_auto/${parts[1]}`
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
        loader={cloudinaryLoader}
        src={src}
        alt={alt}
        fill={fill}
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
