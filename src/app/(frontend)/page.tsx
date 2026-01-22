import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Tag } from './components/Tag'
import config from '@/payload.config'
import { CloudinaryImage } from '@/components/CloudinaryImage'

import { TimelineSection } from '@/components/TimelineSection'

// 輔助函式：從 Lexical JSON 遞迴提取純文字
function extractTextFromLexical(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  // 處理 text node
  if (node.text) return node.text
  // 處理 children
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join('')
  }
  // 處理 root
  if (node.root) {
    return extractTextFromLexical(node.root)
  }
  return ''
}

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
    depth: 1,
  })

  // 取得最新發布的文章（最多 3 個）
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
  })

  // 預處理文章資料：生成摘要
  const postsWithExcerpt = posts.map((post: any) => {
    let excerpt = ''
    if (post.content && post.content.root) {
      const fullText = extractTextFromLexical(post.content)
      // 截取前 250 字
      excerpt = fullText.slice(0, 250)
      if (fullText.length > 250) excerpt += '...'
    }
    return { ...post, excerpt }
  })

  return (
    <>
      {/* Hero 區塊 - 置中設計 */}
      <section className="profile-hero">
        <div className="profile-hero-content">
          {/* 頭像 */}
          <div className="profile-avatar">
            <div className="profile-avatar-inner">
              <CloudinaryImage
                src="/avatar-3d.jpg"
                alt="Aster"
                className="profile-avatar-img"
                priority // Hero image, load immediately (LCP)
                quality="auto:good" // Keep high quality for avatar
              />
            </div>
          </div>

          {/* 名字 */}
          <h1 className="profile-name">Aster</h1>
          <p className="profile-role">AI First 實踐玩家</p>

          {/* 座右銘 */}
          <blockquote className="profile-quote">
            <span className="quote-mark">&quot;</span>
            <p>數據驅動增長，AI 拆解大局，</p>
            <p>以底層邏輯為骨架，讓想像在算力中落地為現實。</p>
          </blockquote>

          {/* 快速連結 */}
          <div className="profile-links">
            <Link href="/projects" className="btn btn-secondary">
              AI 作品
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              文章
            </Link>
          </div>
        </div>
      </section>

      {/* 關於我 */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">
                <span className="about-title-icon">👋</span>
                認識 Aster (欸斯特)
              </h2>
              <p>
                過去的我，搞數位行銷、玩數據、做成長駭客；直到 AI
                這波「超音速海嘯」襲來，我看見了人類史上首度能「開外掛」當超人的契機——這一次，我絕不錯過。
              </p>
              <p>
                目前的狀態：<strong>AI First 實踐玩家</strong> / 也是專業的「數位行銷廢材」。
              </p>
              <p>做法直白： 把無聊的事全丟給 AI，將時間留給體驗生活與創造。</p>
              <p
                style={{
                  marginTop: 'var(--space-lg)',
                  marginBottom: 'var(--space-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                我的實踐準則也很單純 ↓↓↓
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>優雅解構</strong>：
                  以程式碼將複雜的業務邏輯，轉化為優雅流暢的流程。
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>算力放大</strong>： 以 AI
                  為槓桿，無限放大人類的理解深度與想像力。
                </li>
                <li style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>系統思考</strong>：
                  將龐雜的「局」，拆解為清晰可控的架構。
                </li>
              </ul>
              <p style={{ marginTop: 'var(--space-lg)' }}>
                本質上，我正在進行一場認知的「逆向工程」，在這個執行力逐漸貶值的時代，用系統化視角看透虛實，並透過
                AI 加速實現那個由我們定義好的未來。
              </p>
              <p
                style={{
                  marginTop: 'var(--space-md)',
                  fontStyle: 'italic',
                  color: 'var(--color-primary)',
                }}
              >
                這裡就是我的 #AI廢人養成計劃 —— 看我怎麼用 GenAI、AI Workflow 跟 Vibe
                Coding等工具，一步步把自己「自動化」！
              </p>
              <div className="about-tags">
                <Tag name="Growth Hacking" className="tag-green" />
                <Tag name="數據分析" className="tag-cyan" />
                <Tag name="AI/LLM" className="tag-purple" />
                <Tag name="Prompt Engineering" className="tag-yellow" />
                <Tag name="系統思考" className="tag-cyan" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 時間軸 */}
      <TimelineSection />

      {/* 最新作品 */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <h2 className="section-title-center">
            <img src="/projects-icon.jpg" alt="" className="section-title-icon-img" />
            最新瞎做
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-3">
              {projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article className="project-card">
                    <div
                      className="project-card-image"
                      style={{
                        position: 'relative',
                        // height: '200px', // Removed to let CSS aspect-ratio handle responsive sizing
                        width: '100%', // Ensure it fills the card
                        overflow: 'hidden',
                        backgroundColor: '#2a2a2a', // Fallback color
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
                          crop="fill"
                          gravity="auto"
                          aspectRatio="2.0"
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
                      {/* 分類 Badge (Always render for consistency) */}
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
      <section className="section">
        <div className="container">
          <h2 className="section-title-center">
            <img src="/blog-icon.jpg" alt="" className="section-title-icon-img" />
            最新亂寫
          </h2>
          {postsWithExcerpt.length > 0 ? (
            <div className="grid" style={{ gap: 'var(--space-md)' }}>
              {postsWithExcerpt.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="post-card">
                    <div
                      className="post-card-image"
                      style={{
                        position: 'relative',
                        backgroundColor: '#2a2a2a', // Fallback color
                      }}
                    >
                      {post.thumbnail &&
                      typeof post.thumbnail !== 'string' &&
                      post.thumbnail.url ? (
                        <CloudinaryImage
                          src={post.thumbnail.url}
                          alt={post.title}
                          fill={false}
                          width={post.thumbnail.width || 400} // Add default fallback
                          height={post.thumbnail.height || 300} // Add default fallback
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
                      <h3 className="post-card-title">{post.title}</h3>
                      {post.excerpt && (
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
                          {post.excerpt}
                        </p>
                      )}

                      {/* 標籤顯示 */}
                      {post.tags && (post.tags as any[]).length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            gap: 'var(--space-xs)',
                            marginBottom: 'var(--space-sm)',
                          }}
                        >
                          {(post.tags as any[]).slice(0, 3).map((tag: any, i: number) => (
                            <Tag key={i} name={typeof tag === 'string' ? tag : tag.name} />
                          ))}
                        </div>
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
          {postsWithExcerpt.length > 0 && (
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
