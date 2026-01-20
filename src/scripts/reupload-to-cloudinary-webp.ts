import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.resolve(__dirname, '../../public')

console.log('=== 重新上傳媒體到 Cloudinary (WebP 格式) ===')
console.log('Public 目錄:', PUBLIC_DIR)

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary 配置完成:', process.env.CLOUDINARY_CLOUD_NAME)

// 上傳到 Cloudinary 並返回 WebP URL
async function uploadToCloudinaryWebP(
  filePath: string,
  filename: string,
): Promise<{ url: string; bytes: number } | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'myprofile-media',
      public_id: filename.replace(/\.[^/.]+$/, ''), // 移除副檔名
      resource_type: 'image',
      // 自動轉換為 WebP 並最佳化
      format: 'webp',
      quality: 'auto:good',
      transformation: [
        { width: 1200, crop: 'limit' }, // 最大寬度 1200px
        { quality: 'auto:good' },
        { fetch_format: 'webp' },
      ],
    })
    return {
      url: result.secure_url,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error(`Cloudinary 上傳失敗 (${filename}):`, error)
    return null
  }
}

async function migrateToCloudinaryWebP() {
  const payload = await getPayload({ config })
  console.log('Payload 初始化完成')

  // 取得所有媒體
  const allMedia = await payload.find({
    collection: 'media',
    limit: 1000,
  })

  console.log(`找到 ${allMedia.totalDocs} 個媒體檔案`)

  let migratedCount = 0
  let skippedCount = 0
  let errorCount = 0
  let totalSaved = 0

  for (const media of allMedia.docs) {
    const currentUrl = media.url as string
    const filename = media.filename as string

    // 如果已經是 Cloudinary URL，跳過
    if (currentUrl?.includes('cloudinary')) {
      console.log(`[跳過] ${filename} - 已在 Cloudinary`)
      skippedCount++
      continue
    }

    if (!filename) {
      console.log(`[錯誤] ID ${media.id} - 無檔案名稱`)
      errorCount++
      continue
    }

    // 搜尋本地檔案
    const possiblePaths = [
      path.join(PUBLIC_DIR, filename),
      path.join(PUBLIC_DIR, 'startup', filename),
      path.join(PUBLIC_DIR, 'screenshots', filename),
      path.join(PUBLIC_DIR, 'media', filename),
    ]

    let localFilePath: string | null = null
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        localFilePath = p
        break
      }
    }

    if (!localFilePath) {
      console.log(`[跳過] ${filename} - 本地檔案不存在`)
      skippedCount++
      continue
    }

    // 取得原始檔案大小
    const originalSize = fs.statSync(localFilePath).size

    console.log(`[上傳中] ${filename} (${(originalSize / 1024).toFixed(0)} KB)...`)

    // 上傳到 Cloudinary (WebP 格式)
    const result = await uploadToCloudinaryWebP(localFilePath, filename)

    if (!result) {
      errorCount++
      continue
    }

    // 更新資料庫
    try {
      const newFilename = filename.replace(/\.[^/.]+$/, '.webp')
      await payload.update({
        collection: 'media',
        id: media.id,
        data: {
          url: result.url,
          filename: newFilename,
          mimeType: 'image/webp',
        },
      })

      const savedBytes = originalSize - result.bytes
      totalSaved += savedBytes

      console.log(`[成功] ${filename} -> WebP`)
      console.log(
        `       ${(originalSize / 1024).toFixed(0)} KB -> ${(result.bytes / 1024).toFixed(0)} KB (省 ${(savedBytes / 1024).toFixed(0)} KB)`,
      )
      migratedCount++
    } catch (updateError) {
      console.error(`[資料庫更新失敗] ${filename}:`, updateError)
      errorCount++
    }
  }

  console.log('\n=== 遷移完成 ===')
  console.log(`成功遷移: ${migratedCount}`)
  console.log(`已跳過: ${skippedCount}`)
  console.log(`錯誤: ${errorCount}`)
  console.log(`總共節省: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`)

  process.exit(0)
}

migrateToCloudinaryWebP().catch((err) => {
  console.error('遷移失敗:', err)
  process.exit(1)
})
