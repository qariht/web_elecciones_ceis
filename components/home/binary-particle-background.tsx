"use client"

import { useEffect, useRef } from "react"

type Particle = {
  scatterX: number
  scatterY: number
  targetX: number
  targetY: number
  bit: number
  phase: number
}

const MONOSPACE = "ui-monospace, SFMono-Regular, Menlo, monospace"
const GATHER_DURATION = 24000
const READABLE_HOLD = 16000
const DISPERSE_DURATION = 24000
const SCATTERED_HOLD = 5000
const CYCLE_DURATION = GATHER_DURATION + READABLE_HOLD + DISPERSE_DURATION + SCATTERED_HOLD
const smoothstep = (value: number) => value * value * (3 - 2 * value)

export function BinaryParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    const hero = canvas?.closest("section")
    const headingSlot = hero?.querySelector<HTMLElement>('[data-binary-slot="heading"]')
    const yearSlot = hero?.querySelector<HTMLElement>('[data-binary-slot="year"]')
    const content = hero?.querySelector<HTMLElement>("[data-binary-content]")
    if (!canvas || !context || !hero || !headingSlot || !yearSlot || !content) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let animationFrame = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let glyphSize = 8
    let startedAt: number | null = null
    let lastFrame = -Infinity
    let layoutKey = ""
    let exclusion = { x: 0, y: 0, width: 0, height: 0 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const heading = headingSlot.getBoundingClientRect()
      const year = yearSlot.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const nextKey = [rect.width, rect.height, heading.width, heading.height, heading.top - rect.top,
        year.top - rect.top, year.height, contentRect.top - rect.top, contentRect.width, contentRect.height].join(",")
      if (nextKey === layoutKey) return
      layoutKey = nextKey

      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const compact = width < 640
      const step = compact ? 4 : width < 1024 ? 5 : 6
      // Keep individual digits separated instead of overlapping into a solid fill.
      glyphSize = compact ? 5 : width < 1024 ? 6 : 7
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      exclusion = {
        x: contentRect.left - rect.left - 16,
        y: contentRect.top - rect.top - 16,
        width: contentRect.width + 32,
        height: contentRect.height + 32,
      }

      const source = document.createElement("canvas")
      source.width = width
      source.height = height
      const sourceContext = source.getContext("2d")
      if (!sourceContext) return
      sourceContext.fillStyle = "#000"
      sourceContext.textAlign = "center"
      sourceContext.textBaseline = "middle"

      const paintLines = (slot: DOMRect, lines: string[], maxFontSize: number) => {
        const lineHeight = slot.height / lines.length
        const availableWidth = Math.max(1, slot.width - 24)
        let fontSize = Math.min(maxFontSize, lineHeight * 0.9)
        sourceContext.font = `900 ${fontSize}px Arial, sans-serif`
        const textWidth = Math.max(...lines.map(line => sourceContext.measureText(line).width))
        fontSize *= Math.min(1, availableWidth / textWidth)
        sourceContext.font = `900 ${fontSize}px Arial, sans-serif`
        lines.forEach((line, index) => {
          sourceContext.fillText(line, slot.left - rect.left + slot.width / 2,
            slot.top - rect.top + lineHeight * (index + 0.5))
        })
      }

      // Measure reserved rows rather than guessing positions from canvas height.
      paintLines(heading, compact ? ["ELECCIONES", "CEIS"] : ["ELECCIONES CEIS"], compact ? 60 : 124)
      paintLines(year, ["2027"], compact ? 104 : 152)

      const pixels = sourceContext.getImageData(0, 0, width, height).data
      const nextParticles: Particle[] = []
      for (let y = step; y < height - step; y += step) {
        for (let x = step; x < width - step; x += step) {
          if (pixels[(y * width + x) * 4 + 3] < 128) continue
          nextParticles.push({
            scatterX: glyphSize + Math.random() * (width - glyphSize * 2),
            scatterY: glyphSize + Math.random() * (height - glyphSize * 2),
            targetX: x,
            targetY: y,
            bit: nextParticles.length % 2,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
      // Preserve the cycle on resize and when fonts finish loading.
      particles = nextParticles
    }

    const draw = (time: number) => {
      animationFrame = requestAnimationFrame(draw)
      if (document.hidden || time - lastFrame < 1000 / 30) return
      lastFrame = time
      if (startedAt === null) startedAt = time
      const elapsed = time - startedAt
      const cycle = elapsed % CYCLE_DURATION
      let scatterRatio: number
      if (motionPreference.matches) {
        scatterRatio = 0
      } else if (cycle < GATHER_DURATION) {
        scatterRatio = 1 - smoothstep(cycle / GATHER_DURATION)
      } else if (cycle < GATHER_DURATION + READABLE_HOLD) {
        scatterRatio = 0
      } else if (cycle < GATHER_DURATION + READABLE_HOLD + DISPERSE_DURATION) {
        scatterRatio = smoothstep((cycle - GATHER_DURATION - READABLE_HOLD) / DISPERSE_DURATION)
      } else {
        scatterRatio = 1
      }

      context.clearRect(0, 0, width, height)
      context.save()
      // Keep drifting digits clear of the title, logo and actions too.
      context.beginPath()
      context.rect(0, 0, width, height)
      context.rect(exclusion.x, exclusion.y, exclusion.width, exclusion.height)
      context.clip("evenodd")
      context.font = `500 ${glyphSize}px ${MONOSPACE}`
      context.textAlign = "center"
      context.textBaseline = "middle"
      const dark = document.documentElement.classList.contains("dark")

      for (const particle of particles) {
        const x = particle.targetX + (particle.scatterX - particle.targetX) * scatterRatio
        const y = particle.targetY + (particle.scatterY - particle.targetY) * scatterRatio
        const drift = motionPreference.matches ? 0 : Math.sin(elapsed / 6000 + particle.phase) * 5 * scatterRatio
        const glyph = particle.bit === 0 ? "0" : "1"
        context.fillStyle = particle.bit === 0
          ? dark ? "#EDF2FA" : "#101F36"
          : dark ? "#DFC478" : "#947024"
        context.globalAlpha = 0.12 + (1 - scatterRatio) * 0.68
        context.fillText(glyph, x, y + drift)
      }
      context.restore()
    }

    resize()
    animationFrame = requestAnimationFrame(draw)
    const observer = new ResizeObserver(resize)
    observer.observe(hero)
    observer.observe(headingSlot)
    observer.observe(yearSlot)
    observer.observe(content)
    document.fonts.addEventListener("loadingdone", resize)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
      document.fonts.removeEventListener("loadingdone", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />
}
