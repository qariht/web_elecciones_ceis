import { FolderArchive, DownloadCloud } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { KitDestacado } from "@/data/types"

interface KitFeaturedCardProps {
  kit: KitDestacado
}

export function KitFeaturedCard({ kit }: KitFeaturedCardProps) {
  return (
    <Card className="relative overflow-hidden border-brand-navy bg-brand-navy text-white shadow-md">
      {/* Acento dorado decorativo */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gold" />

      <CardHeader className="p-6 sm:p-7 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-gold ring-1 ring-white/15">
              <FolderArchive className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-gold">
                  Descarga Consolidada
                </span>
                <Badge className="bg-white/10 text-white/90 border-white/20 text-[10px] px-2 py-0">
                  .ZIP
                </Badge>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Kit Electoral Completo 2026
              </CardTitle>
              <CardDescription className="text-white/70 text-sm mt-1">
                Incluye todos los formatos normativos en formato Word editable y PDF, junto al
                reglamento oficial.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 mt-2">
        <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
          <span>Versión {kit.version}</span>
          <span>•</span>
          <span>Actualizado {kit.actualizacion}</span>
          <span>•</span>
          <span>{kit.tamano}</span>
        </div>

        <Button
          size="lg"
          className="h-11 bg-brand-gold text-brand-navy hover:bg-brand-gold/90 font-semibold shadow-sm transition-transform active:scale-[0.98]"
        >
          <a href={kit.archivo} download>
            <DownloadCloud className="size-4 mr-2 stroke-[2.5]" />
            Descargar Kit Completo (.ZIP)
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
