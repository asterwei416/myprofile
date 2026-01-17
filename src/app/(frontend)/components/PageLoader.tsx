'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PageLoader() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 重置進度
    setProgress(10) // 起始給 10%

    // 模擬進度加載
    const timer = setInterval(() => {
      setProgress((prev) => {
        // 快到 100% 時變慢，等待實際頁面載入完成
        if (prev >= 95) {
          return prev + (99 - prev) * 0.2
        }
        // 加快跳動速度：每次增加 2-15%
        return Math.min(prev + Math.random() * 15 + 2, 99)
      })
    }, 50) // 縮短間隔到 50ms

    return () => clearInterval(timer)
  }, [pathname, searchParams])

  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="page-loader-progress">{Math.floor(progress)}%</div>
        <div className="page-loader-text">LOADING SYSTEM...</div>
      </div>
    </div>
  )
}
