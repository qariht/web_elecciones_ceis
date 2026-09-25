"use client"

import type { CSSProperties } from "react"
import { motion, MotionConfig } from "framer-motion"
import {
  CalendarDays,
  FileText,
  Megaphone,
  ShieldCheck,
  Tag,
  ArrowDownToLine,
  ScrollText,
  BellRing,
  Info,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/web/page-header"

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

interface Publicacion {
  id: string
  tipo: "Resolución" | "Comunicado" | "Aviso"
  numero: string
  fecha: string
  titulo: string
  resumen: string
  archivoUrl?: string
  imagenUrl?: string
}

const PUBLICACIONES: Publicacion[] = [
  {
    id: "1",
    tipo: "Comunicado",
    numero: "COMUNICADO OFICIAL N° 001-2026-CE-EPIS",
    fecha: "22 de septiembre de 2026",
    titulo: "Inscripciones de listas abiertas",
    resumen:
      "Las inscripciones ordinarias estarán abiertas del miércoles 23 de septiembre al viernes 16 de octubre de 2026. La inscripción extemporánea estará habilitada del sábado 17 al miércoles 21 de octubre de 2026. El registro se realiza en el portal web del Comité Electoral.",
  },
]

export default function ComunicadosPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="mx-auto w-full max-w-4xl py-10 px-4 sm:px-6 space-y-8"
        style={BRAND_THEME}
      >
        {/* Encabezado Oficial */}
        <PageHeader
          category="Transparencia y Publicaciones"
          icon={Megaphone}
          title="Comunicados y Resoluciones"
          description="Avisos normativos fechados, actas, resoluciones y acuerdos con trazabilidad y plena validez legal emitida por el Comité Electoral de la EPIS."
          withBorder
        />

        {/* Listado de publicaciones con animación escalonada */}
        <div className="space-y-5">
          {PUBLICACIONES.map((item, idx) => {
            const isResolucion = item.tipo === "Resolución"

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
              >
                <Card className="transition-all duration-200 border-[var(--border)] bg-white hover:border-[var(--brand-gold)] shadow-none hover:shadow-sm">
                  <CardHeader className="p-5 sm:p-6 pb-3">
                    {/* Metadatos superiores: Número de resolución/comunicado y Fecha */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="gap-1.5 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide bg-[var(--secondary)] text-[var(--brand-navy)] border border-[var(--border)]"
                        >
                          <Tag className="size-3 text-[var(--brand-gold)]" />
                          {item.numero}
                        </Badge>

                        <Badge
                          className={
                            isResolucion
                              ? "bg-[var(--brand-navy)] text-white text-[10px] font-medium border-transparent"
                              : "bg-[var(--brand-gold-soft)] text-[var(--brand-navy)] border-[var(--brand-gold)]/50 text-[10px] font-medium"
                          }
                        >
                          {isResolucion ? (
                            <span className="flex items-center gap-1 px-2 py-1">
                              <ScrollText className="size-3" />
                              {item.tipo}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-1">
                              <BellRing className="size-3 text-[var(--brand-gold)]" />
                              {item.tipo}
                            </span>
                          )}
                        </Badge>
                      </div>

                      <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                        <CalendarDays className="size-3.5 text-[var(--brand-gold)]" />
                        <span>{item.fecha}</span>
                      </CardDescription>
                    </div>

                    {/* Título de la publicación */}
                    <CardTitle className="text-lg sm:text-xl font-semibold text-[var(--brand-navy)] leading-snug tracking-tight">
                      {item.titulo}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                    {/* Resumen explicativo */}
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {item.resumen}
                    </p>

                    {/* Imagen adjunta opcional */}
                    {item.imagenUrl && (
                      <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--secondary)]">
                        <img
                          src={item.imagenUrl}
                          alt={item.titulo}
                          className="w-full object-cover max-h-72"
                        />
                      </div>
                    )}

                    {/* Botón de descarga de documento adjunto */}
                    {item.archivoUrl && (
                      <div className="pt-2 border-t border-[var(--border)]/70 flex items-center justify-between">
                        <span className="text-xs font-mono text-[var(--muted-foreground)] hidden sm:inline">
                          Formato digital con firma y sello oficial
                        </span>

                        <Button

                          variant="outline"
                          size="sm"
                          className="border-[var(--border)] text-[var(--brand-navy)] hover:bg-[var(--secondary)] hover:border-[var(--brand-navy)] font-medium gap-2 transition-colors w-full sm:w-auto"
                        >
                          <a
                            href={item.archivoUrl}
                            download
                            className="flex items-center justify-center gap-2"
                          >
                            <ArrowDownToLine className="size-3.5 text-[var(--brand-gold)] stroke-[2.5]" />
                            <span>Descargar Documento Oficial (PDF)</span>
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Panel de Fe Pública y Notificación Legal */}
        <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldCheck className="size-5 text-[var(--brand-navy)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p className="font-semibold text-[var(--brand-navy)]">
              Efectos de Notificación y Validez Publicitaria
            </p>
            <p>
              Toda publicación efectuada en este portal oficial surte efectos legales de notificación a la comunidad universitaria y personeros de lista a partir de la fecha y hora de su fijación digital, conforme al Reglamento General de Elecciones.
            </p>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
