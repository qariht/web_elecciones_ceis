import Link from "next/link"
import styles from "./hero-section.module.css"

export function ReleaseAction() {
  return (
    <div className={`${styles.buttonEnter} mt-9 flex flex-wrap items-center justify-center gap-3`}>
      <Link
        href="/lista-apta"
        className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#C6A24B] bg-[#101F36] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#182C4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A24B] sm:text-base"
      >
        Ver integrantes
      </Link>
      <Link
        href="/cronograma"
        className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#C6A24B] bg-card/90 px-7 py-3 text-sm font-semibold text-[var(--brand-ink)] shadow-sm transition-colors hover:bg-[var(--brand-gold-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A24B] sm:text-base"
      >
        Ver cronograma
      </Link>
    </div>
  )
}
