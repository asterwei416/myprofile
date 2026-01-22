'use client'
import React, { useState } from 'react'
// Removed framer-motion dependency to fix build error

interface QAItem {
  id?: string
  question: string
  answer: string
}

interface QAAccordionProps {
  items: QAItem[]
}

export function QAAccordion({ items }: QAAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div
      className="ai-qa-section"
      style={{
        marginTop: 'var(--space-xl)',
        marginBottom: 'var(--space-xl)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'var(--space-md)',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <h3
          style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #FF8FAB 0%, #B_f 100%)', // 稍微給點 AI 色彩，或由 CSS 控制
            WebkitBackgroundClip: 'text',
            // color: 'transparent', // 暫時不用 transparent 以免與 global css 衝突
            color: 'var(--text-primary)',
          }}
        >
          你想知道哪些？AI來解答
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index
          return (
            <div key={item.id || index}>
              {/* Question Chip / Bubble */}
              <button
                onClick={() => toggleIndex(index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '24px',
                  border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: isActive
                    ? 'rgba(var(--color-primary-rgb), 0.1)'
                    : 'var(--bg-surface)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 10px rgba(var(--color-primary-rgb), 0.1)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.question}</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    opacity: 0.6,
                    transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Answer Area */}
              <div
                style={{
                  height: isActive ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: isActive ? 1 : 0,
                }}
              >
                <div
                  style={{
                    padding: '12px 20px',
                    margin: '8px 4px 0 4px',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    fontSize: '0.95rem',
                    borderLeft: '2px solid var(--color-primary)',
                  }}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
