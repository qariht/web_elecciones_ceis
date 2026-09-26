"use client"

import { useRef, useEffect, type CSSProperties, type MouseEvent } from "react"
import Link from "next/link"
import { motion, MotionConfig, useMotionValue, useSpring } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import {
  UploadCloud,
  DownloadCloud,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  ChevronRight,
} from "lucide-react"
import { HERO_METRICS } from "@/data/home"
import { BinaryParticleBackground } from "@/components/home/binary-particle-background"
import { cn } from "@/lib/utils"

const BRAND_THEME = {
  "--brand-navy": "#101F36",
  "--brand-gold": "#C6A24B",
  "--brand-gold-soft": "#FAEEC6",
  "--background": "#FFFFFF",
  "--foreground": "#12161D",
  "--secondary": "#F5F7FA",
  "--muted": "#F5F7FA",
  "--muted-foreground": "#566275",
  "--border": "#DCE2EA",
} as CSSProperties

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 28, stiffness: 140, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(rect.width / 2)
      mouseY.set(rect.height / 2.6)
    }
  }, [mouseX, mouseY])

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col justify-between overflow-hidden border-b border-[#DCE2EA] bg-[#F7F8FA]"
        style={BRAND_THEME}
      >
        {/* 1. Grilla arquitectónica */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,#101f360a_1px,transparent_1px),linear-gradient(to_bottom,#101f360a_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,#000_70%,transparent_100%)]"
        />

        {/* 2. Spotlight dorado interactivo que sigue al mouse */}
        <motion.div
          aria-hidden="true"
          style={{
            left: smoothX,
            top: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none absolute z-[2] hidden sm:block size-[500px] lg:size-[680px] rounded-full bg-[radial-gradient(circle,rgba(198,162,75,0.3)_0%,rgba(16,31,54,0.08)_45%,transparent_75%)] blur-[90px]"
        />

        {/* 3. Dígitos que forman y dispersan el nombre del proceso electoral */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
          <BinaryParticleBackground />
        </div>

        {/* 4. CONTENIDO PRINCIPAL CENTRADO */}
        <div className="container mx-auto relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-14 lg:px-8 max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 sm:mb-6"
          >
            <Link
              href="/cronograma"
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE2EA] bg-white/90 p-1 pr-3 text-xs shadow-2xs backdrop-blur-sm transition-all hover:border-[#C6A24B] hover:bg-white active:scale-95"
            >
              <span className="rounded-full bg-[#101F36] px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white uppercase">
                EPIS · UNSCH
              </span>
              <span className="font-medium text-[#101F36] text-[11px] sm:text-xs">
                Proceso Electoral 2027
              </span>
              <ChevronRight className="size-3.5 text-[#C6A24B]" />
            </Link>
          </motion.div>

          {/* TÍTULO PRINCIPAL (Escalado responsivo) */}
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#101F36] leading-[1.12] sm:leading-[1.1] text-balance"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            Una decisión, <br className="hidden xs:inline" />
            <span className="bg-gradient-to-r from-[#101F36] via-[#C6A24B] to-[#101F36] bg-clip-text text-transparent">
              una comunidad.
            </span>
          </motion.h1>

          {/* DESCRIPCIÓN */}
          <motion.p
            className="mt-4 max-w-none text-xs leading-relaxed text-[#566275] text-balance sm:mt-5 sm:text-base sm:whitespace-nowrap"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          >
            Cronograma, formatos e inscripción oficial para las Elecciones CEIS 2027.
          </motion.p>

          <motion.div
            className="mt-5 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-6 sm:w-auto sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
          >
            <Link
              href="/inscripcion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full sm:w-auto bg-[#101F36] text-white hover:bg-[#182c4d] font-semibold shadow-xs justify-center gap-2 px-6 transition-all active:scale-[0.98]"
              )}
            >
              <UploadCloud className="size-4 text-[#C6A24B]" />
              <span>Inscribir Lista de Candidatos</span>
              <ArrowRight className="size-4 opacity-50 ml-0.5" />
            </Link>

            <Link
              href="/kit-electoral"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 w-full sm:w-auto border-[#DCE2EA] bg-white/95 text-[#101F36] hover:border-[#101F36] hover:bg-[#F5F7FA] font-medium justify-center gap-2 px-6 backdrop-blur-xs transition-all active:scale-[0.98]"
              )}
            >
              <DownloadCloud className="size-4 text-[#C6A24B]" />
              <span>Descargar Kit Electoral</span>
            </Link>
          </motion.div>

          <motion.div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-[#566275] sm:mt-6 sm:gap-x-6 sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.45 }}
          >
            <div className="flex items-center gap-1.5 font-medium text-[#101F36]">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span>Reglamento aprobado</span>
            </div>
            <span className="text-[#DCE2EA] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-medium text-[#101F36]">
              <span className="size-2 rounded-full bg-[#C6A24B] ring-2 ring-[#FAEEC6]" />
              <span>Inscripciones habilitadas</span>
            </div>
            <span className="text-[#DCE2EA] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-medium text-[#101F36]">
              <ShieldCheck className="size-3.5 text-[#101F36]" />
              <span>Voto universal y preclusivo</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 w-full border-t border-[#DCE2EA] bg-white/90 backdrop-blur-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <div className="container mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4 divide-y divide-[#DCE2EA] sm:divide-y-0 sm:divide-x divide-[#DCE2EA]">

            {HERO_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-3.5 sm:py-4 sm:px-5 text-left",
                  idx === 0 && "border-r border-[#DCE2EA] sm:border-r-0"
                )}
              >
                {metric.icon ? (
                  <metric.icon className="size-4 sm:size-5 text-[#C6A24B] shrink-0" />
                ) : metric.pulse ? (
                  <div className="size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse shrink-0" />
                ) : null}
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[#566275] font-medium truncate">
                    {metric.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#101F36] truncate">
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-1 flex items-center justify-center p-3 sm:py-4 sm:px-5 bg-[#F5F7FA]/60 lg:bg-transparent">
              <Link
                href="/cronograma"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-8 w-full justify-between sm:justify-center text-xs font-semibold text-[#101F36] hover:text-[#C6A24B] hover:bg-white"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-[#C6A24B]" />
                  <span>Ver cronograma</span>
                </div>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

          </div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
