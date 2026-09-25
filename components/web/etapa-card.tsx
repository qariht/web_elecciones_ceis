import { CalendarDays, AlertCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/web/status-badge"
import { formatearRangoFechas } from "@/lib/formaters"
import type { EtapaElectoral, EstadoEtapa } from "@/data/types"

interface EtapaCardProps {
  etapa: EtapaElectoral
  estado: EstadoEtapa
}

export function EtapaCard({ etapa, estado }: EtapaCardProps) {
  const isActive = estado === "En curso"
  const isCompleted = estado === "Finalizado"

  return (
    <Card
      className={cn(
        "transition-all shadow-none border",
        isActive
          ? "border-brand-gold bg-white ring-2 ring-brand-gold/20 shadow-md"
          : isCompleted
            ? "border-brand-border bg-white/70"
            : "border-brand-border bg-white opacity-85 hover:opacity-100"
      )}
    >
      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted-fg">
              {etapa.fase}
            </span>
            {etapa.obligatorio && (
              <Badge
                variant="outline"
                className="border-brand-border text-[10px] text-brand-muted-fg"
              >
                Obligatorio
              </Badge>
            )}
          </div>

          <StatusBadge estado={estado} />
        </div>

        <CardTitle className="text-base sm:text-lg font-semibold text-brand-navy mt-1">
          {etapa.titulo}
        </CardTitle>

        <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold">
          <CalendarDays className="size-3.5 shrink-0" />
          <span>{formatearRangoFechas(etapa.fechaInicio, etapa.fechaFin)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 text-sm text-brand-muted-fg space-y-2">
        <p className="leading-relaxed">{etapa.detalle}</p>
        {etapa.nota && (
          <p className="flex gap-2.5 items-center text-xs font-medium text-brand-navy bg-brand-gold-soft/50 p-2 rounded border border-brand-gold/30">
            <AlertCircleIcon />
            {etapa.nota}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
