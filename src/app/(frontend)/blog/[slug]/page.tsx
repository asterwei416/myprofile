import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import { Tag } from '../../components/Tag'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CloudinaryImage } from '@/components/CloudinaryImage'

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
    description: (post as any).meta?.description || `閱讀 ${post.title} — Aster 技術部落格`,
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

  // 2. 取得相關作品（同標籤優先，不足補最新）
  let relatedProjects: any[] = []
  let excludeProjectIds: string[] = []

  // 2-1. 先找同標籤
  if (post.tags && (post.tags as any[]).length > 0) {
    const tagIds = (post.tags as any[]).map((tag) => (typeof tag === 'string' ? tag : tag.id))
    const { docs: projects } = await payload.find({
      collection: 'projects',
      where: {
        and: [{ status: { equals: 'published' } }, { tags: { in: tagIds } }],
      },
      limit: 3,
      depth: 1,
    })
    relatedProjects = projects
    excludeProjectIds = [...projects.map((p: any) => p.id)]
  }

  // 2-2. 不滿 3 個，補上最新作品
  if (relatedProjects.length < 3) {
    const { docs: latestProjects } = await payload.find({
      collection: 'projects',
      where: {
        and: [{ status: { equals: 'published' } }, { id: { not_in: excludeProjectIds } }],
      },
      sort: '-date',
      limit: 3 - relatedProjects.length,
      depth: 1,
    })
    relatedProjects = [...relatedProjects, ...latestProjects]
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
