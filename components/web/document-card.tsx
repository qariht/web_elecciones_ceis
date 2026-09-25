import { FileText, FileSpreadsheet, ArrowDownToLine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { DocumentoKit } from "@/data/types"

interface DocumentCardProps {
  doc: DocumentoKit
}

export function DocumentCard({ doc }: DocumentCardProps) {
  return (
    <Card className="transition-all duration-200 border-brand-border bg-white hover:border-brand-gold hover:shadow-sm">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Información del documento */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-brand-secondary text-brand-navy mt-0.5">
            {doc.tipo === "DOCX" ? (
              <FileSpreadsheet className="size-5 text-brand-gold" />
            ) : (
              <FileText className="size-5 text-brand-navy" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {doc.codigo && (
                <span className="font-mono text-[10px] font-semibold text-brand-muted-fg uppercase">
                  {doc.codigo}
                </span>
              )}
              <Badge
                variant="secondary"
                className="text-[10px] font-mono px-1.5 py-0 bg-brand-secondary border border-brand-border text-brand-muted-fg"
              >
                {doc.tipo}
              </Badge>
              {doc.obligatorio && (
                <Badge
                  variant="outline"
                  className="border-brand-border text-[10px] text-brand-muted-fg"
                >
                  Obligatorio
                </Badge>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-brand-navy leading-snug">
              {doc.titulo}
            </h3>

            <p className="text-xs text-brand-muted-fg leading-relaxed">
              {doc.descripcion}
            </p>

            <span className="inline-block text-[11px] font-mono text-brand-gold font-medium">
              Tamaño: {doc.tamano}
            </span>
          </div>
        </div>

        {/* Botón de Descarga */}
        <Button
          variant="outline"
          size="sm"
          className="border-brand-border text-brand-navy hover:bg-brand-secondary hover:border-brand-navy shrink-0 gap-1.5 font-medium transition-colors w-full sm:w-auto"
        >
          <a href={doc.archivo} download target="_blank" rel="noopener noreferrer">
            <ArrowDownToLine className="size-3.5" />
            <span>Descargar</span>
          </a>
        </Button>
      </div>
    </Card>
  )
}
