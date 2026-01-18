'use client'

import React, { useState, useCallback } from 'react'
import { useFormFields, useField, RelationshipField } from '@payloadcms/ui'
import type { RelationshipFieldClientProps } from 'payload'

import './TagsField.css'

interface TagSuggestion {
  existing: string[]
  new: string[]
}

export const TagsField: React.FC<RelationshipFieldClientProps> = (props) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<TagSuggestion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creatingTag, setCreatingTag] = useState<string | null>(null)
  const [createdTags, setCreatedTags] = useState<string[]>([])

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

  const generateTags = useCallback(async () => {
    if (!title) {
      setError('請先填寫標題')
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuggestions(null)
    setCreatedTags([])

    const fullContent = extractTextFromLexical(content)

    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: fullContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI 生成失敗')
      }

      setSuggestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 生成失敗')
    } finally {
      setIsGenerating(false)
    }
  }, [title, content, extractTextFromLexical])

  // 獲取 tags 欄位以更新它
  const { value: tagsValue, setValue: setTagsValue } = useField<string[]>({ path: props.path })

  const createTag = useCallback(
    async (tagName: string) => {
      setCreatingTag(tagName)
      setError(null)

      try {
        const response = await fetch('/api/create-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tagName }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '建立標籤失敗')
        }

        // 標記為已建立
        setCreatedTags((prev) => [...prev, tagName])

        // 從建議中移除已建立的標籤
        if (suggestions) {
          setSuggestions({
            ...suggestions,
            new: suggestions.new.filter((t) => t !== tagName),
            existing: [...suggestions.existing, tagName],
          })
        }

        // 自動將新標籤加入 Relationship 欄位
        if (data.tag && data.tag.id) {
          const currentTags = Array.isArray(tagsValue) ? tagsValue : []
          // 確保只存 ID (Payload Relationship 欄位通常存 ID)
          const newTagId = data.tag.id

          // 避免重複
          if (!currentTags.includes(newTagId)) {
            // 注意：有些情況下 value 是物件陣列，有些是 ID 陣列。
            // 為了保險，我們假設它是 ID 陣列 (基於 Create Tag API 回傳的 tag.id)
            // 如果原本的 value 包含物件，這裡可能會有點問題，但通常 Payload 編輯器在編輯時 value 是 ID。
            setTagsValue([...currentTags, newTagId])
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '建立標籤失敗')
      } finally {
        setCreatingTag(null)
      }
    },
    [suggestions, tagsValue, setTagsValue], // 加入依賴
  )

  return (
    <div className="tags-field-wrapper">
      {/* 原生的 Relationship 欄位 */}
      <RelationshipField {...props} />

      <div className="tags-field-header" style={{ marginTop: '10px' }}>
        <button
          type="button"
          className="tags-ai-button"
          onClick={generateTags}
          disabled={isGenerating || !title}
          title={!title ? '請先填寫標題' : 'AI 建議標籤'}
        >
          {isGenerating ? <span className="tags-loading">⏳</span> : <span>✨ AI 建議</span>}
        </button>
      </div>

      {/* AI 建議區塊 */}
      {suggestions && (
        <div className="tags-suggestions">
          <p className="suggestions-title">AI 建議的標籤：</p>
          {suggestions.existing.length > 0 && (
            <div className="suggestion-group">
              <span className="suggestion-label">現有標籤：</span>
              {suggestions.existing.map((tag, i) => (
                <span key={i} className="suggestion-tag existing">
                  {tag}
                  {createdTags.includes(tag) && <span className="tag-created">✓</span>}
                </span>
              ))}
            </div>
          )}
          {suggestions.new.length > 0 && (
            <div className="suggestion-group">
              <span className="suggestion-label">建議新增：</span>
              {suggestions.new.map((tag, i) => (
                <span key={i} className="suggestion-tag new">
                  {tag}
                  <button
                    type="button"
                    className="tag-add-button"
                    onClick={() => createTag(tag)}
                    disabled={creatingTag === tag}
                    title="建立此標籤"
                  >
                    {creatingTag === tag ? '...' : '+'}
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="suggestions-hint">點擊 + 建立新標籤，然後在上方選擇框中選擇</p>
        </div>
      )}

      {error && <p className="tags-error">{error}</p>}
    </div>
  )
}

export default TagsField
