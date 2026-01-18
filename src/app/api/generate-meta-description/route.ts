import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '標題不可為空' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // 移除摘要長度限制，讓 AI 閱讀全文
    const fullContent = content || ''

    const prompt = `你是一個專業的 SEO 內容分析師。請根據以下文章標題和完整內容，生成一段高資訊含量的 Meta Description。

規則：
1. 長度嚴格控制在 140-160 個繁體中文字元之間 (包含標點符號)。
2. **內容重點整理**：直接摘要文章的核心論點、解決的問題或技術細節。
3. **拒絕廢話**：嚴禁使用「本文將探討」、「這篇文章介紹了」、「快點擊閱讀」、「不容錯過」等宣傳用語。
4. **客觀專業**：語氣需客觀、精煉，讓搜尋者一眼就能看到乾貨。
5. 只回傳 Meta Description，不要有任何其他文字。

文章標題：${title}
${fullContent ? `文章完整內容：${fullContent}` : ''}

Meta Description：`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const metaDescription = response.text().trim()

    return NextResponse.json({ metaDescription })
  } catch (error) {
    console.error('AI Meta Description 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
