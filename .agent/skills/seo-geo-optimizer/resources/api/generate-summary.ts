import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: '內容不可為空' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `你是一個專業的內容編輯。請為以下文章撰寫一份「重點摘要 (TL;DR)」。

文章標題：${title || '未命名'}
文章內容：${content.substring(0, 10000)}...

請產生 3-5 個關鍵重點 (Key Takeaways)，使用繁體中文，並以條列式呈現 (每一點一行)。
風格要求：簡潔、有力、直接切中核心價值。適合 Answer Engine (如 Perplexity) 引用。

範例格式：
• 重點一：說明...
• 重點二：說明...
• 重點三：說明...

請直接回傳摘要文字，不要有開場白或結尾。`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text().trim()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('AI Summary 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
