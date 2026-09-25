import { cn } from "@/lib/utils"
import type { EstadoEtapa } from "@/data/types"

interface TimelineConnectorProps {
  estado: EstadoEtapa
}

export function TimelineConnector({ estado }: TimelineConnectorProps) {
  return (
    <div
      className={cn(
        "w-0.5 my-1 h-full min-h-[5rem] transition-colors",
        estado === "Finalizado"
          ? "bg-brand-navy"
          : estado === "En curso"
            ? "bg-gradient-to-b from-brand-gold to-brand-border"
            : "bg-brand-border"
      )}
    />
  )
}
