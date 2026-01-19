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
  chars: string
  fontSize: number
  opacity: number
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const orbsRef = useRef<AuroraOrb[]>([])
  const rainDropsRef = useRef<RainDrop[]>([])
  const noisePatternRef = useRef<CanvasPattern | null>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. 生成噪點紋理 (只生成一次，提升效能)
    const createNoisePattern = () => {
      const noiseCanvas = document.createElement('canvas')
      noiseCanvas.width = 200
      noiseCanvas.height = 200
      const nCtx = noiseCanvas.getContext('2d')
      if (!nCtx) return

      const imageData = nCtx.createImageData(200, 200)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        // 隨機灰度，但非常透明
        const val = Math.random() * 255
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
        data[i + 3] = 12 // 透明度極低 (0-255)
      }
      nCtx.putImageData(imageData, 0, 0)
      noisePatternRef.current = ctx.createPattern(noiseCanvas, 'repeat')
    }

    createNoisePattern()

    // 2. 初始化極光光球
    const initOrbs = () => {
      orbsRef.current = []
      // 顏色：深藍、深紫、極淡的青色 - 較亮版本以確保可見
      const colors = [
        'hsla(220, 80%, 40%, 0.25)', // Brighter Blue
        'hsla(260, 70%, 40%, 0.2)', // Brighter Purple
        'hsla(190, 80%, 30%, 0.15)', // Brighter Teal
      ]

      // 只有 3 個巨大的光球，製造極簡氛圍
      for (let i = 0; i < 3; i++) {
        orbsRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.15, // 極慢速 (Float)
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.min(window.innerWidth, window.innerHeight) * 0.6 + 200, // 非常巨大
          color: colors[i],
        })
      }
    }

    // 3. 初始化數位雨 (稀疏版)
    const initRain = () => {
      rainDropsRef.current = []
      const columns = Math.floor(window.innerWidth / 20) // 每 20px 一行

      for (let i = 0; i < columns; i++) {
        // 只有 30% 的列會有雨滴，製造稀疏感
        if (Math.random() > 0.7) {
          rainDropsRef.current.push({
            x: i * 20,
            y: Math.random() * window.innerHeight * 2 - window.innerHeight, // 分散在垂直空間
            speed: Math.random() * 1.5 + 0.5,
            chars: Math.random() > 0.5 ? '1' : '0',
            fontSize: Math.random() * 4 + 10, // 10-14px
            opacity: Math.random() * 0.15 + 0.05, // 極淡
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

    // 動畫循環
    const animate = () => {
      frameRef.current++

      // 深色背景
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // A. 繪製極光光球 (最底層)
      orbsRef.current.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        // 邊界反彈
        if (orb.x < -orb.size / 2 || orb.x > canvas.width + orb.size / 2) orb.vx *= -1
        if (orb.y < -orb.size / 2 || orb.y > canvas.height + orb.size / 2) orb.vy *= -1

        // 徑向漸層 - 創造柔和邊緣
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size)
        g.addColorStop(0, orb.color)
        g.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // B. 繪製數位雨 (中間層) - 極簡風格
      ctx.font = '12px monospace'
      rainDropsRef.current.forEach((drop) => {
        drop.y += drop.speed

        // 隨機變換字符 (每 10 幀)
        if (frameRef.current % 15 === 0 && Math.random() > 0.9) {
          drop.chars = Math.random() > 0.5 ? '1' : '0'
        }

        // 超出底部重置
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.speed = Math.random() * 1.5 + 0.5
          // 隨機決定是否保留此列 (閃爍效果)
          drop.opacity = Math.random() > 0.4 ? Math.random() * 0.12 + 0.03 : 0
        }

        if (drop.opacity > 0) {
          // 淡藍白色文字，非常低調
          ctx.fillStyle = `rgba(200, 220, 255, ${drop.opacity})`
          ctx.fillText(drop.chars, drop.x, drop.y)
        }
      })

      // C. 疊加噪點 (最上層)
      if (noisePatternRef.current) {
        ctx.fillStyle = noisePatternRef.current
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

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
