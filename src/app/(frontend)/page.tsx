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
          '練出「結構決定功能」的直覺；並在工程腦上裝了商業邏輯，開始懂得用策略、金錢跟資源調度來拆解這個世界。',
        icon: '⚙️🎓',
      },
      {
        type: 'foundation',
        title: '商場運作的資源調度',
        description: '搞定千萬級預算跟招商——現實版的資源配置最佳化，在一團亂中理出順暢的流程。',
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
        description: '拆解 30+ 上市櫃公司的財報與組織架構，從數字的破綻看穿企業底層運作邏輯。',
        icon: '🔍',
        websites: [{ name: '中華公司治理協會', url: 'https://www.cga.org.tw/' }],
      },
    ],
  },
  {
    year: '2013 - 2016',
    phase: '第二階段：創業逼出的全棧肉搏與打怪升級',
    items: [
      {
        type: 'growth',
        title: '創業所學到的地獄模式',
        description: [
          'SEO、廣告、自媒體、CRM 通通自己來；從網站架構、CIS 到品牌策略親手佈局；制定產品規格與時程控管，用系統思考確保開發不偏離目標——「規格沒定義好，再強技術也是空轉」',
          '我用「設計服務」當主軸，開始幫客戶搞行銷溝通跟設計管理。從網站架構、CIS 視覺到社群跟廣告投放，我搞懂了怎麼從零開始打造品牌形象跟策略，這不只是做美美的圖，而是要精準抓住市場的眼球。',
        ],
        icon: '⚔️',
        images: [
          '/startup/oxytive.jpg',
          '/startup/unionrusty-box.jpg',
          '/startup/tshirts.jpg',
          '/startup/jocelin.jpg',
          '/startup/unionrusty-web.jpg',
          '/startup/unionrusty-artist.jpg',
          '/startup/manufacturer.jpg',
          '/startup/camel-photo.jpg',
          '/startup/car-web.jpg',
          '/startup/fitness-web.jpg',
          '/startup/car-web2.jpg',
          '/startup/water-machine.jpg',
          '/startup/tea-brand.jpg',
        ],
      },
    ],
  },
  {
    year: '2016 - 2020',
    phase: '第三階段：數位媒體的實戰試煉',
    items: [
      {
        type: 'growth',
        title: '流量與權重的互尬攻防',
        description: [
          '在傳統媒體轉型的關鍵期，我負責官網的深度改版——這不是換介面而已，而是一場對搜尋引擎與用戶行為的「逆向工程」。',
          '透過 SEO 底層架構最佳化與內容行銷策略，成功讓流量翻倍成長，我學會了在海量資訊中，精準抓到演算法的「脾氣」。',
        ],
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
          '在壹傳媒集團當 GA360 與 Data Warehouse 的 PM，把亂七八糟的數據整理成能用的數位情報系統。從跨部門協作到資料視覺化，我建立了從「行為洞察」到「產品策略」的閉環。',
        icon: '🏗️',
        websites: [
          {
            name: '壹蘋新聞網',
            url: 'https://news.nextapple.com/',
            image: '/screenshots/nextapple.png',
          },
        ],
      },
    ],
  },
  {
    year: '2020 - 2025',
    phase: '第四階段：策略架構與營運定義者 — 從增長到全局佈局',
    items: [
      {
        type: 'work',
        title: '產品領導力的培養',
        description: [
          '負責確立團隊 North Star Metric 與 OKR 目標管理，我開始從 C-level 的視野看「局」，優化行銷預算配置與產品開發時程。',
          '主導了雙邊市場的資料探勘架構，重點不在於蒐集數據，而在於如何定義產品規格，讓數據自動轉化為可獲利的商業模式。',
        ],
        icon: '👥',
        websites: [
          { name: '樂屋網', url: 'https://www.rakuya.com.tw/', image: '/screenshots/rakuya.png' },
        ],
      },
      {
        type: 'work',
        title: '會員經濟的數位煉金術',
        description: [
          '主導導入 Amplitude 行為分析平台，用 Martech 工具打造會員自動上線與再行銷流程，靠 RFM 模型與 A/B 測試，把用戶行為轉化為可預測的成長公式。',
          '擔任跨部門的數據橋樑——不只是做執行，而是拿數據當武器，幫各部門把 KPI 對齊，讓數位轉型不只是口號，而是真的做出成績。',
        ],
        icon: '📊',
        websites: [
          {
            name: '角角者',
            url: 'https://www.kadokado.com.tw/',
            image: '/screenshots/kadokado.png',
          },
        ],
      },
    ],
  },
  {
    year: '2025 - Now',
    phase: '第五階段：AI 時代的實踐與學習者',
    items: [
      {
        type: 'ai',
        title: '想像力的即時落地',
        description: [
          'Vibe Coding 的直覺實踐：不再死磕碎片的語法，而是專注於「意圖定義」與「架構設計」，只要邏輯架構正確，剩下的髒活就交給 AI 即時顯化，這是一種「想像力即戰鬥力」的體現，讓開發回歸到解決問題的本質，而不是在代碼海裡肉搏。',
          'Agent Workflow 的靈魂封裝：將多年來的龜毛要求寫成 Agent 的 SOP，我建立了一套 24 小時不休息的自動化工作流，現在，我不必親自上陣，AI 代理人就是具備我專業靈魂的執行終端。',
          'AIGC 的全速顯化：將 AI 視為認知的「擴大機」，在我的世界裡，沒有「沒時間做」這件事，只有「沒定義清楚」的問題，透過 AIGC 讓創意與邏輯快速落地，我只負責在最後一關進行價值審核。',
        ],
        icon: '🚀',
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
          <p className="profile-role">AI 實驗家</p>

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
                認識 Aster (欸斯特)
              </h2>
              <p>
                以前的我，搞數位行銷、玩數據、做成長駭客，但 AI
                這波「超音速海嘯」來了之後，我發現人類史上第一次有機會「開外掛」當超人，這次決心不想錯過！
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
                本質來看，我就是在做一場認知的「逆向工程」，在這個執行力逐漸貶值的時代，用系統化的視角看透本質，並用
                AI 加速實現那個被我們定義好的未來。
              </p>
              <p
                style={{
                  marginTop: 'var(--space-md)',
                  fontStyle: 'italic',
                  color: 'var(--color-primary)',
                }}
              >
                這裡就是我的 #AI廢人養成計劃 —— 看我怎麼用 n8n、Gemini、GPT 跟 Vibe
                Coding等工具，一步步把自己「自動化」。
              </p>
              <div className="about-tags">
                <span className="tag">Growth Hacking</span>
                <span className="tag">數據分析</span>
                <span className="tag">AI/LLM</span>
                <span className="tag">Prompt Engineering</span>
                <span className="tag">系統思考</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 時間軸 */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title-center">
            <img src="/evolution-icon.jpg" alt="" className="section-title-icon-img" />
            我的進化日誌
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
            {(() => {
              let globalIndex = 0
              return timelineData.map((yearGroup, yearIndex) => (
                <div key={yearIndex} className="timeline-year-group">
                  <div className="timeline-year">{yearGroup.year}</div>
                  {yearGroup.phase && <div className="timeline-phase">{yearGroup.phase}</div>}
                  {yearGroup.items.map((item, itemIndex) => {
                    const currentIndex = globalIndex++
                    return (
                      <div
                        key={itemIndex}
                        className={`timeline-item ${currentIndex % 2 === 0 ? 'left' : 'right'}`}
                      >
                        <div className="timeline-card">
                          <h3 className="timeline-title">{item.title}</h3>
                          {Array.isArray(item.description) ? (
                            <ul className="timeline-desc-list">
                              {item.description.map((desc: string, descIndex: number) => (
                                <li key={descIndex}>{desc}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="timeline-desc">{item.description}</p>
                          )}
                          {/* 作品圖片區塊（如果有的話） */}
                          {item.images && (
                            <div className="timeline-images-section">
                              <div className="timeline-websites-divider"></div>
                              <div className="timeline-images-grid">
                                {item.images.map((img: string, imgIndex: number) => (
                                  <div key={imgIndex} className="timeline-image-item">
                                    <img src={img} alt="" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                    )
                  })}
                </div>
              ))
            })()}
            <div className="timeline-line"></div>
          </div>
        </div>
      </section>

      {/* 最新作品 */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <h2 className="section-title-center">
            <img src="/projects-icon.jpg" alt="" className="section-title-icon-img" />
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
            <img src="/blog-icon.jpg" alt="" className="section-title-icon-img" />
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
