'use client'

import React, { useState, useCallback } from 'react'
import { useFormFields, useField, ArrayField } from '@payloadcms/ui'
import type { ArrayFieldClientProps } from 'payload'

export const AIQuestionField: React.FC<ArrayFieldClientProps> = (props) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 監聽 title 欄位的值
  const titleField = useFormFields(([fields]) => fields['title'])
  const title = titleField?.value as string

  // 監聽 content 欄位 (RichText)
  const contentField = useFormFields(([fields]) => fields['content'])
  const content = contentField?.value

  // 監聽 summary 欄位 (可選)
  const summaryField = useFormFields(([fields]) => fields['summary'])
  const summary = summaryField?.value

  // 輔助函數：從 Lexical JSON 提取純文字
  const extractTextFromLexical = useCallback((node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractTextFromLexical).join(' ')
    if (node.root && node.root.children) return extractTextFromLexical(node.root.children)
    if (node.children) return extractTextFromLexical(node.children)
    if (node.text) return node.text
    return ''
  }, [])

  // 獲取 field 的 setValue 方法
  const { setValue: setQAValue } = useField<any[]>({ path: props.path })

  const generateQA = async () => {
    if (!content) {
      setError('請先填寫文章內容')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const fullContent = extractTextFromLexical(content)
      // 如果有 summary，也加進去增加上下文
      const context = summary ? `摘要：${summary}\n\n內文：${fullContent}` : fullContent

      const response = await fetch('/api/generate-ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: context }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      if (Array.isArray(data.qaPairs)) {
        // 更新 Array Field 的值
        // Payload 的 Array field 結構通常是一組物件，每個物件有 id (自動生成) 和欄位值
        const newRows = data.qaPairs.map((pair: any) => ({
          id: Math.random().toString(36).substr(2, 9), // 暫時 ID，確保 UI 正確渲染
          question: pair.question,
          answer: pair.answer,
        }))

        // 詢問使用者是要覆蓋還是追加？這裡預設為覆蓋，因為通常是重新生成
        setQAValue(newRows)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>AI 讀心問答</h3>
        <button
          type="button"
          onClick={generateQA}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? '#ccc' : '#222',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isGenerating ? '思考中...' : '✨ AI 生成問答'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.875rem' }}>{error}</div>
      )}

      {/* 渲染原本的 Array Field UI */}
      <ArrayField {...props} />
    </div>
  )
}

export default AIQuestionField
