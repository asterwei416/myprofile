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

    const fullContent = content || ''

    const prompt = `你是一個專業的 SEO 標題優化師。請根據文章標題和內容，生成一個能在此主題下獲得最佳排名的 Meta Title。

規則：
1. **長度控制**：50-60 個繁體中文字元 (包含標點符號)。
2. **關鍵字策略**：從文章內容中分析出 1-2 個低競爭長尾關鍵字 (Long-tail Keywords)，並自然融入標題。
3. **吸引點擊**：前半段強調「價值/解決方案」，後半段可以加上「品牌詞」或「修飾詞」(如：完整指南、實戰解析)。
4. **拒絕農場文**：不要使用過度聳動的標題黨寫法。
5. 只回傳標題文字，不要有其他解釋。

原始標題：${title}
${fullContent ? `文章內容參考：${fullContent}` : ''}

優化後的 Meta Title：`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const metaTitle = response.text().trim()

    return NextResponse.json({ metaTitle })
  } catch (error) {
    console.error('AI Meta Title 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
