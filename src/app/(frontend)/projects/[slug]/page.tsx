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
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 100,
  })

  return docs.map((project) => ({ slug: project.slug }))
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

  // 取得相關作品（同標籤）
  let relatedProjects: any[] = []
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
    })
    relatedProjects = related
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
            ← 返回作品集
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

            {/* 技術棧標籤 */}
            {project.techStack && (project.techStack as any[]).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {(project.techStack as any[]).map((tech, i) => (
                  <span key={i} className="tag">
                    {tech.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 外部連結 */}
          {project.externalLinks && (project.externalLinks as any[]).length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-xl)',
              }}
            >
              {(project.externalLinks as any[]).map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  {link.icon === 'github' && '🐙 '}
                  {link.icon === 'video' && '🎬 '}
                  {link.icon === 'file-text' && '📄 '}
                  {link.icon === 'external-link' && '🔗 '}
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 縮圖 */}
      {project.thumbnail && (
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="container">
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={
                  typeof project.thumbnail === 'string'
                    ? project.thumbnail
                    : (project.thumbnail as any).url
                }
                alt={project.title}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 作品內容 */}
      {project.content && (
        <section className="section">
          <div className="container">
            <div className="rich-text-content">
              <RichText data={project.content} />
            </div>
          </div>
        </section>
      )}

      {/* Prompt 邏輯區塊 */}
      {project.promptLogic && (
        <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="section-header">
              <h2>💡 Prompt 邏輯</h2>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <span className="code-block-label">prompt.md</span>
              </div>
              <div className="code-block-content">
                <pre>
                  <code>{project.promptLogic}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 開發思維區塊 */}
      {project.devThinking && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>🧠 開發思維</h2>
            </div>
            <div className="rich-text-content">
              <RichText data={project.devThinking} />
            </div>
          </div>
        </section>
      )}

      {/* 技術架構拆解區塊 */}
      {project.architecture && (
        <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="section-header">
              <h2>🏗️ 技術架構拆解</h2>
            </div>
            <div className="rich-text-content">
              <RichText data={project.architecture} />
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
