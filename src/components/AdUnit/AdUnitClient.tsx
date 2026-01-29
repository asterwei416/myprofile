'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CloudinaryImage } from '../CloudinaryImage'

interface AdConfig {
  type: 'banner' | 'code'
  banner?: {
    image: any
    url: string
    openInNewTab: boolean
  }
  code?: string
}

interface AdUnitClientProps {
  adConfig: AdConfig | null
  className?: string
}

export const AdUnitClient = ({ adConfig, className = '' }: AdUnitClientProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!adConfig) {
    return null
  }

  // Avoid hydration mismatch for ads that might differ on server/client
  if (!isMounted) {
    return <div className={`ad-unit-placeholder ${className}`} style={{ minHeight: '100px' }}></div>
  }

  return (
    <div className={`ad-unit-container ${className}`} style={{ margin: '2rem 0' }}>
      {/* 模式 A: 圖片 Banner */}
      {adConfig.type === 'banner' && adConfig.banner?.image && (
        <div className="ad-banner">
          <Link
            href={adConfig.banner.url || '#'}
            target={adConfig.banner.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: 'auto' }}>
              {typeof adConfig.banner.image !== 'string' && adConfig.banner.image.url ? (
                <CloudinaryImage
                  src={adConfig.banner.image.url}
                  alt="Advertisement"
                  width={1200}
                  height={300}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div style={{ padding: '20px', background: '#f0f0f0', textAlign: 'center' }}>
                  Ad Image Error
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
                marginTop: '4px',
              }}
            >
              Sponsored
            </div>
          </Link>
        </div>
      )}

      {/* 模式 B: 自訂程式碼 (Google AdSense等) */}
      {adConfig.type === 'code' && adConfig.code && (
        <div className="ad-code">
          <div dangerouslySetInnerHTML={{ __html: adConfig.code }} />
        </div>
      )}
    </div>
  )
}
