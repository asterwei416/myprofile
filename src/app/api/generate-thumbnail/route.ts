import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { title, contentPreview, style = 'pixar' } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '標題不可為空' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
    }

    // 定義風格 Prompt (優化版：移除 4k resolution 以提升速度與減小體積)
    const stylePrompts: Record<string, string> = {
      pixar:
        '3D Pixar animation style, cute, vibrant colors, soft lighting, 3D render, high quality',
      realistic:
        'Cinematic photo, realistic, high technology, sleek, modern, professional, high quality',
      cyberpunk:
        'Cyberpunk style, neon lights, futuristic city, high contrast, purple and blue tones, sci-fi',
      minimalist:
        'Minimalist geometric art, vector style, flat design, clean lines, simple shapes, pastel colors',
      watercolor: 'Watercolor painting, artistic, soft brush strokes, dreamy, paper texture',
      neon: 'Neon glitch art, retro wave, distorted, vhs effect, purple and pink, synthwave',
    }

    const selectedStyle = stylePrompts[style] || stylePrompts['pixar']

    // 初始化 Google Generative AI
    const genAI = new GoogleGenAI({ apiKey })

    // 直通車模式 (Direct Prompting)：直接組合 Prompt，省去 AI 思考時間
    // 結構：[電影質感] + [標題主體] + [風格關鍵詞] + [光影細節]
    const imagePrompt = `Cinematic shot of "${title}", ${selectedStyle}, volumetric lighting, cinematic lighting, soft bokeh, high quality composition, no text`

    console.log('Generating thumbnail with prompt:', imagePrompt)

    // 使用 Imagen 4 生成圖片
    const imageResult = await genAI.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        // 確保長寬比
        aspectRatio: '16:9',
        // 優化速度參數
        sampleCount: 1,
      } as any,
    })

    if (!imageResult.generatedImages || imageResult.generatedImages.length === 0) {
      return NextResponse.json({ error: '圖片生成失敗' }, { status: 500 })
    }

    const generatedImage = imageResult.generatedImages[0]

    if (!generatedImage.image?.imageBytes) {
      return NextResponse.json({ error: '圖片資料無效' }, { status: 500 })
    }

    // 將 base64 轉為 Buffer
    const imageBuffer = Buffer.from(generatedImage.image.imageBytes, 'base64')
    const timestamp = Date.now()
    // 改用 webp 格式（Cloudinary 會自動轉換）
    const filename = `ai-thumbnail-${timestamp}.webp`

    // 將圖片儲存到 media 目錄
    const payload = await getPayload({ config })

    // 透過 Payload 上傳到 media collection
    // Cloudinary 插件會自動處理上傳，我們在這裡用較小的 buffer
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `AI 生成的縮圖：${title}`,
      },
      file: {
        data: imageBuffer,
        // 使用 webp 格式減少體積
        mimetype: 'image/webp',
        name: filename,
        size: imageBuffer.length,
      },
    })

    return NextResponse.json({
      success: true,
      mediaId: mediaDoc.id,
      url: mediaDoc.url,
      prompt: imagePrompt,
    })
  } catch (error) {
    console.error('AI 縮圖生成錯誤:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'AI 生成失敗',
      },
      { status: 500 },
    )
  }
}
