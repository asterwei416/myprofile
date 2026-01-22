'use client'

import { useEffect, useRef } from 'react'

interface AuroraOrb {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
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
  const noisePatternRef = useRef<CanvasPattern | null>(null)
  const lastFrameTimeRef = useRef(0)

  // 目標幀率：30fps（每 33ms 一幀）- 平衡效能與流暢度
  const TARGET_FRAME_TIME = 33

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // 1. 生成噪點紋理（只生成一次，提升效能）
    const createNoisePattern = () => {
      const noiseCanvas = document.createElement('canvas')
      noiseCanvas.width = 200
      noiseCanvas.height = 200
      const nCtx = noiseCanvas.getContext('2d')
      if (!nCtx) return

      const imageData = nCtx.createImageData(200, 200)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
        data[i + 3] = 12 // 透明度極低
      }
      nCtx.putImageData(imageData, 0, 0)
      noisePatternRef.current = ctx.createPattern(noiseCanvas, 'repeat')
    }

    createNoisePattern()

    // 2. 初始化極光光球
    const initOrbs = () => {
      orbsRef.current = []
      const colors = [
        'hsla(220, 80%, 40%, 0.25)', // Blue
        'hsla(260, 70%, 40%, 0.2)', // Purple
        'hsla(190, 80%, 30%, 0.15)', // Teal
      ]

      for (let i = 0; i < 3; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.min(canvas.width, canvas.height) * 0.6 + 200,
          color: colors[i],
        })
      }
    }

    // 3. 初始化數位雨
    const initRain = () => {
      rainDropsRef.current = []
      const columns = Math.floor(canvas.width / 25)

      for (let i = 0; i < columns; i++) {
        // 初始密度調整：63% 的列都會有雨滴 (原本 90% * 0.7)
        if (Math.random() > 0.37) {
          rainDropsRef.current.push({
            x: i * 25,
            y: Math.random() * canvas.height * 2 - canvas.height,
            speed: Math.random() * 1.2 + 0.4,
            char: Math.random() > 0.5 ? '1' : '0',
            opacity: Math.random() * 0.3 + 0.1,
          })
        }
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = window.innerWidth < 768

      if (isReducedMotion) {
        // 如果使用者要求減少動態，則清空所有特效列
        orbsRef.current = []
        rainDropsRef.current = []
        return
      }

      initOrbs()
      // 手機版進一步降低數位雨密度 (原本 63% -> 手機 40% 左右)
      initRain()
      if (isMobile) {
        rainDropsRef.current = rainDropsRef.current.filter(() => Math.random() > 0.4)
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 動畫循環（帶幀率限制）
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameTimeRef.current
      if (deltaTime < TARGET_FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // 深色背景
      ctx.fillStyle = '#050505' // Match --bg-base
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // A. 繪製極光光球（使用 RadialGradient 保持質感）
      orbsRef.current.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        if (orb.x < -orb.size / 2 || orb.x > canvas.width + orb.size / 2) orb.vx *= -1
        if (orb.y < -orb.size / 2 || orb.y > canvas.height + orb.size / 2) orb.vy *= -1

        // 使用 RadialGradient 創造柔和邊緣
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size)
        g.addColorStop(0, orb.color)
        g.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // B. 繪製數位雨
      ctx.font = '12px monospace'
      rainDropsRef.current.forEach((drop) => {
        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = -20
          // 重生機率調整：63% 機率重生為可見 (原本 90% * 0.7)
          // 亮度調整：0.15 ~ 0.55 (原本 0.1 ~ 0.4)
          drop.opacity = Math.random() > 0.37 ? Math.random() * 0.4 + 0.15 : 0
        }

        if (drop.opacity > 0) {
          ctx.fillStyle = `rgba(0, 245, 255, ${drop.opacity})` // Cyber Cyan
          ctx.fillText(drop.char, drop.x, drop.y)
        }
      })

      // C. 疊加噪點紋理（增加質感）
      if (noisePatternRef.current) {
        ctx.fillStyle = noisePatternRef.current
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

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
