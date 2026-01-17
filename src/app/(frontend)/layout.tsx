import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  title: 'Aster · AI 實驗家 | 數據驅動 × AI 賦能的成長實踐',
  description:
    '從數位行銷到 AI 探索者，用系統思考拆解大局，用算力放大想像。這是我的 #AI廢人養成計劃 實踐紀錄。',
  keywords: ['AI 實驗家', '數據分析', 'Growth Hacking', 'AI 自動化', 'Vibe Coding', '數位行銷'],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        {/* 導覽列 */}
        <nav className="nav">
          <div className="container nav-container">
            <Link href="/" className="nav-brand">
              Aster.dev
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/" className="nav-link">
                  首頁
                </Link>
              </li>
              <li>
                <Link href="/projects" className="nav-link">
                  作品集
                </Link>
              </li>
              <li>
                <Link href="/blog" className="nav-link">
                  部落格
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* 主要內容 */}
        <main>{children}</main>

        {/* 頁尾 */}
        <footer className="footer">
          <div className="container">
            <p className="footer-text">© 2026 Aster. Built with Next.js + Payload CMS.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
