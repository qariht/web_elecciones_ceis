import Image from "next/image"
import { BinaryParticleBackground } from "@/components/home/binary-particle-background"
import { ReleaseAction } from "@/components/home/release-action"
import { LISTA_APTA } from "@/data/lista-apta"
import styles from "./hero-section.module.css"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-16 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--hero-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--hero-grid)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_65%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A24B]/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <BinaryParticleBackground />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <p className={`${styles.headingEnter} text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)] sm:text-base`}>
          Presentamos a la lista apta
        </p>
        <h1 className={`${styles.headingEnter} mt-3 font-heading text-4xl font-bold leading-tight tracking-tight text-[var(--brand-ink)] text-balance sm:text-6xl lg:text-7xl`}>
          {LISTA_APTA.nombre}
        </h1>
        <div className={`${styles.buttonEnter} mt-8 overflow-hidden rounded-2xl border border-brand-border bg-white p-2 shadow-lg`}>
          <Image
            src={LISTA_APTA.logo}
            alt={`Logo de ${LISTA_APTA.nombre}`}
            width={220}
            height={220}
            className="size-40 object-contain sm:size-52"
            priority
          />
        </div>
        <ReleaseAction />
      </div>
    </section>
  )
}
