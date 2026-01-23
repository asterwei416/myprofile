import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import { Tag } from '../../components/Tag'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { jsxConverters } from '@/components/RichText/converters'
import { QAAccordion } from '@/components/QAAccordion'
import { AdUnit } from '@/components/AdUnit'

type Props = {
  params: Promise<{ slug: string }>
}

// 動態產生 metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = docs[0]
  if (!post) return { title: '文章不存在' }

  const ogImage =
    post.thumbnail && typeof post.thumbnail !== 'string' && post.thumbnail.url
      ? [
          {
            url: post.thumbnail.url.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto/'),
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ]
      : []

  return {
    title: `${post.title} | Aster`,
    description: (post as any).seo?.metaDescription || `閱讀 ${post.title} — Aster 技術部落格`,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      images: ogImage,
      tags: (post.tags as any[])?.map((t) => (typeof t === 'string' ? t : t.name)),
    },
  }
}

// JSON-LD 產生器
function generateJsonLd(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    // AEO: 如果有摘要，優先使用摘要作為 description，讓 AI 更容易抓取
    description: post.summary || post.seo?.metaDescription,
    image: post.thumbnail && typeof post.thumbnail !== 'string' ? [post.thumbnail.url] : [],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: 'Aster',
        url: 'https://aster.dev',
      },
    ],
  }
}

// 預先產生靜態路徑
export async function generateStaticParams() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 100,
    })

    return docs.map((post) => ({ slug: post.slug }))
  } catch (error) {
    console.warn(
      'Database connection failed during build, skipping static generation for blog posts:',
      error,
    )
    return []
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得單篇文章
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  // 1. 取得相關文章（同標籤優先，不足補最新）
  let relatedPosts: any[] = []
  let excludePostIds: string[] = [post.id] // 排除目前這篇

  // 1-1. 先找同標籤
  if (post.tags && (post.tags as any[]).length > 0) {
    const tagIds = (post.tags as any[]).map((tag) => (typeof tag === 'string' ? tag : tag.id))
    const { docs: related } = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: post.id } },
          { tags: { in: tagIds } },
        ],
      },
      limit: 3,
      depth: 1,
    })
    relatedPosts = related
    excludePostIds = [...excludePostIds, ...related.map((p: any) => p.id)]
  }

  // 1-2. 不滿 3 篇，補上最新文章
  if (relatedPosts.length < 3) {
    const { docs: latest } = await payload.find({
      collection: 'posts',
      where: {
        and: [{ status: { equals: 'published' } }, { id: { not_in: excludePostIds } }],
      },
      sort: '-publishedAt',
      limit: 3 - relatedPosts.length,
      depth: 1,
    })
    relatedPosts = [...relatedPosts, ...latest]
  }

  return (
    <>
      {/* 返回按鈕 + 標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-lg)',
              fontSize: '0.875rem',
            }}
          >
            ← 返回「就亂寫」
          </Link>

          <h1 style={{ marginBottom: 'var(--space-md)' }}>{post.title}</h1>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(post)) }}
          />

          {/* Meta 資訊 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-lg)',
              alignItems: 'center',
              marginBottom: 'var(--space-xl)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}
            >
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </span>

            {/* 標籤 */}
            {post.tags && (post.tags as any[]).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {(post.tags as any[]).map((tag: any, i: number) => (
                  <Tag key={i} name={typeof tag === 'string' ? tag : tag.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 封面圖片 (縮圖) */}
      {post.thumbnail && (
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <CloudinaryImage
                  src={
                    typeof post.thumbnail === 'string'
                      ? post.thumbnail
                      : (post.thumbnail as any).url
                  }
                  alt={post.title}
                  style={{ objectFit: 'cover' }}
                  priority // LCP image
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 文章內容 */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* AEO: 重點摘要區塊 (Key Takeaways) */}
          {(post as any).summary && (
            <section
              className="post-summary"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: 'var(--space-lg)',
                marginBottom: 'var(--space-xl)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  marginBottom: 'var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                }}
              >
                <span>💡</span> 重點摘要 (TL;DR)
              </h2>
              <div
                style={{
                  whiteSpace: 'pre-line',
                  lineHeight: '1.8',
                  color: 'var(--text-primary)',
                }}
              >
                {(post as any).summary}
              </div>
            </section>
          )}

          <div className="rich-text-content">
            <RichText data={post.content} converters={jsxConverters} />
          </div>

          {/* 文章底部廣告 */}
          <AdUnit slot="postFooterAd" />

          {/* AI 讀心問答區塊 */}
          {(post as any).aiQA && (post as any).aiQA.length > 0 && (
            <QAAccordion items={(post as any).aiQA} />
          )}
        </div>
      </section>

      {/* 相關文章 */}
      {relatedPosts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="related-section" style={{ borderTop: 'none', paddingTop: 0 }}>
              <h3 className="related-section-title">
                相關<span className="accent">文章</span>
              </h3>
              <div className="grid" style={{ gap: 'var(--space-md)' }}>
                {relatedPosts.map((rp: any) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ textDecoration: 'none' }}>
                    <article className="post-card">
                      <div
                        className="post-card-image"
                        style={{
                          position: 'relative',
                          backgroundColor: '#2a2a2a',
                        }}
                      >
                        {rp.thumbnail && typeof rp.thumbnail !== 'string' && rp.thumbnail.url ? (
                          <CloudinaryImage
                            src={rp.thumbnail.url}
                            alt={rp.title}
                            fill={false}
                            width={rp.thumbnail.width || 400}
                            height={rp.thumbnail.height || 300}
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                            }}
                            sizes="(max-width: 768px) 100vw, 400px"
                            crop="fill"
                            gravity="auto"
                            aspectRatio="1.5"
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
                        <h3 className="post-card-title">{rp.title}</h3>
                        {rp.excerpt && (
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
                            {rp.excerpt}
                          </p>
                        )}
                        {/* 標籤顯示 */}
                        {rp.tags && (rp.tags as any[]).length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              gap: 'var(--space-xs)',
                              marginBottom: 'var(--space-sm)',
                            }}
                          >
                            {(rp.tags as any[]).slice(0, 3).map((tag: any, i: number) => (
                              <Tag key={i} name={typeof tag === 'string' ? tag : tag.name} />
                            ))}
                          </div>
                        )}
                        <p className="post-card-meta">
                          {rp.publishedAt
                            ? new Date(rp.publishedAt).toLocaleDateString('zh-TW')
                            : ''}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
