'use client'

import React, { useState, useCallback } from 'react'
import { useFormFields, useField } from '@payloadcms/ui'
import './styles.css'

const styles = [
  { value: 'pixar', label: '🎡 3D 皮克斯風 (預設)' },
  { value: 'realistic', label: '📸 寫實科技風' },
  { value: 'cyberpunk', label: '🌃 賽博龐克' },
  { value: 'minimalist', label: '🔷 極簡幾何' },
  { value: 'watercolor', label: '🎨 水彩藝術' },
  { value: 'neon', label: '⚡ 霓虹故障風' },
]

// Helper to resize Cloudinary URL
const resizeCloudinaryUrl = (url: string, width = 600) => {
  if (!url || typeof url !== 'string') return ''
  if (!url.includes('res.cloudinary.com')) return url
  const parts = url.split('/upload/')
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/f_auto,q_auto:eco,w_${width},c_limit/${parts[1]}`
}

// Loading messages sequence
const loadingMessages = [
  '🧠 AI 正在閱讀文章內容...',
  '🎨 正在構思畫面構圖...',
  '✨ 正在渲染光影細節...',
  '📤 正在上傳到雲端...',
]

const ThumbnailGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('pixar')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState<string>('啟動 AI 引擎...')

  // 獲取標題
  const titleField = useFormFields(([fields]) => fields['title'])
  const title = titleField?.value as string

  // 獲取內容 (RichText)
  const contentField = useFormFields(([fields]) => fields['content'])
  const content = contentField?.value

  // 獲取 thumbnail 欄位以更新它
  const { setValue: setThumbnailValue } = useField<string>({ path: 'thumbnail' })
  const thumbnailField = useFormFields(([fields]) => fields['thumbnail'])
  const thumbnailId = thumbnailField?.value as string

  // 監聽 thumbnailId 變更，自動抓取預覽圖
  React.useEffect(() => {
    if (thumbnailId && typeof thumbnailId === 'string') {
      // 避免重複 fetch (如果剛生成完已有 previewUrl，這裡可以優化，但為了確保一致性還是 fetch 一下無妨)
      fetch(`/api/media/${thumbnailId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPreviewUrl(resizeCloudinaryUrl(data.url))
          }
        })
        .catch((err) => console.error('Error fetching thumbnail preview:', err))
    } else if (!thumbnailId) {
      // 如果縮圖被移除了，清空預覽
      setPreviewUrl(null)
    }
  }, [thumbnailId])

  // 獲取 seo.ogImage 欄位以同步更新
  const { setValue: setOgImageValue } = useField<string>({ path: 'seo.ogImage' })

  // 輔助函數：從 Lexical JSON 提取純文字
  const extractTextFromLexical = useCallback((node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractTextFromLexical).join(' ')
    // 處理 root children
    if (node.root && node.root.children) return extractTextFromLexical(node.root.children)
    // 處理 children
    if (node.children) return extractTextFromLexical(node.children)
    // 處理 text node
    if (node.text) return node.text
    return ''
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!title) {
      setMessage({ type: 'error', text: '請先輸入標題' })
      return
    }

    setIsGenerating(true)
    setMessage(null)
    setLoadingStage(loadingMessages[0])

    // Start rotating messages
    let msgIndex = 0
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length
      // Keep the last message (Uploading) if we are deep in time
      if (msgIndex < loadingMessages.length) {
        setLoadingStage(loadingMessages[msgIndex])
      }
    }, 2500) // Switch every 2.5s to match approx 8-10s total time

    // 提取全文內容
    const fullText = extractTextFromLexical(content)

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          contentPreview: fullText,
          style: selectedStyle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成失敗')
      }

      // 更新 thumbnail 欄位
      setThumbnailValue(data.mediaId)

      // 同步更新 OG Image
      setOgImageValue(data.mediaId)

      setPreviewUrl(resizeCloudinaryUrl(data.url))

      setMessage({ type: 'success', text: '✨ 生成成功！圖片已填入下方的縮圖欄位' })
    } catch (error) {
      console.error('生成縮圖錯誤:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '生成失敗，請稍後再試',
      })
    } finally {
      clearInterval(msgInterval)
      setIsGenerating(false)
    }
  }, [title, selectedStyle, setThumbnailValue, setOgImageValue, content, extractTextFromLexical])

  return (
    <div className="thumbnail-generator-wrapper">
      <div className="thumbnail-controls">
        <select
          className="style-selector"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          disabled={isGenerating}
        >
          {styles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating || !title}
        >
          {isGenerating ? (
            <div className="generating-status">
              <div className="loading-spinner" />
              <span className="loading-text">{loadingStage}</span>
            </div>
          ) : (
            <>✨ AI 生成縮圖</>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`status-message ${message.type === 'error' ? 'error-message' : 'success-message'}`}
        >
          {message.text}
        </div>
      )}

      {previewUrl && (
        <div className="preview-area" style={{ marginTop: '15px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Generated Preview"
            className="preview-image"
            style={{ width: '100%', borderRadius: '8px', border: '1px solid #444' }}
          />
        </div>
      )}
    </div>
  )
}

export default ThumbnailGenerator
