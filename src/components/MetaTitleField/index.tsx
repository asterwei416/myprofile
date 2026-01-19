'use client'

import React, { useState, useCallback } from 'react'
import { useField, TextInput, FieldLabel, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import './AIField.css'

export const MetaTitleField: React.FC<TextFieldClientProps> = (props) => {
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

  const generateMetaTitle = useCallback(async () => {
    if (!title) {
      setError('請先填寫標題')
      return
    }

    setIsGenerating(true)
    setError(null)

    const fullContent = extractTextFromLexical(content)

    try {
      const response = await fetch('/api/generate-meta-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: fullContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      setValue(data.metaTitle)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }, [title, content, extractTextFromLexical, setValue])

  const charCount = value?.length || 0
  const isOptimalLength = charCount >= 50 && charCount <= 60

  return (
    <div className="ai-field-wrapper">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label || 'Meta Title'}
        required={field.required}
      />
      <div className="ai-field-input-row">
        <TextInput
          path={path}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          className="ai-input"
        />
        <button
          type="button"
          className="ai-generate-button"
          onClick={generateMetaTitle}
          disabled={isGenerating || !title}
          title={!title ? '請先填寫標題' : 'AI 生成標題'}
        >
          {isGenerating ? <span className="ai-loading">⏳</span> : <span>✨ AI 生成</span>}
        </button>
      </div>
      <div className="ai-field-footer">
        {error && <p className="ai-error">{error}</p>}
        <p className="field-description">
          搜尋結果顯示的標題 (留空則使用文章標題)
          <span
            className={`char-count ${isOptimalLength ? 'optimal' : charCount > 60 ? 'over' : ''}`}
          >
            {charCount}/60 字元
          </span>
        </p>
      </div>
    </div>
  )
}

export default MetaTitleField
