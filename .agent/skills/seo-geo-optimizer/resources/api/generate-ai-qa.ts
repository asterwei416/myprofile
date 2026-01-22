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

    const prompt = `你是一位資深的技術顧問。請解析這篇文章，提取出 **3 個** 最具價值的核心洞察，並轉化為問答形式。

文章標題：${title || '未命名'}
文章內容：${content.substring(0, 8000)}...

Output 格式 (JSON)：
[
  {
    "question": "能直擊痛點的深度提問",
    "answer": "解答內容"
  }
]

嚴格要求：
1. **純文字 (Plain Text)**：**絕對禁止**使用任何 Markdown 符號（如 **粗體**、*斜體*、- 列表），僅使用純文字與換行分段。
2. **深度內容**：每一題的解答長度控制在 **300 字左右**，確保論述完整、有憑有據。
3. **內容品質**：
   - **首句直球對決**：每個回答的第一句話必須是「完整且獨立的定義/解答」，方便 AI 直接引用。
   - 拒絕廢話，直接講重點與觀點。
   - 答案可分段（使用 \\n 換行），方便閱讀。
   - 語氣要專業、人類化，像在對話。
4. **數量**：固定 3 組。
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // 清理可能存在的 Markdown 標記
    const jsonString = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    try {
      const qaPairs = JSON.parse(jsonString)
      return NextResponse.json({ qaPairs })
    } catch (e) {
      console.error('JSON Parse Error:', jsonString)
      return NextResponse.json({ error: 'AI 回傳格式錯誤' }, { status: 500 })
    }
  } catch (error) {
    console.error('AI Q&A 生成錯誤:', error)
    return NextResponse.json({ error: 'AI 生成失敗' }, { status: 500 })
  }
}
