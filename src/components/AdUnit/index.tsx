import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { AdUnitClient } from './AdUnitClient'

type AdSlot = 'homepageFooterAd' | 'postFooterAd'

interface AdUnitProps {
  slot: AdSlot
  className?: string
}

export const AdUnit = async ({ slot, className = '' }: AdUnitProps) => {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // 取得全站廣告設定
    const adSettings = await payload.findGlobal({
      slug: 'ad-settings',
    })

    // 檢查該版位是否存在且啟用
    const adConfig = adSettings[slot]

    // 確保只傳遞必要的序列化資料給客戶端組件
    // 這一步很重要，避免傳遞過多複雜物件導致 SSR 錯誤
    if (!adConfig || !adConfig.enabled) {
      return null
    }

    const safeAdConfig = {
      type: adConfig.type,
      banner: adConfig.banner,
      code: adConfig.code,
    }

    return <AdUnitClient adConfig={safeAdConfig as any} className={className} />
  } catch (error) {
    console.error(`Error loading ad unit for slot ${slot}:`, error)
    return null
  }
}
