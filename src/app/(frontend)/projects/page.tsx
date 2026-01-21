import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Tag } from '../components/Tag'
import config from '@/payload.config'
import { CloudinaryImage } from '@/components/CloudinaryImage'

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
    depth: 1,
  })

  return (
    <>
      {/* 頁面標題區塊 */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header">
            <h1>AI 作品</h1>
          </div>
          <p style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
            做人如果沒有一點廢物專案，那跟鹹魚有什麼分別？這些東西幫我擋掉了那些蠢到想哭的手動任務，節省下來的數百個小時—讓我能毫無愧疚地多追幾百集影集。
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
                    <div
                      className="project-card-image"
                      style={{
                        position: 'relative',
                        height: '200px',
                        overflow: 'hidden',
                        backgroundColor: '#2a2a2a',
                      }}
                    >
                      {project.thumbnail &&
                      typeof project.thumbnail !== 'string' &&
                      project.thumbnail.url ? (
                        <CloudinaryImage
                          src={project.thumbnail.url}
                          alt={project.title}
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 400px"
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
                      {/* 分類 Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#fff',
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          zIndex: 10,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {project.category && typeof project.category !== 'string'
                          ? project.category.name
                          : '未分類'}
                      </div>
                    </div>
                    <div className="project-card-body">
                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-meta">
                        {project.date ? new Date(project.date).toLocaleDateString('zh-TW') : ''}
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
