import { ShieldCheck } from "lucide-react"
import type { LegalNotice } from "@/data/types"

interface LegalFooterNoticeProps {
  notice: LegalNotice
  className?: string
}

export function LegalFooterNotice({ notice, className = "" }: LegalFooterNoticeProps) {
  return (
    <div
      className={`rounded-xl border border-brand-border bg-brand-secondary p-4 sm:p-5 flex items-start gap-3.5 ${className}`}
    >
      <ShieldCheck className="size-5 text-brand-navy shrink-0 mt-0.5" />
      <div className="space-y-1 text-xs sm:text-sm text-brand-muted-fg leading-relaxed">
        <p className="font-semibold text-brand-navy">{notice.titulo}</p>
        <p>{notice.texto}</p>
      </div>
    </div>
  )
}
