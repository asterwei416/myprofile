import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

// 時間軸資料（之後可移至 CMS）
const timelineData = [
  {
    year: '2000 - 2013',
    phase: '第一階段：底層邏輯初始化',
    items: [
      {
        type: 'foundation',
        title: '機械航太 × MBA 的跨界底子',
        description:
          '練出「結構決定功能」的直覺；並在工程腦上裝了商業邏輯，開始懂得用策略、金錢跟資源調度來拆解這個世界',
        icon: '⚙️🎓',
      },
      {
        type: 'foundation',
        title: '商場運作的資源調度',
        description: '搞定千萬級預算跟招商——現實版的資源配置最佳化，在一團亂中理出順暢的流程',
        icon: '💼',
        websites: [
          {
            name: '誠品生活',
            url: 'https://www.eslitespectrum.com/',
            image: '/screenshots/eslite.png',
          },
        ],
      },
      {
        type: 'foundation',
        title: '公司治理的代碼審計',
        description: '拆解 30+ 上市櫃公司的財報與組織架構，從數字的破綻看穿企業底層運作邏輯',
        icon: '🔍',
        websites: [{ name: '中華公司治理協會', url: 'https://www.cga.org.tw/' }],
      },
    ],
  },
  {
    year: '2013 - 2020',
    phase: '第二階段：數位技能狂飆期',
    items: [
      {
        type: 'growth',
        title: '創業新手村地獄模式',
        description:
          'SEO、廣告投放、自媒體經營、CRM 架構通通自己來——不是在學工具，是在學怎麼讓公司活下去',
        icon: '�',
      },
      {
        type: 'growth',
        title: '技術自己搞的打怪升級',
        description:
          '為了提高轉換率，開始研究網頁結構跟自動化腳本——技術不是拿來炫的，是拿來解決實際增長問題的',
        icon: '⚔️',
      },
      {
        type: 'growth',
        title: '流量暴增 250%',
        description:
          '在 Bella/媽媽寶寶用 SEO工程一波操作，網站 PV 直接噴發——跟流量跟權重互尬的日子',
        icon: '📈',
        websites: [
          { name: 'Bella 儂儂', url: 'https://www.bella.tw/' },
          { name: '媽媽寶寶', url: 'https://www.mombaby.com.tw/' },
        ],
      },
      {
        type: 'growth',
        title: '數據中樞的全地圖外掛',
        description:
          '在壹傳媒集團當 GA360 與 Data Warehouse 的 PM，把亂七八糟的數據整理成能用的數位情報系統',
        icon: '🏗️',
      },
    ],
  },
  {
    year: '2020 - 2025',
    phase: '第三階段：定義局勢的策略架構師',
    items: [
      {
        type: 'work',
        title: '產品領導力',
        description: '帶領 10 人以上團隊進行全通路行銷，確立 North Star Metric 與 OKR 目標管理',
        icon: '👥',
      },
      {
        type: 'work',
        title: 'CRM 與行為分析',
        description: '主導導入 Amplitude 行為分析平台，建立精準的 RFM 模型與自動化分群行銷',
        icon: '📊',
      },
      {
        type: 'work',
        title: '數據驅動決策',
        description: '企劃雙邊市場的資料探勘架構，將數據觀察深度整合至產品開發流程中',
        icon: '🎯',
      },
    ],
  },
  {
    year: '現在 - 2026',
    phase: '第四階段：AI 時代的定義者',
    items: [
      {
        type: 'ai',
        title: 'Vibe Coding 實踐',
        description: '告別低效開發，利用 Cursor Composer 與 AI 生成快速產出 MVP 並進行驗證',
        icon: '🚀',
      },
      {
        type: 'ai',
        title: '自動化爬蟲 Pipeline',
        description: '建置智慧爬蟲系統，自動抓取競品數據與媒體聲量，提升策略反應速度',
        icon: '🕷️',
      },
      {
        type: 'ai',
        title: 'Google Antigravity 進化',
        description: '持續優化 Agent Skills 與爬蟲核心邏輯，實現「算力即權力」的技術落實',
        icon: '🛸',
      },
    ],
  },
]

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
      {/* Hero 區塊 - 置中設計 */}
      <section className="profile-hero">
        <div className="profile-hero-content">
          {/* 頭像 */}
          <div className="profile-avatar">
            <div className="profile-avatar-inner">
              <img src="/avatar.jpg" alt="Aster" className="profile-avatar-img" />
            </div>
          </div>

          {/* 名字 */}
          <h1 className="profile-name">Aster</h1>
          <p className="profile-role">Frontend Developer</p>

          {/* 座右銘 */}
          <blockquote className="profile-quote">
            <span className="quote-mark">&quot;</span>
            <p>數據驅動增長，AI 拆解大局，</p>
            <p>以底層邏輯為骨架，讓想像在算力中落地為現實。</p>
          </blockquote>

          {/* 快速連結 */}
          <div className="profile-links">
            <Link href="/projects" className="btn btn-primary">
              作品集
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              部落格
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
                認識 Aster (唉斯特)
              </h2>
              <p>
                以前的我，搞數位行銷、玩數據、做成長駭客，但 AI
                這波「超音速海嘯」來了之後，我發現人類史上第一次有機會「開外掛」當超人，這次我決定不想錯過！
              </p>
              <p>
                目前的狀態：<strong>AI 實驗家</strong> / 也是專業的「數位行銷廢材」。
              </p>
              <p>做法直白：無聊的事全丟給 AI，時間拿來體驗生活和創造。</p>
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
                  <strong style={{ color: 'var(--color-primary)' }}>優雅解構</strong>
                  ：利用程式碼將複雜的業務邏輯化為優雅的流程。
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>算力放大</strong>
                  ：利用 AI 作為槓桿，將人類的理解深度與想像力無限放大。
                </li>
                <li style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>系統思考</strong>
                  ：將龐雜的「局」拆解成清晰的架構。
                </li>
              </ul>
              <p style={{ marginTop: 'var(--space-lg)' }}>
                本質來看，我是在做一場認知的「逆向工程」，在這個執行力逐漸貶值的時代，我想用系統化的視角看透本質，並用
                AI 加速實現那個被我們定義好的未來。
              </p>
              <p
                style={{
                  marginTop: 'var(--space-md)',
                  fontStyle: 'italic',
                  color: 'var(--color-primary)',
                }}
              >
                這裡就是我的 #AI廢人養成計劃 實踐紀錄 —— 看我怎麼用 n8n、Gemini 跟 Vibe
                Coding，一步步把自己「自動化」。
              </p>
              <div className="about-tags">
                <span className="tag">Growth Hacking</span>
                <span className="tag">數據分析</span>
                <span className="tag">AI/LLM</span>
                <span className="tag">Prompt Engineering</span>
                <span className="tag">系統思考</span>
              </div>
            </div>
            <div className="about-illustration">
              <div className="about-decoration">
                <div className="deco-circle deco-1"></div>
                <div className="deco-circle deco-2"></div>
                <div className="deco-icon">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 時間軸 */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title-center">
            <span className="section-title-icon">🧬</span>
            Aster 的進化日誌
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2xl)',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            從數據解碼到 AI 建築師
          </p>
          <div className="timeline">
            {timelineData.map((yearGroup, yearIndex) => (
              <div key={yearIndex} className="timeline-year-group">
                <div className="timeline-year">{yearGroup.year}</div>
                {yearGroup.phase && <div className="timeline-phase">{yearGroup.phase}</div>}
                {yearGroup.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`timeline-item ${itemIndex % 2 === 0 ? 'left' : 'right'}`}
                  >
                    <div className="timeline-card">
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.description}</p>
                      {/* 網站 iframe 區塊（如果有的話） */}
                      {item.websites && (
                        <div className="timeline-websites-section">
                          <div className="timeline-websites-divider"></div>
                          <div className="timeline-websites-grid">
                            {item.websites.map(
                              (
                                site: { name: string; url: string; image?: string },
                                siteIndex: number,
                              ) => (
                                <a
                                  key={siteIndex}
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="timeline-website-item"
                                >
                                  <div className="timeline-website-preview">
                                    {site.image ? (
                                      <img src={site.image} alt={site.name} />
                                    ) : (
                                      <iframe src={site.url} title={site.name} loading="lazy" />
                                    )}
                                  </div>
                                  <span className="timeline-website-name">{site.name}</span>
                                </a>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="timeline-line"></div>
          </div>
        </div>
      </section>

      {/* 最新作品 */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <h2 className="section-title-center">
            <span className="section-title-icon">🚀</span>
            最新作品
          </h2>
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
      <section className="section">
        <div className="container">
          <h2 className="section-title-center">
            <span className="section-title-icon">✍️</span>
            最新文章
          </h2>
          {posts.length > 0 ? (
            <div className="grid" style={{ gap: 'var(--space-md)' }}>
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="post-card">
                    <div className="post-card-content">
                      <h3 className="post-card-title">{post.title}</h3>
                      {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
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
