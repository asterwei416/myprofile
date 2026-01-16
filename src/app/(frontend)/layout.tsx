import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  title: 'Wei Aster · Frontend Dev | AI 作品集與技術文章',
  description: '一位專注於前端開發與 AI 應用的數位工匠。探索我的 AI 作品集、技術文章，以及開發思維與架構拆解。',
  keywords: ['前端開發', 'AI', '作品集', 'Next.js', 'React', 'TypeScript'],
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant">
      <body>
        {/* 導覽列 */}
        <nav className="nav">
          <div className="container nav-container">
            <Link href="/" className="nav-brand">
              Wei_Aster.dev
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
            <p className="footer-text">
              © 2026 Wei Aster. Built with Next.js + Payload CMS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
