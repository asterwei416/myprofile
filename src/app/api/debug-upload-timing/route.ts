import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * 診斷用 API - 測量上傳各步驟的時間
 * POST /api/debug-upload-timing
 *
 * 測量項目：
 * 1. Cloudinary 配置時間
 * 2. 直接上傳到 Cloudinary 的時間
 * 3. 透過 Payload 上傳的時間
 */
export async function GET() {
  const timings: Record<string, number> = {}
  const startTotal = Date.now()

  try {
    // 1. 測量 Cloudinary 配置
    const startConfig = Date.now()
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    timings['1_cloudinary_config_ms'] = Date.now() - startConfig

    // 2. 測量 Cloudinary ping (使用小型測試圖片)
    const startPing = Date.now()
    try {
      // 上傳一個 1x1 透明 PNG (最小的測試)
      const testBase64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const result = await cloudinary.uploader.upload(`data:image/png;base64,${testBase64}`, {
        folder: 'myprofile-media/_test',
        public_id: `timing-test-${Date.now()}`,
      })
      timings['2_cloudinary_upload_1px_ms'] = Date.now() - startPing

      // 清理測試檔案
      await cloudinary.uploader.destroy(result.public_id)
    } catch (e) {
      timings['2_cloudinary_upload_error'] = Date.now() - startPing
    }

    // 3. 測量 Payload 初始化
    const startPayload = Date.now()
    const payload = await getPayload({ config })
    timings['3_payload_init_ms'] = Date.now() - startPayload

    // 4. 測量 Payload 資料庫查詢
    const startDb = Date.now()
    await payload.find({
      collection: 'media',
      limit: 1,
    })
    timings['4_payload_db_query_ms'] = Date.now() - startDb

    timings['total_ms'] = Date.now() - startTotal

    // 分析瓶頸
    const bottleneck = Object.entries(timings)
      .filter(([k]) => k.includes('_ms'))
      .sort((a, b) => (b[1] as number) - (a[1] as number))[0]

    return NextResponse.json({
      message: '上傳時間診斷結果',
      timings,
      bottleneck: {
        step: bottleneck[0],
        duration_ms: bottleneck[1],
        suggestion: getOptimizationSuggestion(bottleneck[0]),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timings,
      },
      { status: 500 },
    )
  }
}

function getOptimizationSuggestion(step: string): string {
  const suggestions: Record<string, string> = {
    '2_cloudinary_upload_1px_ms':
      '考慮使用更近的 Cloudinary 區域 (如 Japan/Singapore) 或改用其他 CDN',
    '3_payload_init_ms': 'Payload 冷啟動較慢，考慮保持服務長時間運行或使用連接池',
    '4_payload_db_query_ms': 'MongoDB 查詢較慢，考慮優化索引或使用更近的資料庫區域',
  }
  return suggestions[step] || '需要進一步分析'
}
