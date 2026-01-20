'use client'

import { useEffect, useRef } from 'react'

interface AuroraOrb {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  // 預計算的顏色值，避免每幀創建
  r: number
  g: number
  b: number
  a: number
}

interface RainDrop {
  x: number
  y: number
  speed: number
  char: string
  opacity: number
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const orbsRef = useRef<AuroraOrb[]>([])
  const rainDropsRef = useRef<RainDrop[]>([])
  const lastFrameTimeRef = useRef(0)
  const frameCountRef = useRef(0)

  // 目標幀率：30fps（每 33ms 一幀）
  const TARGET_FRAME_TIME = 33

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // 初始化極光光球（預計算顏色）
    const initOrbs = () => {
      orbsRef.current = []
      // RGB 預計算值
      const colors = [
        { r: 40, g: 80, b: 160, a: 0.15 }, // Blue
        { r: 80, g: 40, b: 140, a: 0.12 }, // Purple
        { r: 30, g: 100, b: 120, a: 0.1 }, // Teal
      ]

      for (let i = 0; i < 3; i++) {
        const c = colors[i]
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.min(canvas.width, canvas.height) * 0.5 + 150,
          r: c.r,
          g: c.g,
          b: c.b,
          a: c.a,
        })
      }
    }

    // 初始化數位雨（減少數量）
    const initRain = () => {
      rainDropsRef.current = []
      const columns = Math.floor(canvas.width / 30) // 增加間距

      for (let i = 0; i < columns; i++) {
        // 只有 20% 的列會有雨滴
        if (Math.random() > 0.8) {
          rainDropsRef.current.push({
            x: i * 30,
            y: Math.random() * canvas.height * 2 - canvas.height,
            speed: Math.random() * 1 + 0.3,
            char: Math.random() > 0.5 ? '1' : '0',
            opacity: Math.random() * 0.1 + 0.03,
          })
        }
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initOrbs()
      initRain()
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 繪製光球（使用簡單的圓形填充，避免每幀創建 gradient）
    const drawOrb = (orb: AuroraOrb) => {
      // 使用多層半透明圓形模擬漸層效果（效能更好）
      const layers = 3
      for (let i = layers; i >= 0; i--) {
        const ratio = i / layers
        const radius = orb.size * ratio
        const alpha = orb.a * (1 - ratio) * 0.5

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${orb.r}, ${orb.g}, ${orb.b}, ${alpha})`
        ctx.fill()
      }
    }

    // 動畫循環（帶幀率限制）
    const animate = (timestamp: number) => {
      // 幀率限制
      const deltaTime = timestamp - lastFrameTimeRef.current
      if (deltaTime < TARGET_FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp
      frameCountRef.current++

      // 深色背景
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // A. 繪製極光光球
      orbsRef.current.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        // 邊界反彈
        if (orb.x < -orb.size / 2 || orb.x > canvas.width + orb.size / 2) orb.vx *= -1
        if (orb.y < -orb.size / 2 || orb.y > canvas.height + orb.size / 2) orb.vy *= -1

        drawOrb(orb)
      })

      // B. 繪製數位雨（簡化版）
      ctx.font = '12px monospace'
      rainDropsRef.current.forEach((drop) => {
        drop.y += drop.speed

        // 超出底部重置
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.opacity = Math.random() > 0.5 ? Math.random() * 0.08 + 0.02 : 0
        }

        if (drop.opacity > 0) {
          ctx.fillStyle = `rgba(180, 200, 240, ${drop.opacity})`
          ctx.fillText(drop.char, drop.x, drop.y)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
