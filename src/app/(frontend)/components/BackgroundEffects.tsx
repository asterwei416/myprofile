'use client'

import { useEffect, useRef } from 'react'

interface GlowOrb {
  x: number
  y: number
  size: number
  hue: number
  speedX: number
  speedY: number
  opacity: number
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<GlowOrb[]>([])
  const animationRef = useRef<number | undefined>(undefined)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 設置 canvas 大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initOrbs()
    }

    // 初始化光暈球
    const initOrbs = () => {
      orbsRef.current = []
      const orbCount = 4

      for (let i = 0; i < orbCount; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 300 + 200,
          hue: i % 2 === 0 ? 185 : 270,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.08 + 0.04,
        })
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 動畫循環
    const animate = () => {
      timeRef.current += 0.005

      // 深色背景
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 繪製流動波紋層（底層）
      drawFluidWaves(ctx, canvas.width, canvas.height, timeRef.current)

      // 繪製漸層光暈（上層）
      orbsRef.current.forEach((orb) => {
        orb.x += orb.speedX
        orb.y += orb.speedY

        if (orb.x < -orb.size || orb.x > canvas.width + orb.size) {
          orb.speedX *= -1
        }
        if (orb.y < -orb.size || orb.y > canvas.height + orb.size) {
          orb.speedY *= -1
        }

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size)
        gradient.addColorStop(0, `hsla(${orb.hue}, 100%, 50%, ${orb.opacity})`)
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 100%, 40%, ${orb.opacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 100%, 30%, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // 繪製流動波紋
    const drawFluidWaves = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number,
    ) => {
      const waveCount = 3
      const baseOpacity = 0.03

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath()

        const waveOffset = w * 0.5
        const waveHeight = 80 + w * 30
        const waveY = height * (0.3 + w * 0.2)

        ctx.moveTo(0, waveY)

        for (let x = 0; x <= width; x += 10) {
          const y =
            waveY +
            Math.sin(x * 0.005 + time + waveOffset) * waveHeight * 0.5 +
            Math.sin(x * 0.01 + time * 1.5 + waveOffset) * waveHeight * 0.3 +
            Math.sin(x * 0.002 + time * 0.5) * waveHeight * 0.2
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        // 波紋漸層
        const gradient = ctx.createLinearGradient(0, waveY - waveHeight, 0, height)
        const hue = w === 0 ? 185 : w === 1 ? 200 : 270
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${baseOpacity * (1 - w * 0.2)})`)
        gradient.addColorStop(0.5, `hsla(${hue}, 100%, 40%, ${baseOpacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${hue}, 100%, 30%, 0)`)

        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
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
        zIndex: -1,
      }}
    />
  )
}
