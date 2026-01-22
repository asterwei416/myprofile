'use client'

import React, { useState, useCallback } from 'react'
import { useField, TextInput, FieldLabel, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import '../MetaTitleField/AIField.css'

export const TitleField: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const generateTitle = useCallback(async () => {
    const fullContent = extractTextFromLexical(content)

    if (!fullContent || fullContent.length < 20) {
      setError('請先填寫足夠的文章內容以供 AI 分析 (至少 20 字)')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      setValue(data.title)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }, [content, extractTextFromLexical, setValue])

  const hasContent = content && extractTextFromLexical(content).length >= 20

  return (
    <div className="ai-field-wrapper ai-title-field">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label || '標題'}
        required={field.required}
      />
      <div className="ai-field-input-row">
        <TextInput
          path={path}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          className="ai-input ai-title-input"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        />
        <button
          type="button"
          className="ai-generate-button"
          onClick={generateTitle}
          disabled={isGenerating || !hasContent}
          title={!hasContent ? '請先填寫文章內容' : 'AI 生成標題'}
        >
          {isGenerating ? <span className="ai-loading">⏳</span> : <span>✨ AI 生成</span>}
        </button>
      </div>
      {error && (
        <p className="ai-error" style={{ marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default TitleField
