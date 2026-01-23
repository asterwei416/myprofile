import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { CloudinaryImage } from '../CloudinaryImage'

type AdSlot = 'homepageFooterAd' | 'postFooterAd'

interface AdUnitProps {
  slot: AdSlot
  className?: string
}

export const AdUnit = async ({ slot, className = '' }: AdUnitProps) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得全站廣告設定
  const adSettings = await payload.findGlobal({
    slug: 'ad-settings',
  })

  // 檢查該版位是否存在且啟用
  const adConfig = adSettings[slot]
  if (!adConfig || !adConfig.enabled) {
    return null
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
                  width={1200} // Default max width
                  height={300} // Default height, will adjust by aspect ratio
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                // Fallback for non-image objects or strings
                <div style={{ padding: '20px', background: '#f0f0f0', textAlign: 'center' }}>
                  Ad Image Error
                </div>
              )}
            </div>
            {/* 廣告標示 (Optional) */}
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
