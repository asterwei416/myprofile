'use client'

import { useEffect, useRef } from 'react'

interface StarParticle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  hue: number
}

export default function MouseEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<StarParticle[]>([])
  const animationRef = useRef<number | undefined>(undefined)
  const lastMouseMoveRef = useRef(0)
  const lastFrameTimeRef = useRef(0)

  // Throttle 間隔：16ms（約 60fps 輸入）
  const MOUSE_THROTTLE = 16
  // 目標幀率：30fps
  const TARGET_FRAME_TIME = 33
  // 最大粒子數量
  const MAX_PARTICLES = 80

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // 設置 canvas 大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 滑鼠移動時產生粒子（帶 throttle）
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseMoveRef.current < MOUSE_THROTTLE) return
      lastMouseMoveRef.current = now

      // 只產生 2 個粒子（原本 4 個）
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.6 + 0.2

        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue: 40 + Math.random() * 20,
        })
      }

      // 嚴格限制粒子數量
      if (particlesRef.current.length > MAX_PARTICLES) {
        particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 動畫循環（帶幀率限制）
    const animate = (timestamp: number) => {
      // 幀率限制
      const deltaTime = timestamp - lastFrameTimeRef.current
      if (deltaTime < TARGET_FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // 清除畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 繪製粒子（簡化版，無 gradient）
      particlesRef.current.forEach((p) => {
        // 移動
        p.x += p.vx
        p.y += p.vy

        // 淡出
        p.opacity -= 0.015
        p.size *= 0.99

        if (p.opacity > 0.05) {
          // 外層光暈（簡單圓形，非 gradient）
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity * 0.2})`
          ctx.fill()

          // 核心亮點
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${p.opacity})`
          ctx.fill()
        }
      })

      // 移除消失的粒子
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.05)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
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
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
