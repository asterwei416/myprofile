import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // 取得最新發布的作品（最多 3 個）
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: {
      status: { equals: 'published' },
    },
    sort: '-date',
    limit: 3,
  })

  // 取得最新發布的文章（最多 3 個）
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
  })

  return (
    <>
      {/* Hero 區塊 */}
      <section className="section hero">
        <div className="container">
          <h1 className="hero-title">
            嗨，我是 <span className="highlight">Wei Aster</span>
            <br />
            一位數位工匠
          </h1>
          <p className="hero-subtitle">
            Frontend Developer · AI Explorer · 持續打造有價值的產品
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <Link href="/projects" className="btn btn-primary">
              瀏覽作品集
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              閱讀文章
            </Link>
          </div>
        </div>
      </section>

      {/* 關於我 */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2>關於我</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
            <div>
              <p>
                我是一位專注於前端開發與 AI 應用的工程師，熱衷於將複雜的技術轉化為優雅的使用者體驗。
              </p>
              <p>
                在這個網站，你可以看到我的 AI 作品集——每個專案都包含完整的 Prompt 邏輯、開發思維、以及技術架構拆解。
                我也會在部落格分享前端技術文章，探討 React、Next.js、TypeScript 等主題。
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                {"Let's build something amazing together."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 最新作品 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>最新作品</h2>
          </div>
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
                        {project.date
                          ? new Date(project.date).toLocaleDateString('zh-TW')
                          : ''}
                      </p>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="project-card-tags">
                          {project.techStack.slice(0, 3).map((tech: any, i: number) => (
                            <span key={i} className="tag">
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              尚無已發布的作品，請前往{' '}
              <Link href="/admin" style={{ color: 'var(--color-primary)' }}>
                後台管理
              </Link>{' '}
              新增第一個作品。
            </p>
          )}
          {projects.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
              <Link href="/projects" className="btn btn-secondary">
                查看全部作品 →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 最新文章 */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2>最新文章</h2>
          </div>
          {posts.length > 0 ? (
            <div className="grid" style={{ gap: 'var(--space-md)' }}>
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article className="post-card">
                    <div className="post-card-content">
                      <h3 className="post-card-title">{post.title}</h3>
                      {post.excerpt && (
                        <p className="post-card-excerpt">{post.excerpt}</p>
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
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              尚無已發布的文章，請前往{' '}
              <Link href="/admin" style={{ color: 'var(--color-primary)' }}>
                後台管理
              </Link>{' '}
              新增第一篇文章。
            </p>
          )}
          {posts.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
              <Link href="/blog" className="btn btn-secondary">
                閱讀更多文章 →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
