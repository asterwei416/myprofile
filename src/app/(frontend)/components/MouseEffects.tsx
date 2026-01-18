'use client'

import { useEffect, useRef } from 'react'

interface StarParticle {
  x: number
  y: number
  originX: number
  originY: number
  size: number
  opacity: number
  driftX: number
  driftY: number
  hue: number
  delay: number
}

export default function MouseEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<StarParticle[]>([])
  const animationRef = useRef<number | undefined>(undefined)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 設置 canvas 大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 滑鼠移動時產生擴散星塵
    const handleMouseMove = (e: MouseEvent) => {
      // 產生多個向外擴散的粒子
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2
        const spread = Math.random() * 15 + 5 // 擴散範圍
        const driftSpeed = Math.random() * 0.8 + 0.2

        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          originX: e.clientX,
          originY: e.clientY,
          size: Math.random() * 2 + 0.8,
          opacity: Math.random() * 0.4 + 0.6,
          driftX: Math.cos(angle) * driftSpeed, // 隨機方向飄散
          driftY: Math.sin(angle) * driftSpeed,
          hue: 40 + Math.random() * 20, // 金色到亮黃色
          delay: Math.random() * 10, // 延遲出現，製造不規則感
        })
      }

      // 限制粒子數量
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-200)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 動畫循環
    const animate = () => {
      frameRef.current++

      // 清除畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // 延遲顯示
        if (particle.delay > 0) {
          particle.delay--
          return
        }

        // 隨機飄散移動
        particle.x += particle.driftX + (Math.random() - 0.5) * 0.3
        particle.y += particle.driftY + (Math.random() - 0.5) * 0.3

        // 緩慢淡出
        particle.opacity -= 0.006
        particle.size *= 0.995

        if (particle.opacity > 0.02) {
          ctx.save()

          // 外層柔和光暈
          const glowSize = particle.size * 6
          const glow = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            glowSize,
          )
          glow.addColorStop(0, `hsla(${particle.hue}, 100%, 75%, ${particle.opacity * 0.4})`)
          glow.addColorStop(0.5, `hsla(${particle.hue}, 100%, 60%, ${particle.opacity * 0.15})`)
          glow.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`)

          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // 中層星點
          ctx.globalAlpha = particle.opacity * 0.8
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 80%, 80%, ${particle.opacity})`
          ctx.fill()

          // 核心亮點
          ctx.globalAlpha = particle.opacity
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 30%, 95%, 1)`
          ctx.fill()

          ctx.restore()
        }
      })

      // 移除消失的粒子
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.02 && p.size > 0.3)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

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
