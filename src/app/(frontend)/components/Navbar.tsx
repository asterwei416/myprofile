'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 點擊連結後自動關閉選單
  const closeMenu = () => setIsMenuOpen(false)

  // 控制身體捲動，選單打開時禁止捲動
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link href="/" className="nav-brand" onClick={closeMenu}>
          <img src="/logo.jpg" alt="Aster.dev" className="nav-logo" />
        </Link>

        {/* 手機版漢堡選單按鈕 */}
        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="切換選單"
        >
          {isMenuOpen ? (
            <span style={{ fontSize: '1.5rem' }}>✕</span>
          ) : (
            <span style={{ fontSize: '1.5rem' }}>☰</span>
          )}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link href="/" className="nav-link" onClick={closeMenu}>
              開場白
            </Link>
          </li>
          <li>
            <Link href="/projects" className="nav-link" onClick={closeMenu}>
              就瞎做
            </Link>
          </li>
          <li>
            <Link href="/blog" className="nav-link" onClick={closeMenu}>
              就亂寫
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
