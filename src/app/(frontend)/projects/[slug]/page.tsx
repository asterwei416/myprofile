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
import { AdUnitClient } from '@/components/AdUnit/AdUnitClient'

type Props = {
  params: Promise<{ slug: string }>
}

// 動態產生 metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const project = docs[0]
  if (!project) return { title: '作品不存在' }

  const ogImage =
    project.thumbnail && typeof project.thumbnail !== 'string' && project.thumbnail.url
      ? [
          {
            url: project.thumbnail.url.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto/'),
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ]
      : []

  const seo = (project as any).seo || {}
  const metaTitle = seo.metaTitle || project.title
  const isNoIndex = seo.noIndex || false
  const isNoFollow = seo.noFollow || false
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://aster.dev'
  const canonicalUrl = seo.canonicalUrl || `${baseUrl}/projects/${slug}`

  return {
    title: `${metaTitle} | Aster`,
    description:
      seo.metaDescription || `探索 ${project.title} 的 Prompt 邏輯、開發思維與技術架構。`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${metaTitle} | Aster`,
      url: canonicalUrl,
      siteName: 'Aster | AI First 實踐玩家',
      images: ogImage,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

// JSON-LD 產生器
function generateJsonLd(project: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://aster.dev'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.summary || project.seo?.metaDescription,
    image:
      project.thumbnail && typeof project.thumbnail !== 'string' ? [project.thumbnail.url] : [],
    datePublished: project.date,
    dateModified: project.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: 'Aster',
        url: 'https://aster.dev',
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '就瞎做',
        item: `${siteUrl}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  }

  const schemas: any[] = [articleSchema, breadcrumbSchema]

  if (project.aiQA && (project.aiQA as any[]).length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (project.aiQA as any[]).map((qa: any) => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.answer,
        },
      })),
    }
    schemas.push(faqSchema)
  }

  return schemas
}

// 預先產生靜態路徑
export async function generateStaticParams() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' } },
      limit: 100,
    })

    return docs.map((project) => ({ slug: project.slug }))
  } catch (error) {
    console.warn(
      'Database connection failed during build, skipping static generation for projects:',
      error,
    )
    return []
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得單一作品
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const project = docs[0]
  if (!project) notFound()

  // 取得廣告設定
  const adSettings = await payload.findGlobal({
    slug: 'ad-settings',
  })
  const projectAdConfig = (adSettings as any)?.projectFooterAd

  // 取得相關作品（同標籤優先，不足補最新）
  let relatedProjects: any[] = []
  let excludeProjectIds: string[] = [project.id]

  // 1. 先找同標籤
  if (project.tags && (project.tags as any[]).length > 0) {
    const tagIds = (project.tags as any[]).map((tag) => (typeof tag === 'string' ? tag : tag.id))
    const { docs: related } = await payload.find({
      collection: 'projects',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: project.id } },
          { tags: { in: tagIds } },
        ],
      },
      limit: 3,
      depth: 1,
    })
    relatedProjects = related
    excludeProjectIds = [...excludeProjectIds, ...related.map((p: any) => p.id)]
  }

  // 2. 不滿 3 個，補上最新作品
  if (relatedProjects.length < 3) {
    const { docs: latest } = await payload.find({
      collection: 'projects',
      where: {
        and: [{ status: { equals: 'published' } }, { id: { not_in: excludeProjectIds } }],
      },
      sort: '-date',
      limit: 3 - relatedProjects.length,
      depth: 1,
    })
    relatedProjects = [...relatedProjects, ...latest]
  }

  return (
    <>
      {/* 返回按鈕 + 標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-lg)',
              fontSize: '0.875rem',
            }}
          >
            ← 返回「就瞎做」
          </Link>

          <h1 style={{ marginBottom: 'var(--space-md)' }}>{project.title}</h1>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(project)) }}
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
              {project.date
                ? new Date(project.date).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </span>

            {/* 標籤 */}
            {project.tags && (project.tags as any[]).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {(project.tags as any[]).map((tag: any, i: number) => (
                  <Tag key={i} name={typeof tag === 'string' ? tag : tag.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 封面圖片 (縮圖) */}
      {project.thumbnail && (
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
                    typeof project.thumbnail === 'string'
                      ? project.thumbnail
                      : (project.thumbnail as any).url
                  }
                  alt={project.title}
                  style={{ objectFit: 'cover' }}
                  priority // LCP image
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 專案內容 */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* AEO: 重點摘要區塊 (Key Takeaways) */}
          {(project as any).summary && (
            <section
              className="project-summary"
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
                {(project as any).summary}
              </div>
            </section>
          )}

          <div className="rich-text-content">
            <RichText data={project.content} converters={jsxConverters} />
          </div>

          {/* AI 讀心問答區塊 */}
          {(project as any).aiQA && (project as any).aiQA.length > 0 && (
            <QAAccordion items={(project as any).aiQA} />
          )}
        </div>
      </section>

      {/* 作品集頁廣告 */}
      {projectAdConfig?.enabled && (
        <section className="section">
          <div className="container" style={{ maxWidth: '800px' }}>
            <AdUnitClient adConfig={projectAdConfig} />
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
                          <CloudinaryImage
                            src={typeof rp.thumbnail === 'string' ? rp.thumbnail : rp.thumbnail.url}
                            alt={rp.title}
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 400px"
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
                        <p className="project-card-meta">
                          {rp.date ? new Date(rp.date).toLocaleDateString('zh-TW') : ''}
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
