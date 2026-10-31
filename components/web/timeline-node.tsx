import { Check, Clock, Hourglass } from "lucide-react"
import type { EstadoEtapa } from "@/data/types"

interface TimelineNodeProps {
  estado: EstadoEtapa
}

export function TimelineNode({ estado }: TimelineNodeProps) {
  if (estado === "Finalizado") {
    return (
      <div className="flex size-9 items-center justify-center rounded-full bg-brand-navy text-white shadow-sm ring-4 ring-card">
        <Check className="size-4 stroke-[3]" />
      </div>
    )
  }

  if (estado === "En curso") {
    return (
      <div className="relative flex size-9 items-center justify-center rounded-full bg-brand-gold text-[var(--brand-ink)] ring-4 ring-brand-gold-soft">
        <span className="absolute -inset-1 animate-ping rounded-full bg-brand-gold opacity-30" />
        <Clock className="size-4 stroke-[2.5]" />
      </div>
    )
  }

  return (
    <div className="flex size-9 items-center justify-center rounded-full border-2 border-brand-border bg-card text-brand-muted-fg ring-4 ring-card">
      <Hourglass className="size-3.5 opacity-60" />
    </div>
  )
}
