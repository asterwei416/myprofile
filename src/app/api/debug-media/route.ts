import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * 診斷用 API - 檢查媒體檔案 URL 狀態
 * 存取方式：GET /api/debug-media
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // 取得前 5 個媒體檔案
    const mediaItems = await payload.find({
      collection: 'media',
      limit: 5,
    })

    const results = mediaItems.docs.map((item) => ({
      id: item.id,
      filename: item.filename,
      url: item.url,
      mimeType: item.mimeType,
      // 檢查 URL 是否指向 Cloudinary
      isCloudinary: item.url?.includes('cloudinary') || item.url?.includes('res.cloudinary'),
    }))

    return NextResponse.json({
      message: '媒體檔案診斷結果',
      totalDocs: mediaItems.totalDocs,
      samples: results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
