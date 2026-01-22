import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: '內容不可為空' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `你是一個專業的文章標題專家。請根據以下文章內容，生成一個吸睛、具有高度點擊價值且符合 SEO 邏輯的「主標題」。

規則：
1. **有力且精煉**：標題應簡短有力（約 20-35 個繁體中文字元）。
2. **結構化**：可以使用「主標題 | 副標題」或「主標題：副標題」的格式。
3. **情緒共鳴或價值導向**：強調內容中的獨特見解、解決方法或未來趨勢。
4. **拒絕農場文**：保持專業感，不使用誘騙點擊的廉價詞彙。
5. 只回傳標題文字，不要有其他解釋。

文章內容參考：
${content}

生成的標題：`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const title = response.text().trim()

    return NextResponse.json({ title })
  } catch (error) {
    console.error('AI Title 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
