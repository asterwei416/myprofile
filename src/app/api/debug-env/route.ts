import { NextResponse } from 'next/server'

/**
 * 診斷用 API - 檢查環境變數設定狀態
 * 存取方式：GET /api/debug-env
 * ⚠️ 注意：此 endpoint 僅顯示變數「是否存在」，不會洩漏實際值
 */
export async function GET() {
  const envVars = [
    'DATABASE_URL',
    'PAYLOAD_SECRET',
    'GEMINI_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]

  const status = envVars.map((name) => {
    const value = process.env[name]
    return {
      name,
      status: value ? '✅ 已設定' : '❌ 未設定',
      // 只顯示前4個字元作為確認（不洩漏完整密鑰）
      preview: value ? `${value.substring(0, 4)}...` : null,
    }
  })

  return NextResponse.json({
    message: '環境變數診斷結果',
    timestamp: new Date().toISOString(),
    variables: status,
  })
}
