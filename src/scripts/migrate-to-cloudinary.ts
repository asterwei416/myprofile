import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.resolve(__dirname, '../../public')

console.log('=== 媒體遷移至 Cloudinary 腳本 ===')
console.log('Public 目錄:', PUBLIC_DIR)

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary 配置完成:', process.env.CLOUDINARY_CLOUD_NAME)

// 上傳到 Cloudinary 並返回 URL
async function uploadToCloudinary(filePath: string, filename: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'myprofile-media',
      public_id: filename.replace(/\.[^/.]+$/, ''), // 移除副檔名
      resource_type: 'auto',
    })
    return result.secure_url
  } catch (error) {
    console.error(`Cloudinary 上傳失敗 (${filename}):`, error)
    return null
  }
}

async function migrateMedia() {
  const payload = await getPayload({ config })
  console.log('Payload 初始化完成')

  // 取得所有使用本地儲存的媒體
  const allMedia = await payload.find({
    collection: 'media',
    limit: 1000, // 取得所有
  })

  console.log(`找到 ${allMedia.totalDocs} 個媒體檔案`)

  let migratedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const media of allMedia.docs) {
    const currentUrl = media.url as string

    // 如果已經是 Cloudinary URL，跳過
    if (currentUrl?.includes('cloudinary') || currentUrl?.includes('res.cloudinary')) {
      console.log(`[跳過] ${media.filename} - 已在 Cloudinary`)
      skippedCount++
      continue
    }

    // 從本地 public 資料夾找檔案
    const filename = media.filename as string
    if (!filename) {
      console.log(`[錯誤] ID ${media.id} - 無檔案名稱`)
      errorCount++
      continue
    }

    // 搜尋可能的檔案路徑
    const possiblePaths = [
      path.join(PUBLIC_DIR, filename),
      path.join(PUBLIC_DIR, 'startup', filename),
      path.join(PUBLIC_DIR, 'screenshots', filename),
    ]

    let localFilePath: string | null = null
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        localFilePath = p
        break
      }
    }

    if (!localFilePath) {
      console.log(`[錯誤] ${filename} - 本地檔案不存在`)
      errorCount++
      continue
    }

    // 上傳到 Cloudinary
    console.log(`[上傳中] ${filename}...`)
    const cloudinaryUrl = await uploadToCloudinary(localFilePath, filename)

    if (!cloudinaryUrl) {
      errorCount++
      continue
    }

    // 更新資料庫記錄
    try {
      await payload.update({
        collection: 'media',
        id: media.id,
        data: {
          url: cloudinaryUrl,
        },
      })
      console.log(`[成功] ${filename} -> ${cloudinaryUrl}`)
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

  process.exit(0)
}

migrateMedia().catch((err) => {
  console.error('遷移失敗:', err)
  process.exit(1)
})
