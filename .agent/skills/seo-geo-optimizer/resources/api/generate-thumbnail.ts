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

    // 定義風格 Prompt
    const stylePrompts: Record<string, string> = {
      pixar:
        '3D Pixar animation style, cute, vibrant colors, soft lighting, 3D render, high quality, detailed',
      realistic:
        'Cinematic photo, realistic, high technology, sleek, modern, professional, 8k resolution',
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

    // 先用 Gemini 生成圖片描述 prompt
    const promptResult = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `你是一位精通視覺設計與 Imagen 4 提示詞工程的專家。
你的任務是根據提供的「文章標題」與「文章內容」，為部落格設計一張吸睛且符合內容深度的高品質首圖 (16:9)。

## 視覺策略 (固定為：電影情境感 + 寫實幻想)
請忽略抽象或極簡的表現手法。無論文章主題為何，一律將其轉化為具體的**「電影場景 (Cinematic Scene)」**。
1. **寫實基底 + 幻想元素**：場景必須有真實的物理質感 (寫實)，但可以包含超現實或科幻的元素 (幻想)。
2. **拒絕抽象**：不要畫抽象的線條或符號。即使是抽象概念 (如 "AI 思考")，也要具象化為實體場景 (如 "發光的精密類神經網絡與水晶般的數據流")。
3. **沉浸感**：構圖要像電影劇照 (Movie Still)，強調景深與氛圍。
4. **風格融合**：將用戶選擇的「${selectedStyle}」風格融入這個電影場景中 (例如：如果是 Pixar 風，就是「皮克斯電影的劇照」)。

## Imagen 4 優化規則
1. **光影與質感**：必須包含 "Volumetric lighting", "Cinematic lighting", "Soft bokeh", "High detailed texture", "8k resolution" 等高品質關鍵詞。
2. **構圖**：構圖乾淨平衡，主體明確，預留視覺呼吸空間 (Negative space)。
3. **絕對禁止**：不要包含任何文字 (No text)、不要有人臉特寫 (No close-up faces)、不要有模糊或變形的物體。
4. **輸出語言**：僅回傳一段優化過的 **英文 Prompt**。

## 輸入資料
文章標題：${title}
${contentPreview ? `文章內容：${contentPreview}` : ''}

## 你的回應 (僅英文 Prompt)：`,
    })

    const imagePrompt =
      promptResult.text?.trim() ||
      `${selectedStyle} illustration for: ${title}, high quality, cinematic lighting`

    // 使用 Imagen 4 生成圖片
    const imageResult = await genAI.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
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
