'use client'

import React, { useState } from 'react'

// 時間軸資料介面定義
interface TimelineWebsite {
  name: string
  url: string
  image?: string
  iframeUrl?: string
}

interface TimelineItem {
  type: string
  title: string
  description: string | string[]
  icon: string
  websites?: TimelineWebsite[]
  images?: string[]
}

interface TimelinePhase {
  year: string
  phase: string
  items: TimelineItem[]
}

// 時間軸資料
const timelineData: TimelinePhase[] = [
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
          'SEO、廣告、自媒體、CRM 通通自己來；從網站架構、CIS 到品牌策略親手佈局；制定產品規格與時程控管，用系統思考確保開發不偏離目標——「規格沒定義好，再強技術也是空轉」。',
          '用「設計服務」當主軸，開始幫客戶搞行銷溝通跟設計管理。從網站架構、CIS 視覺到社群跟廣告投放，我搞懂了怎麼從零開始打造品牌形象跟策略，這不只是做美美的圖，而是要精準抓住市場的眼球。',
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
            image: '/screenshots/nextapple-v2.jpg',
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
          {
            name: '樂屋網',
            url: 'https://www.rakuya.com.tw/',
            image: '/screenshots/rakuya-v2.png',
          },
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
          'Vibe Coding 的直覺實踐：拒絕代碼肉搏，專注意圖定義與架構設計，邏輯對了，剩下的髒活交給 AI。想像力，就是我的戰鬥力。',
          'Agent Workflow 的靈魂封裝：將高標要求轉化為 24/7 自動化工作流，我不用親自上陣，AI 代理人就是我的執行終端。',
          'AIGC 的全速顯化：將 AI 視為認知的「擴大機」，沒有沒時間做的專案，只有沒定義清楚的問題，創意快速落地，我只負責最後的價值審核。',
        ],
        icon: '🚀',
      },
      {
        type: 'media',
        title: '個人 IP 的實戰轉向',
        description: [
          '將個人 FB 轉型為專業模式，專注於輸出那些尚未被定義、看似「亂寫瞎做」但絕對真實的 AI 實驗紀錄。',
          '這不是教學，而是第一手的人機協作現場轉播——拒絕過度包裝，只呈現最原本的碰撞過程。',
        ],
        icon: '📡',
        websites: [
          {
            name: 'Aster Wei',
            url: 'https://www.facebook.com/asterwei',
            iframeUrl:
              'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fasterwei&tabs=timeline&width=280&height=400&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId',
          },
        ],
      },
      {
        type: 'community',
        title: '「AI 思維實驗室」社群啟動',
        description: [
          '成立只講真話的操作筆記社群，目前已匯聚 1000+ 名實踐者。',
          '我們拒絕討論虛無飄渺的未來趨勢，只專注於「現在能怎麼用」的落地應用，構建一個抗焦慮的實戰同溫層。',
        ],
        icon: '🧪',
        websites: [
          {
            name: 'AI 思維實驗室',
            url: 'https://www.facebook.com/groups/aithinkinglab',
            image: '/screenshots/ai-thinking-lab-preview.jpg',
          },
        ],
      },
    ],
  },
]

export const TimelineSection = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 反轉數據以顯示最新項目（降冪排序），並且反轉每個階段內的項目順序
  const reversedData = [...timelineData]
    .reverse()
    .map((phase) => ({ ...phase, items: [...phase.items].reverse() }))

  // 決定顯示的資料：展開時顯示全部，否則只顯示前 2 筆
  const visibleData = isExpanded ? reversedData : reversedData.slice(0, 2)

  let globalIndex = 0

  return (
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
          從數據解碼到 AI First 實踐玩家
        </p>
        <div className="timeline">
          {visibleData.map((yearGroup, yearIndex) => (
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
                      {/* 作品圖片區塊 */}
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
                      {/* 網站 iframe 區塊 */}
                      {item.websites && (
                        <div className="timeline-websites-section">
                          <div className="timeline-websites-divider"></div>
                          <div className="timeline-websites-grid">
                            {item.websites.map(
                              (
                                site: {
                                  name: string
                                  url: string
                                  image?: string
                                  iframeUrl?: string
                                },
                                siteIndex: number,
                              ) =>
                                site.iframeUrl ? (
                                  <div
                                    key={siteIndex}
                                    className="timeline-website-item"
                                    style={{ textDecoration: 'none' }}
                                  >
                                    <iframe
                                      src={site.iframeUrl}
                                      width="100%"
                                      height="280"
                                      style={{
                                        border: 'none',
                                        overflow: 'hidden',
                                        display: 'block',
                                      }}
                                      scrolling="no"
                                      frameBorder="0"
                                      // @ts-expect-error React warning vs TS types conflict
                                      allowtransparency="true"
                                      allow="encrypted-media"
                                    ></iframe>
                                    <a
                                      href={site.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="timeline-website-name"
                                      style={{ display: 'block', width: '100%' }}
                                    >
                                      {site.name} ↗
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    key={siteIndex}
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="timeline-website-item"
                                  >
                                    <div className="timeline-website-preview">
                                      {site.image ? (
                                        <img
                                          src={site.image}
                                          alt={site.name}
                                          style={{ objectPosition: 'top' }}
                                        />
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
          ))}

          <div className="timeline-line"></div>
        </div>

        {/* 展開/收合按鈕 */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary"
            style={{ cursor: 'pointer' }}
          >
            {isExpanded ? '收起歷史' : '查看完整進化史'}
          </button>
        </div>
      </div>
    </section>
  )
}
