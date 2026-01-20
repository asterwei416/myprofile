import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { v2 as cloudinary } from 'cloudinary'

console.log('=== 媒體轉換為 WebP 腳本 ===')

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary 配置完成:', process.env.CLOUDINARY_CLOUD_NAME)

async function convertToWebP() {
  const payload = await getPayload({ config })
  console.log('Payload 初始化完成')

  // 取得所有媒體
  const allMedia = await payload.find({
    collection: 'media',
    limit: 1000,
  })

  console.log(`找到 ${allMedia.totalDocs} 個媒體檔案`)

  let convertedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const media of allMedia.docs) {
    const currentUrl = media.url as string
    const filename = media.filename as string

    if (!currentUrl || !filename) {
      console.log(`[跳過] ID ${media.id} - 無 URL 或檔案名稱`)
      skippedCount++
      continue
    }

    // 如果已經是 WebP，跳過
    if (filename.endsWith('.webp')) {
      console.log(`[跳過] ${filename} - 已是 WebP 格式`)
      skippedCount++
      continue
    }

    // 如果不是 Cloudinary URL，跳過
    if (!currentUrl.includes('cloudinary')) {
      console.log(`[跳過] ${filename} - 非 Cloudinary URL`)
      skippedCount++
      continue
    }

    try {
      // 從 URL 提取 public_id
      // URL 格式: https://res.cloudinary.com/xxx/image/upload/v123/myprofile-media/filename.ext
      const urlParts = currentUrl.split('/')
      const uploadIndex = urlParts.indexOf('upload')
      if (uploadIndex === -1) {
        console.log(`[錯誤] ${filename} - 無法解析 Cloudinary URL`)
        errorCount++
        continue
      }

      // 取得 upload 之後的路徑 (跳過版本號 v123)
      const pathParts = urlParts.slice(uploadIndex + 1)
      // 移除版本號 (如果存在)
      if (pathParts[0]?.startsWith('v')) {
        pathParts.shift()
      }
      const publicIdWithExt = pathParts.join('/')
      // 移除副檔名
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '')

      console.log(`[轉換中] ${filename} -> WebP (public_id: ${publicId})`)

      // 使用 Cloudinary 的 eager transformation 轉換為 WebP
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            format: 'webp',
            quality: 'auto:good',
            fetch_format: 'webp',
          },
        ],
        eager_async: false,
      })

      if (result.eager && result.eager[0]) {
        const webpUrl = result.eager[0].secure_url
        const newFilename = filename.replace(/\.[^/.]+$/, '.webp')

        // 更新資料庫
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            url: webpUrl,
            filename: newFilename,
            mimeType: 'image/webp',
          },
        })

        console.log(`[成功] ${filename} -> ${newFilename}`)
        console.log(
          `       大小變化：原始 ${result.bytes} bytes -> WebP ${result.eager[0].bytes} bytes`,
        )
        convertedCount++
      } else {
        console.log(`[錯誤] ${filename} - 轉換失敗`)
        errorCount++
      }
    } catch (err) {
      console.error(`[錯誤] ${filename}:`, err instanceof Error ? err.message : err)
      errorCount++
    }
  }

  console.log('\n=== 轉換完成 ===')
  console.log(`成功轉換: ${convertedCount}`)
  console.log(`已跳過: ${skippedCount}`)
  console.log(`錯誤: ${errorCount}`)

  process.exit(0)
}

convertToWebP().catch((err) => {
  console.error('轉換失敗:', err)
  process.exit(1)
})
