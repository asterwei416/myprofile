import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export const metadata = {
  title: '作品集 | Aster',
  description: '探索我的 AI 作品集——每個專案都包含完整的 Prompt 邏輯、開發思維、以及技術架構拆解。',
}

export default async function ProjectsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得所有已發布的作品
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: {
      status: { equals: 'published' },
    },
    sort: '-date',
    limit: 100,
  })

  return (
    <>
      {/* 頁面標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header">
            <h1>AI 作品集</h1>
          </div>
          <p style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
            每個專案都包含完整的 Prompt 邏輯、開發思維，以及技術架構拆解。
            點擊任一作品深入了解開發過程與技術細節。
          </p>
        </div>
      </section>

      {/* 作品列表 */}
      <section className="section">
        <div className="container">
          {projects.length > 0 ? (
            <div className="grid grid-3">
              {projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article className="project-card">
                    <div className="project-card-image">
                      {project.thumbnail ? (
                        <img
                          src={
                            typeof project.thumbnail === 'string'
                              ? project.thumbnail
                              : project.thumbnail.url
                          }
                          alt={project.title}
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
                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-meta">
                        {project.date ? new Date(project.date).toLocaleDateString('zh-TW') : ''}
                      </p>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="project-card-tags">
                          {project.techStack.slice(0, 4).map((tech: any, i: number) => (
                            <span key={i} className="tag">
                              {tech.name}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="tag">+{project.techStack.length - 4}</span>
                          )}
                        </div>
                      )}
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
                尚無已發布的作品
              </p>
              <Link href="/admin" className="btn btn-primary">
                前往後台新增作品
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
