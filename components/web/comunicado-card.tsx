import {
  CalendarDays,
  Tag,
  ScrollText,
  BellRing,
  ArrowDownToLine,
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
import type { Publicacion } from "@/data/types"

interface ComunicadoCardProps {
  item: Publicacion
}

export function ComunicadoCard({ item }: ComunicadoCardProps) {
  const isResolucion = item.tipo === "Resolución"

  return (
    <Card className="transition-all duration-200 border-brand-border bg-white hover:border-brand-gold shadow-none hover:shadow-sm">
      <CardHeader className="p-5 sm:p-6 pb-3">
        {/* Metadatos superiores: Número y Fecha */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide bg-brand-secondary text-brand-navy border border-brand-border"
            >
              <Tag className="size-3 text-brand-gold" />
              {item.numero}
            </Badge>

            <Badge
              className={
                isResolucion
                  ? "bg-brand-navy text-white text-[10px] font-medium border-transparent"
                  : "bg-brand-gold-soft text-brand-navy border-brand-gold/50 text-[10px] font-medium"
              }
            >
              {isResolucion ? (
                <span className="flex items-center gap-1">
                  <ScrollText className="size-3" />
                  {item.tipo}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <BellRing className="size-3 text-brand-gold" />
                  {item.tipo}
                </span>
              )}
            </Badge>
          </div>

          <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-brand-muted-fg">
            <CalendarDays className="size-3.5 text-brand-gold" />
            <span>{item.fecha}</span>
          </CardDescription>
        </div>

        {/* Título */}
        <CardTitle className="text-lg sm:text-xl font-semibold text-brand-navy leading-snug tracking-tight">
          {item.titulo}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
        {/* Resumen */}
        <p className="text-sm leading-relaxed text-brand-muted-fg">
          {item.resumen}
        </p>

        {/* Imagen adjunta opcional */}
        {item.imagenUrl && (
          <div className="overflow-hidden rounded-lg border border-brand-border bg-brand-secondary">
            <img
              src={item.imagenUrl}
              alt={item.titulo}
              className="w-full object-cover max-h-72"
            />
          </div>
        )}

        {/* Botón de descarga */}
        {item.archivoUrl && (
          <div className="pt-2 border-t border-brand-border/70 flex items-center justify-between">
            <span className="text-xs font-mono text-brand-muted-fg hidden sm:inline">
              Formato digital con firma y sello oficial
            </span>

            <Button
              variant="outline"
              size="sm"
              className="border-brand-border text-brand-navy hover:bg-brand-secondary hover:border-brand-navy font-medium gap-2 transition-colors w-full sm:w-auto"
            >
              <a
                href={item.archivoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowDownToLine className="size-3.5 text-brand-gold stroke-[2.5]" />
                <span>Descargar Documento Oficial (PDF)</span>
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
