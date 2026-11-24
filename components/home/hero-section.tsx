import Link from "next/link"
import { Search, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BinaryParticleBackground } from "@/components/home/binary-particle-background"
import styles from "./hero-section.module.css"

export function HeroSection() {
  return (
    <section className={`${styles.hero} relative isolate overflow-hidden bg-background px-4 text-center sm:px-6`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--hero-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--hero-grid)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_65%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A24B]/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <BinaryParticleBackground />
      </div>

      <div data-binary-slot="heading" className={styles.binaryHeading} aria-hidden="true" />

      <div data-binary-content className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <p className={`${styles.headingEnter} text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)] sm:text-base`}>
          Jornada electoral
        </p>
        <h1 className={`${styles.headingEnter} mt-3 font-heading text-4xl font-bold leading-tight tracking-tight text-[var(--brand-ink)] text-balance sm:text-6xl lg:text-7xl`}>
          Padrón electoral
        </h1>
        <p className="mt-4 max-w-md text-brand-muted-fg">Encuentra tu mesa de votación y consulta quiénes la integran.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/padron" className={buttonVariants({ size: "lg" })}><Search /> Consultar mi mesa</Link>
          <Link href="/padron#miembros" className={buttonVariants({ variant: "outline", size: "lg" })}><Users /> Miembros de mesa</Link>
        </div>
      </div>
      <div data-binary-slot="year" className={styles.binaryYear} aria-hidden="true" />
    </section>
  )
}
