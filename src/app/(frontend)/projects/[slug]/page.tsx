import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import { Tag } from '../../components/Tag'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { jsxConverters } from '@/components/RichText/converters'

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

  return {
    title: `${project.title} | Aster`,
    description: `探索 ${project.title} 的 Prompt 邏輯、開發思維與技術架構。`,
  }
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

      {/* 專案內容 */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="rich-text-content">
            <div className="rich-text-content">
              <RichText data={project.content} converters={jsxConverters} />
            </div>
          </div>
        </div>
      </section>

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
