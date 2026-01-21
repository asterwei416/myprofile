'use client'

import React, { useState, useCallback } from 'react'
import { useField, TextareaInput, FieldLabel, useFormFields } from '@payloadcms/ui'
import type { TextareaFieldClientProps } from 'payload'

import './AIField.css'

export const MetaDescriptionField: React.FC<TextareaFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 監聽 title 欄位的值
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

  const generateMetaDescription = useCallback(async () => {
    const fullContent = extractTextFromLexical(content)

    if (!title && !fullContent) {
      setError('請填寫標題或文章內容')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-meta-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: fullContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      setValue(data.metaDescription)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }, [title, content, extractTextFromLexical, setValue])

  const charCount = value?.length || 0
  const isOptimalLength = charCount >= 150 && charCount <= 160

  const hasContent = title || (content && extractTextFromLexical(content).length > 0)

  return (
    <div className="ai-field-wrapper">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label || 'Meta Description'}
        required={field.required}
      />
      <div className="ai-field-textarea-row">
        <TextareaInput
          path={path}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
          className="ai-textarea"
          rows={3}
        />
        <button
          type="button"
          className="ai-generate-button ai-generate-button-textarea"
          onClick={generateMetaDescription}
          disabled={isGenerating || !hasContent}
          title={!hasContent ? '請先填寫標題或文章內容' : 'AI 生成摘要'}
        >
          {isGenerating ? <span className="ai-loading">⏳</span> : <span>✨ AI 生成</span>}
        </button>
      </div>
      <div className="ai-field-footer">
        {error && <p className="ai-error">{error}</p>}
        <p className="field-description">
          搜尋結果顯示的描述
          <span
            className={`char-count ${isOptimalLength ? 'optimal' : charCount > 160 ? 'over' : ''}`}
          >
            {charCount}/160 字元
          </span>
        </p>
      </div>
    </div>
  )
}

export default MetaDescriptionField
