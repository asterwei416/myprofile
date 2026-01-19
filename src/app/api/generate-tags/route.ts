import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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

    // 獲取現有的標籤列表
    const payload = await getPayload({ config })
    const existingTags = await payload.find({
      collection: 'tags',
      limit: 100,
    })
    const tagNames = existingTags.docs.map((tag: { name: string }) => tag.name)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const fullContent = content || ''

    const prompt = `你是一個內容標籤專家。請深入分析以下文章的標題與**完整內容**，提取出最核心的 3-5 個關鍵概念作為標籤。

現有標籤列表（僅供參考，若有完全符合的才選用，否則請大膽創造新標籤）：
${tagNames.length > 0 ? tagNames.join(', ') : '（目前沒有標籤）'}

規則：
1. **內容優先**：標籤必須精準反映文章的具體主題、技術棧或核心觀點，而不僅僅是大分類。
2. **混合策略**：
   - 如果現有標籤能精準描述，請放入 existing。
   - 如果現有標籤不夠精準（例如文章在講 "Next.js 15"，現有標籤只有 "Next.js"），請直接建議新標籤（如 "Next.js 15"）放入 new。
3. **標籤格式**：
   - 簡潔專業的名詞 (通常 2-5 個字)
   - 英文請維持原文大小寫習慣 (Valid: Next.js, OpenAI; Invalid: nextjs, openai)
   - 繁體中文
4. 回傳 JSON 格式：{"existing": ["現有標籤A"], "new": ["新標籤B", "新標籤C"]}
5. 只回傳 JSON，不要有任何其他文字

文章標題：${title}
${fullContent ? `文章完整內容：${fullContent}` : ''}

JSON：`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    // 解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ existing: [], new: [] })
    }

    const suggestions = JSON.parse(jsonMatch[0])

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('AI 標籤生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
