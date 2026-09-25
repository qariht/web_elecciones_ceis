import { Check, Clock, Hourglass } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { EstadoEtapa } from "@/data/types"

interface StatusBadgeProps {
  estado: EstadoEtapa
}

export function StatusBadge({ estado }: StatusBadgeProps) {
  if (estado === "Finalizado") {
    return (
      <Badge
        variant="secondary"
        className="bg-brand-secondary text-brand-muted-fg border border-brand-border gap-1 px-2.5 py-0.5 font-medium"
      >
        <Check className="size-3 text-emerald-600 stroke-[3]" />
        Finalizado
      </Badge>
    )
  }

  if (estado === "En curso") {
    return (
      <Badge className="bg-brand-gold-soft text-brand-navy border border-brand-gold/50 gap-1.5 px-2.5 py-0.5 font-semibold animate-pulse">
        <span className="size-1.5 rounded-full bg-brand-navy" />
        En curso
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="bg-transparent text-brand-muted-fg border border-transparent gap-1 px-2 py-0.5 font-normal"
    >
      <Hourglass className="size-3" />
      Pendiente
    </Badge>
  )
}
