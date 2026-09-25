"use client"

import type { CSSProperties } from "react"
import { motion, MotionConfig } from "framer-motion"
import {
  DownloadCloud,
  FileText,
  FolderArchive,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck,
  AlertCircleIcon,
  ArrowDownToLine,
  ExternalLink,
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
import { cn } from "@/lib/utils"
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

interface DocumentoKit {
  codigo?: string
  tipo: "PDF" | "DOCX"
  titulo: string
  descripcion: string
  archivo: string
  tamano: string
  obligatorio?: boolean
}

const DOCUMENTOS_KIT: DocumentoKit[] = [
  {
    codigo: "BASES",
    tipo: "PDF",
    titulo: "Bases para las Elecciones CEIS 2027–2028",
    descripcion: "Bases oficiales que regulan la inscripción de listas, campaña, sufragio y resultados del proceso electoral.",
    archivo: "/docs/bases-elecciones-ceis-2027.pdf",
    tamano: "101 KB",
    obligatorio: true,
  },
  {
    codigo: "CRONO",
    tipo: "PDF",
    titulo: "Cronograma Oficial de Elecciones CEIS 2027",
    descripcion: "Fechas y actividades oficiales del proceso electoral.",
    archivo: "/docs/cronograma-elecciones-ceis-2027.pdf",
    tamano: "604 KB",
    obligatorio: true,
  },
  {
    codigo: "F-01",
    tipo: "DOCX",
    titulo: "Formato de Inscripción de Candidatos",
    descripcion: "Formato editable para registrar a los integrantes y cargos de la lista postulante.",
    archivo: "/docs/formato-inscripcion-elecciones-ceis-2027.docx",
    tamano: "91 KB",
    obligatorio: true,
  },
  {
    codigo: "F-02",
    tipo: "DOCX",
    titulo: "Carta de Compromiso",
    descripcion: "Formato individual de compromiso para cada integrante de la lista.",
    archivo: "/docs/carta-compromiso-ceis-2027.docx",
    tamano: "415 KB",
    obligatorio: true,
  },
  {
    codigo: "CONTACTO",
    tipo: "PDF",
    titulo: "Directorio de Contacto Electoral",
    descripcion: "Canales de contacto oficiales para consultas sobre el proceso electoral.",
    archivo: "/docs/directorio-contacto-elecciones-ceis-2027.pdf",
    tamano: "87 KB",
  },
]

export default function KitElectoralPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-4xl py-10 px-4 sm:px-6 space-y-8" style={BRAND_THEME}>

        {/* Encabezado Principal */}
        <PageHeader
          category="Documentación Oficial"
          icon={FolderArchive}
          title="Kit Electoral y Formatos Oficiales"
          description="Descargue el reglamento del proceso y los formatos reglamentarios estandarizados requeridos para la inscripción y postulación de listas candidatas."
          withBorder
        />

        {/* Tarjeta Destacada - Paquete ZIP Completo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="relative overflow-hidden border-[var(--brand-navy)] bg-[var(--brand-navy)] text-white shadow-md">
            {/* Acento dorado decorativo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--brand-gold)]" />

            <CardHeader className="p-6 sm:p-7 pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[var(--brand-gold)] ring-1 ring-white/15">
                    <FolderArchive className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">
                        Descarga Consolidada
                      </span>
                      <Badge className="bg-white/10 text-white/90 border-white/20 text-[10px] px-2 py-0">
                        .ZIP
                      </Badge>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      Kit Electoral Completo CEIS 2027
                    </CardTitle>
                    <CardDescription className="text-white/70 text-sm mt-1">
                      Incluye las bases, el cronograma, los formatos editables y el directorio de contacto oficial.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-7 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 mt-2">
              <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
                <span>Versión 2027.1</span>
                <span>•</span>
                <span>Actualizado Setiembre 2026</span>
                <span>•</span>
                <span>1.3 MB</span>
              </div>

              <Button
                size="lg"
                className="h-11 bg-[var(--brand-gold)] text-[var(--brand-navy)] hover:bg-[var(--brand-gold)]/90 font-semibold shadow-sm transition-transform active:scale-[0.98]"
              >
                <a
                  href="/docs/kit-electoral-elecciones-ceis-2027.zip"
                  download
                  className="flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="size-4 stroke-[2.5]" />
                  <span>Descargar Kit Completo (.ZIP)</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección de Formatos Individuales */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--brand-navy)] tracking-tight">
              Formatos e Instrumentos Individuales
            </h2>
            <span className="text-xs text-[var(--muted-foreground)] font-mono">
              {DOCUMENTOS_KIT.length} documentos disponibles
            </span>
          </div>

          <div className="grid gap-3">
            {DOCUMENTOS_KIT.map((doc, idx) => (
              <motion.div
                key={doc.titulo}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: (idx + 1) * 0.05 }}
              >
                <Card className="transition-all duration-200 border-[var(--border)] bg-white hover:border-[var(--brand-gold)] hover:shadow-sm">
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    {/* Información del documento */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--brand-navy)] mt-0.5">
                        {doc.tipo === "DOCX" ? (
                          <FileSpreadsheet className="size-5 text-[var(--brand-gold)]" />
                        ) : (
                          <FileText className="size-5 text-[var(--brand-navy)]" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold text-[var(--muted-foreground)] uppercase">
                            {doc.codigo}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono px-1.5 py-0 bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)]"
                          >
                            {doc.tipo}
                          </Badge>
                          {doc.obligatorio && (
                            <Badge
                              variant="outline"
                              className="border-[var(--border)] text-[10px] text-[var(--muted-foreground)]"
                            >
                              Obligatorio
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-[var(--brand-navy)] leading-snug">
                          {doc.titulo}
                        </h3>

                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {doc.descripcion}
                        </p>

                        <span className="inline-block text-[11px] font-mono text-[var(--brand-gold)] font-medium">
                          Tamaño: {doc.tamano}
                        </span>
                      </div>
                    </div>

                    {/* Botón de Descarga */}
                    {/* Botón de Descarga */}
                    <Button

                      variant="outline"
                      size="sm"
                      className="border-[var(--border)] text-[var(--brand-navy)] hover:bg-[var(--secondary)] hover:border-[var(--brand-navy)] shrink-0 font-medium transition-colors w-full sm:w-auto"
                    >
                      <a
                        href={doc.archivo}
                        download
                        className="flex items-center justify-center gap-1.5"
                      >
                        <ArrowDownToLine className="size-3.5" />
                        <span>Descargar</span>
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nota de advertencia y seguridad jurídica (Mismo estilo que Cronograma) */}
        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[#F5F7FA] p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldCheck className="size-5 text-[var(--brand-navy)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p className="font-semibold text-[var(--brand-navy)]">
              Validez Reglamentaria de la Documentación
            </p>
            <p>
              Los formatos no deben ser alterados en su estructura básica. Cualquier tachadura, omisión de firmas o presentación en modelos desactualizados será causal de observación formal e inadmisibilidad de la lista postulante.
            </p>
          </div>
        </div>

      </div>
    </MotionConfig>
  )
}
