import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const metadata = {
  title: '技術部落格 | Aster',
  description: '分享前端開發、AI 應用、React、Next.js、TypeScript 等技術文章與心得。',
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

  console.log('部落格文章資料:', JSON.stringify(posts, null, 2))

  return (
    <>
      {/* 頁面標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header">
            <h1>技術部落格</h1>
          </div>
          <p style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
            分享前端開發經驗、AI 應用實作、以及技術探索心得。 這裡記錄著我在
            React、Next.js、TypeScript 等領域的學習與實踐。
          </p>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog-list">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="blog-card">
                    <div
                      className="blog-card-image"
                      style={{
                        position: 'relative',
                        backgroundColor: '#2a2a2a',
                        minHeight: '200px', // Ensure height
                      }}
                    >
                      {post.thumbnail &&
                      typeof post.thumbnail !== 'string' &&
                      post.thumbnail.url ? (
                        <img
                          src={post.thumbnail.url}
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
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                        >
                          🖼️
                        </div>
                      )}
                      {/* 分類 Badge (Always render) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: '#fff',
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          zIndex: 10,
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      >
                        {post.category && typeof post.category !== 'string'
                          ? post.category.name
                          : '未分類'}
                      </div>
                    </div>
                    <div className="blog-card-content">
                      <h2 className="blog-card-title">{post.title}</h2>
                      {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                      <div className="blog-card-footer">
                        <span className="blog-card-date">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : ''}
                        </span>
                        {post.tags && (post.tags as any[]).length > 0 && (
                          <div className="blog-card-tags">
                            {(post.tags as any[]).slice(0, 3).map((tag: any, i: number) => (
                              <span key={i} className="tag">
                                {typeof tag === 'string' ? tag : tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
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
