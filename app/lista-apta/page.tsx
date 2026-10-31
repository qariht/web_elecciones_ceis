import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, ListChecks, UsersRound } from "lucide-react"
import { LISTA_APTA } from "@/data/lista-apta"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Lista apta",
  description: "Publicación de la lista apta para las Elecciones CEIS 2027.",
}

export default function ListaAptaPage() {
  const lista = LISTA_APTA

  return (
    <section className={`${styles.listEntrance} min-h-[calc(100svh-4rem)] bg-background px-4 py-10 sm:px-6 sm:py-16`}>
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3 border-b border-brand-border pb-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)]">
            <ListChecks className="size-4" aria-hidden="true" />
            Elecciones CEIS 2027
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--brand-ink)] sm:text-5xl">
            Lista apta
          </h1>
          <p className="flex items-center gap-2 text-sm text-brand-muted-fg">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Avanza Sistemas PRO · lista apta para las Elecciones CEIS 2027
          </p>
        </header>

        <article className="overflow-hidden rounded-2xl border border-brand-border bg-card shadow-sm">
          <div className="h-1.5 bg-[#C6A24B]" />
          <div className="grid gap-7 p-6 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-9 sm:p-9">
            <div className="flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border border-brand-border bg-card shadow-sm">
              <Image src={lista.logo} alt={`Logo de ${lista.nombre}`} width={220} height={220} className="h-full w-full object-contain p-2" priority />
            </div>

            <div className="flex flex-col justify-center gap-3">
              <span className="w-fit rounded-full bg-[var(--brand-gold-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-ink)]">
                Lista 1 · apta
              </span>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-muted-fg">Nombre de la lista</p>
                <h2 className="font-heading text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                  {lista.nombre}
                </h2>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border px-6 py-7 sm:px-9 sm:py-9">
            <h3 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-[var(--brand-ink)]">
              <UsersRound className="size-5 text-[#C6A24B]" aria-hidden="true" />
              Integrantes de la lista ({lista.integrantes.length})
            </h3>
            <ol className="space-y-2">
              {lista.integrantes.map((integrante, index) => (
                <li key={`${integrante.cargo}-${integrante.nombre}`} className="flex items-start gap-3 rounded-xl border border-brand-border bg-background p-4 sm:items-center sm:gap-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card font-mono text-xs font-bold text-[var(--brand-gold)] ring-1 ring-brand-border">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <p className="font-semibold leading-snug text-[var(--brand-ink)]">{integrante.nombre}</p>
                    <p className="mt-1 text-sm leading-snug text-brand-muted-fg sm:mt-0 sm:w-64 sm:shrink-0 sm:text-right">{integrante.cargo}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </div>
    </section>
  )
}
