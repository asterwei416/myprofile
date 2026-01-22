'use client'

import React, { useState, useCallback } from 'react'
import { useFormFields, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

export const SummaryField: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const label = 'label' in field ? field.label : '重點摘要'
  const { value, setValue } = useField<string>({ path })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 監聽 title 欄位
  const titleField = useFormFields(([fields]) => fields['title'])
  const title = titleField?.value as string

  // 監聽 content 欄位 (RichText)
  const contentField = useFormFields(([fields]) => fields['content'])
  const content = contentField?.value

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

  const generateSummary = async () => {
    if (!content) {
      setError('請先填寫文章內容')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const fullContent = extractTextFromLexical(content)

      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: fullContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      if (data.summary) {
        setValue(data.summary)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="field-type textarea" style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <label className="field-label" style={{ margin: 0 }}>
          {typeof label === 'string' ? label : '重點摘要'}
        </label>
        <button
          type="button"
          onClick={generateSummary}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? '#ccc' : '#222',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s',
          }}
        >
          {isGenerating ? 'AI 思考中...' : '✨ AI 生成摘要'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: '8px', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}

      <textarea
        className="field-input"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-200)',
          backgroundColor: 'var(--theme-elevation-50)',
          color: 'var(--theme-elevation-800)',
          fontFamily: 'inherit',
          fontSize: '1rem',
          lineHeight: '1.6',
          resize: 'vertical',
        }}
        placeholder="文章重點摘要..."
      />
      <div
        className="field-description"
        style={{ marginTop: '8px', color: '#888', fontSize: '0.85rem' }}
      >
        AI 友善的結構化摘要。列出 3-5 個關鍵重點 (Key Takeaways)，有助於 Answer Engine 引用。
      </div>
    </div>
  )
}

export default SummaryField
