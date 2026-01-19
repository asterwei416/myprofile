import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
  }

  try {
    // 直接 fetch API
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.models) {
      return NextResponse.json({
        count: data.models.length,
        // 過濾出 imagen 相關模型，方便 Debug
        imagenModels: data.models
          .filter((m: any) => m.name.includes('imagen'))
          .map((m: any) => ({
            name: m.name,
            supportedGenerationMethods: m.supportedGenerationMethods,
          })),
        models: data.models.map((m: any) => ({
          name: m.name,
          supportedGenerationMethods: m.supportedGenerationMethods,
        })),
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('List models error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '無法獲取模型列表',
      },
      { status: 500 },
    )
  }
}
