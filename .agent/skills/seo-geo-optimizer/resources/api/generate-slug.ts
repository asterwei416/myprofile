import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '標題不可為空' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY 未設定' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `你是一個 SEO 專家。請根據以下文章標題，生成一個適合用於 URL 的 slug。

規則：
1. 只使用小寫英文字母、數字和連字號 (-)
2. 不要使用底線或其他特殊字符
3. 長度控制在 3-6 個單字之間
4. 要能反映標題的核心意義
5. 只回傳 slug，不要有任何其他文字或解釋

標題：${title}

Slug：`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const slug = response
      .text()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')

    return NextResponse.json({ slug })
  } catch (error) {
    console.error('AI Slug 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
