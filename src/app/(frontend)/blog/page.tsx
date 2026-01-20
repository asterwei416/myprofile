import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Tag } from '../components/Tag'
import config from '@/payload.config'
import { getOptimizedImageUrl } from '@/utils/image'

export const metadata = {
  title: '技術部落格 | Aster',
  description: '分享前端開發、AI 應用、React、Next.js、TypeScript 等技術文章與心得。',
}

// 輔助函式：從 Lexical JSON 遞迴提取純文字
function extractTextFromLexical(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  // 處理 text node
  if (node.text) return node.text
  // 處理 children
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join('')
  }
  // 處理 root
  if (node.root) {
    return extractTextFromLexical(node.root)
  }
  return ''
}

export default async function BlogPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得所有已發布的文章
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 100,
  })

  // 預處理文章資料：生成摘要
  const postsWithExcerpt = posts.map((post: any) => {
    let excerpt = ''
    if (post.content && post.content.root) {
      const fullText = extractTextFromLexical(post.content)
      // 截取前 250 字
      excerpt = fullText.slice(0, 250)
      if (fullText.length > 250) excerpt += '...'
    }
    return { ...post, excerpt }
  })

  console.log('部落格文章資料:', JSON.stringify(postsWithExcerpt, null, 2))

  return (
    <>
      {/* 頁面標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header">
            <h1>文章</h1>
          </div>
          <p style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
            只探討邏輯但沒什麼大道理，純粹是我的「釋放記憶體」儀式，
            <br />
            撇開生硬的教科書，這裡只有我為了跟上 AI 時代，燃燒腦細胞換來的卡路里。
          </p>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="section">
        <div className="container">
          {postsWithExcerpt.length > 0 ? (
            <div className="grid" style={{ gap: 'var(--space-md)' }}>
              {postsWithExcerpt.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="post-card">
                    <div
                      className="post-card-image"
                      style={{
                        position: 'relative',
                        height: '200px',
                        overflow: 'hidden',
                        backgroundColor: '#2a2a2a',
                      }}
                    >
                      {post.thumbnail &&
                      typeof post.thumbnail !== 'string' &&
                      post.thumbnail.url ? (
                        <img
                          src={getOptimizedImageUrl(post.thumbnail.url, 800)}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                            fontSize: '3rem',
                          }}
                        >
                          🖼️
                        </div>
                      )}
                    </div>
                    <div className="post-card-content">
                      <h3 className="post-card-title">{post.title}</h3>
                      {post.excerpt && (
                        <p
                          className="post-card-excerpt"
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            margin: '0.5rem 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      {/* 標籤顯示 */}
                      {post.tags && (post.tags as any[]).length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 'var(--space-xs)',
                            marginBottom: 'var(--space-sm)',
                          }}
                        >
                          {(post.tags as any[]).slice(0, 3).map((tag: any, i: number) => (
                            <Tag key={i} name={typeof tag === 'string' ? tag : tag.name} />
                          ))}
                        </div>
                      )}
                      <p className="post-card-meta">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('zh-TW')
                          : ''}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                尚無已發布的文章
              </p>
              <Link href="/admin" className="btn btn-primary">
                前往後台新增文章
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
