"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { FadeIn } from "@/components/web/motion-wrapper"
import { FASE_ACTIVA } from "@/data/home"

export function ActivePhaseBanner() {
  return (
    <FadeIn delay={0.1}>
      <div className="rounded-xl border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-muted text-foreground">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px] font-semibold">
                {FASE_ACTIVA.fase}
              </Badge>
              <span className="text-xs text-muted-foreground">{FASE_ACTIVA.vencimiento}</span>
            </div>
            <p className="text-base font-semibold text-foreground mt-0.5">
              {FASE_ACTIVA.titulo}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          <Link href={FASE_ACTIVA.href}>Consultar Cronograma</Link>
        </Button>
      </div>
    </FadeIn>
  )
}