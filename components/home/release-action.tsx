"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PUBLICACION_LISTA_MS } from "@/data/publicacion-lista"
import styles from "./hero-section.module.css"

function remainingSeconds() {
  return Math.max(0, Math.ceil((PUBLICACION_LISTA_MS - Date.now()) / 1000))
}

function TimeCard({ value, label }: { value: number; label: string }) {
  const [transition, setTransition] = useState({ previous: value, current: value })
  if (transition.current !== value) {
    setTransition({ previous: transition.current, current: value })
  }

  const current = String(transition.current).padStart(2, "0")
  const previous = String(transition.previous).padStart(2, "0")
  const isFlipping = transition.previous !== transition.current

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={styles.timeCard} aria-hidden="true">
        <div className={`${styles.flipHalf} ${styles.flipTop}`}><span>{current}</span></div>
        <div className={`${styles.flipHalf} ${styles.flipBottom}`}><span>{isFlipping ? previous : current}</span></div>
        {isFlipping && (
          <>
            <div key={`${label}-${current}-top`} className={`${styles.flipHalf} ${styles.flipTop} ${styles.flipTopAnimate}`}><span>{previous}</span></div>
            <div key={`${label}-${current}-bottom`} className={`${styles.flipHalf} ${styles.flipBottom} ${styles.flipBottomAnimate}`}><span>{current}</span></div>
          </>
        )}
      </div>
      <span className="sr-only">{current} {label}</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#566275] sm:text-xs">{label}</span>
    </div>
  )
}

export function ReleaseAction({ initialRemainingSeconds }: { initialRemainingSeconds: number }) {
  const [remaining, setRemaining] = useState(initialRemainingSeconds)

  useEffect(() => {
    const update = () => setRemaining(remainingSeconds())
    const initialTimer = window.setTimeout(update, 0)
    const interval = window.setInterval(update, 250)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(interval)
    }
  }, [])

  if (remaining === 0) {
    return (
      <div className={`${styles.buttonEnter} mt-9 flex flex-wrap items-center justify-center gap-3`}>
        <Link
          href="/lista-preliminar"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#C6A24B] bg-[#101F36] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#182C4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A24B] sm:text-base"
        >
          Ver lista preliminar
        </Link>
        <Link
          href="/cronograma"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#C6A24B] bg-white/90 px-7 py-3 text-sm font-semibold text-[#101F36] shadow-sm transition-colors hover:bg-[#FAEEC6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A24B] sm:text-base"
        >
          Ver cronograma (28 oct.)
        </Link>
      </div>
    )
  }

  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  return (
    <div className={`${styles.timerEnter} mt-9`} role="timer" aria-label="Tiempo restante para la publicación de la lista preliminar">
      <div className="flex items-start justify-center gap-3 sm:gap-5">
        <TimeCard value={hours} label="Horas" />
        <TimeCard value={minutes} label="Minutos" />
        <TimeCard value={seconds} label="Segundos" />
      </div>
    </div>
  )
}
