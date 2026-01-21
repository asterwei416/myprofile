import React from 'react'
import Link from 'next/link'
import './styles.css'
import DynamicEffectsWrapper from './components/DynamicEffectsWrapper'

export const metadata = {
  title: 'Aster (欸斯特) · AI First 實踐玩家 | 數據驅動 × AI 賦能的成長實踐',
  description:
    '從數位行銷到 AI 探索者，用系統思考拆解大局，用算力放大想像。這是我的 #AI廢人養成計劃 實踐紀錄。',
  keywords: [
    'AI First 實踐玩家',
    '數據分析',
    'Growth Hacking',
    'AI 自動化',
    'Vibe Coding',
    '數位行銷',
  ],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        {/* 動態特效 (Client Component) */}
        <DynamicEffectsWrapper />
        {/* 導覽列 */}
        <nav className="nav">
          <div className="container nav-container">
            <Link href="/" className="nav-brand">
              <img src="/logo.jpg" alt="Aster.dev" className="nav-logo" />
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/" className="nav-link">
                  開場白
                </Link>
              </li>
              <li>
                <Link href="/projects" className="nav-link">
                  就瞎做
                </Link>
              </li>
              <li>
                <Link href="/blog" className="nav-link">
                  就亂寫
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
