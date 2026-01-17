import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'

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

  return {
    title: `${post.title} | Aster`,
    description: post.excerpt || `閱讀 ${post.title} — Aster 技術部落格`,
  }
}

// 預先產生靜態路徑
export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 100,
  })

  return docs.map((post) => ({ slug: post.slug }))
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

  // 取得相關文章（同標籤）
  let relatedPosts: any[] = []
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
    })
    relatedPosts = related
  }

  // 取得相關作品（同標籤）
  let relatedProjects: any[] = []
  if (post.tags && (post.tags as any[]).length > 0) {
    const tagIds = (post.tags as any[]).map((tag) => (typeof tag === 'string' ? tag : tag.id))

    const { docs: projects } = await payload.find({
      collection: 'projects',
      where: {
        and: [{ status: { equals: 'published' } }, { tags: { in: tagIds } }],
      },
      limit: 3,
    })
    relatedProjects = projects
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
            ← 返回部落格
          </Link>

          <h1 style={{ marginBottom: 'var(--space-md)' }}>{post.title}</h1>

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
                  <span key={i} className="tag">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 封面圖片 */}
      {post.coverImage && (
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={
                  typeof post.coverImage === 'string'
                    ? post.coverImage
                    : (post.coverImage as any).url
                }
                alt={post.title}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 文章內容 */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="rich-text-content">
            <RichText data={post.content} />
          </div>
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
                      <div className="post-card-content">
                        <h3 className="post-card-title">{rp.title}</h3>
                        {rp.excerpt && <p className="post-card-excerpt">{rp.excerpt}</p>}
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

      {/* 相關作品 */}
      {relatedProjects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="related-section">
              <h3 className="related-section-title">
                相關<span className="accent">作品</span>
              </h3>
              <div className="grid grid-3">
                {relatedProjects.map((rp: any) => (
                  <Link
                    key={rp.id}
                    href={`/projects/${rp.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <article className="project-card">
                      <div className="project-card-image">
                        {rp.thumbnail ? (
                          <img
                            src={typeof rp.thumbnail === 'string' ? rp.thumbnail : rp.thumbnail.url}
                            alt={rp.title}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'var(--bg-elevated)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="project-card-body">
                        <h3 className="project-card-title">{rp.title}</h3>
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
