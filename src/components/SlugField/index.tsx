'use client'

import React, { useState, useCallback } from 'react'
import { useField, TextInput, FieldLabel, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import './SlugField.css'

export const SlugField: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 監聽 title 欄位的值
  const titleField = useFormFields(([fields]) => fields['title'])
  const title = titleField?.value as string

  const generateSlug = useCallback(async () => {
    if (!title) {
      setError('請先填寫標題')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      setValue(data.slug)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }, [title, setValue])

  return (
    <div className="slug-field-wrapper">
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label || '網址代稱'}
        required={field.required}
      />
      <div className="slug-field-input-row">
        <TextInput
          path={path}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          className="slug-input"
        />
        <button
          type="button"
          className="slug-ai-button"
          onClick={generateSlug}
          disabled={isGenerating || !title}
          title={!title ? '請先填寫標題' : 'AI 生成 Slug'}
        >
          {isGenerating ? <span className="slug-loading">⏳</span> : <span>✨ AI 生成</span>}
        </button>
      </div>
      {error && <p className="slug-error">{error}</p>}
      <p className="field-description">用於 URL，例如 &quot;react-hooks-guide&quot;</p>
    </div>
  )
}

export default SlugField
