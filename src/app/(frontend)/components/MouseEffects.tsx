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

  // Throttle 間隔
  const MOUSE_THROTTLE = 20
  // 目標幀率：30fps
  const TARGET_FRAME_TIME = 33
  // 最大粒子數量
  const MAX_PARTICLES = 100

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 滑鼠移動時產生粒子
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseMoveRef.current < MOUSE_THROTTLE) return
      lastMouseMoveRef.current = now

      for (let i = 0; i < 3; i++) {
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

      if (particlesRef.current.length > MAX_PARTICLES) {
        particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 動畫循環
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameTimeRef.current
      if (deltaTime < TARGET_FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.opacity -= 0.012
        p.size *= 0.995

        if (p.opacity > 0.05) {
          // 外層光暈（使用 RadialGradient 恢復質感）
          const glowSize = p.size * 5
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
          glow.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.opacity * 0.4})`)
          glow.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.15})`)
          glow.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`)

          ctx.beginPath()
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // 核心亮點
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${p.opacity})`
          ctx.fill()
        }
      })

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
