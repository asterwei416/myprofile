import React from 'react'
import './styles.css'
import DynamicEffectsWrapper from './components/DynamicEffectsWrapper'
import Navbar from './components/Navbar'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://aster.dev'),
  title: {
    default: 'Aster | AI First 實踐與思維重構',
    template: '%s | Aster',
  },
  description:
    '從數位行銷到 AI 探索者，用系統思考拆解大局，用算力放大想像，這是我的 #AI廢人養成計劃 實踐紀錄。',
  keywords: [
    'AI First 實踐玩家',
    '數據分析',
    'Growth Hacking',
    'AI 自動化',
    'Vibe Coding',
    '數位行銷',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Aster Profile',
    images: [
      {
        url: '/avatar-3d.jpg', // Default OG image
        width: 1200,
        height: 630,
        alt: 'Aster Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@asterwei',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        {/* 動態特效 (Client Component) */}
        <DynamicEffectsWrapper />

        {/* 導覽列 (Client Component) */}
        <Navbar />

        {/* 主要內容 */}
        <main>{children}</main>

        {/* 頁尾 */}
        <footer className="footer">
          <div className="container">
            <p className="footer-text">
              Aster &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
