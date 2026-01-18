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

    const prompt = `你是一個內容標籤專家。請根據以下文章標題和內容，建議 3-5 個相關的標籤。

現有標籤列表（優先從這裡選擇）：
${tagNames.length > 0 ? tagNames.join(', ') : '（目前沒有標籤）'}

規則：
1. **精準匹配**：優先從現有標籤中選擇與文章內容最相關的。
2. **新增建議**：如果現有標籤不足以描述內容，可以建議新標籤。
3. **標籤風格**：簡潔、專業，通常為名詞 (1-4 個字)。
4. 回傳 JSON 格式：{"existing": ["標籤1", "標籤2"], "new": ["新標籤1"]}
5. existing 是現有標籤列表中的，new 是建議新增的
6. 只回傳 JSON，不要有任何其他文字

文章標題：${title}
${fullContent ? `文章內容：${fullContent}` : ''}

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
