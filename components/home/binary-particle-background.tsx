"use client"

import { useEffect, useRef } from "react"

type Particle = {
  scatterX: number
  scatterY: number
  targetX: number
  targetY: number
  glyph: "0" | "1"
  phase: number
}

export function BinaryParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    let animationFrame = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let startedAt: number | null = null

    const createTargets = () => {
      const source = document.createElement("canvas")
      source.width = width
      source.height = height
      const sourceContext = source.getContext("2d")
      if (!sourceContext) return []

      const compact = width < 900
      sourceContext.fillStyle = "#000"
      sourceContext.textAlign = "center"
      sourceContext.font = `800 ${compact ? 82 : 112}px ui-monospace, SFMono-Regular, Menlo, monospace`
      const headingScale = Math.min(1, (width * 0.92) / sourceContext.measureText("ELECCIONES CEIS").width)
      sourceContext.save()
      sourceContext.translate(width / 2, 0)
      sourceContext.scale(headingScale, 1)
      sourceContext.fillText("ELECCIONES CEIS", 0, height * 0.18)
      sourceContext.restore()
      sourceContext.font = `900 ${compact ? 110 : 150}px ui-monospace, SFMono-Regular, Menlo, monospace`
      sourceContext.fillText("2027", width / 2, height * 0.81)

      const image = sourceContext.getImageData(0, 0, width, height).data
      const targets: { x: number; y: number }[] = []
      const step = compact ? 4 : 5
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (image[(y * width + x) * 4 + 3] > 80) targets.push({ x, y })
        }
      }
      return targets
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.floor(rect.width))
      const nextHeight = Math.max(1, Math.floor(rect.height))
      if (nextWidth === width && nextHeight === height && particles.length > 0) return

      width = nextWidth
      height = nextHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const targets = createTargets()
      startedAt = null
      particles = targets.map((target, index) => ({
        scatterX: Math.random() * width,
        scatterY: Math.random() * height,
        targetX: target.x,
        targetY: target.y,
        glyph: index % 2 === 0 ? "0" : "1",
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
      context.textAlign = "center"
      context.textBaseline = "middle"
      if (startedAt === null) startedAt = time

      const elapsed = time - startedAt
      const formationDuration = 20000
      const formation = Math.min(elapsed / formationDuration, 1)
      const formedProgress = formation * formation * (3 - 2 * formation)
      const readableHold = 5000
      const transitionDuration = 18000
      const scatteredHold = 4000
      const cycleDuration = readableHold + transitionDuration * 2 + scatteredHold
      const cycleElapsed = formation === 1 ? (elapsed - formationDuration) % cycleDuration : 0
      let scatterRatio = 1 - formedProgress

      if (formation === 1 && cycleElapsed > readableHold && cycleElapsed <= readableHold + transitionDuration) {
        const progress = (cycleElapsed - readableHold) / transitionDuration
        scatterRatio = progress * progress * (3 - 2 * progress)
      } else if (formation === 1 && cycleElapsed > readableHold + transitionDuration + scatteredHold) {
        const progress = (cycleElapsed - readableHold - transitionDuration - scatteredHold) / transitionDuration
        const easedProgress = progress * progress * (3 - 2 * progress)
        scatterRatio = 1 - easedProgress
      } else if (formation === 1 && cycleElapsed > readableHold + transitionDuration) {
        scatterRatio = 1
      } else if (formation === 1) {
        scatterRatio = 0
      }

      for (const particle of particles) {
        const x = particle.targetX * (1 - scatterRatio) + particle.scatterX * scatterRatio
        const y = particle.targetY * (1 - scatterRatio) + particle.scatterY * scatterRatio
        const formedOpacity = 1 - scatterRatio
        const pulse = 0.12 + formedOpacity * 0.4 + (Math.sin(time / 2600 + particle.phase) + 1) * 0.025
        context.fillStyle = particle.glyph === "0" ? `rgba(16, 31, 54, ${pulse})` : `rgba(198, 162, 75, ${pulse})`
        context.fillText(particle.glyph, x, y)
      }
      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    animationFrame = requestAnimationFrame(draw)
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
}
