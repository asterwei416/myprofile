import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// 將名稱轉換為 URL 友好的 slug
// 將名稱轉換為 URL 友好的 slug
const generateSlug = (name: string): string => {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, '-') // 空白轉 dash
      .replace(/--+/g, '-') // 多個 dash 合併
      .trim() || `tag-${Date.now()}`
  ) // 避免空字串
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: '標籤名稱不可為空' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // 檢查標籤是否已存在
    const existing = await payload.find({
      collection: 'tags',
      where: {
        name: { equals: name },
      },
    })

    if (existing.docs.length > 0) {
      // 標籤已存在，直接返回
      return NextResponse.json({
        tag: existing.docs[0],
        created: false,
        message: '標籤已存在',
      })
    }

    // 建立新標籤
    const newTag = await payload.create({
      collection: 'tags',
      data: {
        name,
        slug: generateSlug(name),
      },
    })

    return NextResponse.json({
      tag: newTag,
      created: true,
      message: '標籤建立成功',
    })
  } catch (error) {
    console.error('建立標籤錯誤:', error)
    return NextResponse.json({ error: '建立標籤失敗' }, { status: 500 })
  }
}
