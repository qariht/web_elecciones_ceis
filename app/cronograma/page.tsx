"use client"

import { MouseEvent, useMemo, useRef, type CSSProperties } from "react"
import { motion, MotionConfig, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  Hourglass,
  ShieldCheck,
  ChevronRight,
  Milestone,
  AlertCircleIcon,
  MapPin,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ETAPAS_ELECTORALES } from "../data/etapas_electorales"
import { calcularEstado, formatearRangoFechas } from "@/lib/formaters"
import { PageHeader } from "@/components/web/page-header"
import { GRID_HERO } from "@/data/inscripcion"

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

export default function CronogramaPage() {
  const fechaActual = useMemo(() => new Date(), [])

  /* Spotlight dorado que sigue al mouse (mismo recurso del hero) */
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 140, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 140, mass: 0.5 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-4xl py-10 px-4 sm:px-6"
        style={BRAND_THEME}
        onMouseMove={handleMouseMove}>

        {/* Fondo grilla*/}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden">
          <div className={cn("absolute inset-0", GRID_HERO)} />
          <motion.div
            style={{ left: smoothX, top: smoothY, translateX: "-50%", translateY: "-50%" }}
            className="absolute hidden size-[560px] rounded-full bg-[radial-gradient(circle,rgba(198,162,75,0.22)_0%,rgba(16,31,54,0.06)_45%,transparent_75%)] blur-[90px] sm:block"
          />
        </div>

        <PageHeader
          category="Calendario del Proceso"
          icon={CalendarDays}
          title="Cronograma Electoral Oficial — CEIS 2027"
          description="Fechas, actividades y medios de publicación establecidos por el Comité Electoral para el proceso de elección del CEIS."
          withBorder
        />
        <br />


        {/* Contenedor de la Línea de Tiempo */}
        <div className="relative">
          {ETAPAS_ELECTORALES.map((etapa, idx) => {
            const estado = calcularEstado(etapa.fechaInicio, etapa.fechaFin, fechaActual)
            const isLast = idx === ETAPAS_ELECTORALES.length - 1
            const isCompleted = estado === "Finalizado"
            const isActive = estado === "En curso"

            return (
              <div key={etapa.id} className="relative flex items-start gap-4 sm:gap-6">
                {/* EJE VERTICAL (Línea continua + Nodo del Hito) */}
                <div className="relative flex flex-col items-center">
                  {/* Nodo circular */}
                  <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full transition-all">
                    {isCompleted && (
                      <div className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white shadow-sm ring-4 ring-white">
                        <Check className="size-4 stroke-[3]" />
                      </div>
                    )}

                    {isActive && (
                      <div className="relative flex size-9 items-center justify-center rounded-full bg-[var(--brand-gold)] text-[var(--brand-navy)] ring-4 ring-[var(--brand-gold-soft)]">
                        <span className="absolute -inset-1 animate-ping rounded-full bg-[var(--brand-gold)] opacity-30" />
                        <Clock className="size-4 stroke-[2.5]" />
                      </div>
                    )}

                    {!isCompleted && !isActive && (
                      <div className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--border)] bg-white text-[var(--muted-foreground)] ring-4 ring-white">
                        <Hourglass className="size-3.5 opacity-60" />
                      </div>
                    )}
                  </div>

                  {/* Línea conectora irreversible */}
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 my-1 h-full min-h-[5rem] transition-colors",
                        isCompleted
                          ? "bg-[var(--brand-navy)]"
                          : isActive
                            ? "bg-gradient-to-b from-[var(--brand-gold)] to-[var(--border)]"
                            : "bg-[var(--border)]"
                      )}
                    />
                  )}
                </div>

                {/* TARJETA DE LA ETAPA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.06 }}
                  className={cn("mb-8 w-full flex-1", isLast && "mb-0")}
                >
                  <Card
                    className={cn(
                      "transition-all shadow-none border",
                      isActive
                        ? "border-[var(--brand-gold)] bg-white ring-2 ring-[var(--brand-gold)]/20 shadow-md"
                        : isCompleted
                          ? "border-[var(--border)] bg-white/70"
                          : "border-[var(--border)] bg-white opacity-85 hover:opacity-100"
                    )}
                  >
                    <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                            {etapa.fase}
                          </span>
                          {etapa.obligatorio && (
                            <Badge variant="outline" className="border-[var(--border)] text-[10px] text-[var(--muted-foreground)]">
                              Obligatorio
                            </Badge>
                          )}
                        </div>

                        {/* Badge de estado estandarizado */}
                        {isCompleted && (
                          <Badge
                            variant="secondary"
                            className="bg-[#F5F7FA] text-[var(--muted-foreground)] border border-[var(--border)] gap-1 px-2.5 py-0.5 font-medium"
                          >
                            <Check className="size-3 text-emerald-600 stroke-[3]" />
                            Finalizado
                          </Badge>
                        )}
                        {isActive && (
                          <Badge
                            className="bg-[var(--brand-gold-soft)] text-[var(--brand-navy)] border border-[var(--brand-gold)]/50 gap-1.5 px-2.5 py-0.5 font-semibold animate-pulse"
                          >
                            <span className="size-1.5 rounded-full bg-[var(--brand-navy)]" />
                            En curso
                          </Badge>
                        )}
                        {!isCompleted && !isActive && (
                          <Badge
                            variant="secondary"
                            className="bg-transparent text-[var(--muted-foreground)] border border-transparent gap-1 px-2 py-0.5 font-normal"
                          >
                            <Hourglass className="size-3" />
                            Pendiente
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-base sm:text-lg font-semibold text-[var(--brand-navy)] mt-1">
                        {etapa.titulo}
                      </CardTitle>

                      <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-gold)]">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>{formatearRangoFechas(etapa.fechaInicio, etapa.fechaFin)}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 pt-0 text-sm text-[var(--muted-foreground)] space-y-2">
                      <p className="leading-relaxed">{etapa.detalle}</p>
                      <p className="flex gap-2 items-start text-xs leading-relaxed">
                        <MapPin className="size-3.5 shrink-0 mt-0.5 text-[var(--brand-gold)]" />
                        <span><span className="font-semibold text-[var(--brand-navy)]">Lugar o publicación:</span> {etapa.lugar}</span>
                      </p>
                      {etapa.nota && (
                        <p className="flex gap-2.5 items-center text-xs font-medium text-[var(--brand-navy)] bg-[var(--brand-gold-soft)]/50 p-2 rounded border border-[var(--brand-gold)]/30">
                          <AlertCircleIcon /> {etapa.nota}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 rounded-xl border border-[var(--border)] bg-[#F5F7FA] p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldCheck className="size-5 text-[var(--brand-navy)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p className="font-semibold text-[var(--brand-navy)]">
              Principio de Preclusión y Seguridad Jurídica
            </p>
            <p>
              Ningún plazo podrá ser extendido ni retrotraído salvo resolución formal debidamente sustentada emitida por el Comité Electoral Universitario conforme al reglamento de la EPIS.
            </p>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
