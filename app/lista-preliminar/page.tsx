import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays, ListChecks, UsersRound } from "lucide-react"
import { LISTA_PRELIMINAR } from "@/data/lista-preliminar"
import { PUBLICACION_LISTA_MS } from "@/data/publicacion-lista"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Lista preliminar",
  description: "Publicación de la lista preliminar para las Elecciones CEIS 2027.",
}

export default async function ListaPreliminarPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string }>
}) {
  await connection()
  const vistaLocal = process.env.NODE_ENV === "development" && (await searchParams).vista === "1"
  // The publication gate must use the clock at request time.
  // eslint-disable-next-line react-hooks/purity
  if (Date.now() < PUBLICACION_LISTA_MS && !vistaLocal) redirect("/")
  const lista = LISTA_PRELIMINAR

  return (
    <section className={`${styles.listEntrance} min-h-[calc(100svh-4rem)] bg-[#F7F8FA] px-4 py-10 sm:px-6 sm:py-16`}>
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3 border-b border-[#DCE2EA] pb-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A762E]">
            <ListChecks className="size-4" aria-hidden="true" />
            Elecciones CEIS 2027
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#101F36] sm:text-5xl">
            Lista preliminar
          </h1>
          <p className="flex items-center gap-2 text-sm text-[#566275]">
            <CalendarDays className="size-4" aria-hidden="true" />
            Publicación programada para el 26 de octubre de 2026
          </p>
        </header>

        <article className="overflow-hidden rounded-2xl border border-[#DCE2EA] bg-white shadow-sm">
          <div className="h-1.5 bg-[#C6A24B]" />
          <div className="grid gap-7 p-6 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-9 sm:p-9">
            <div className="flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border border-[#DCE2EA] bg-white shadow-sm">
              <Image src={lista.logo} alt={`Logo de ${lista.nombre}`} width={220} height={220} className="h-full w-full object-contain p-2" priority />
            </div>

            <div className="flex flex-col justify-center gap-3">
              <span className="w-fit rounded-full bg-[#FAEEC6] px-3 py-1 text-xs font-semibold text-[#101F36]">
                Lista 1 · preliminar
              </span>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#566275]">Nombre de la lista</p>
                <h2 className="font-heading text-2xl font-bold text-[#101F36] sm:text-3xl">
                  {lista.nombre}
                </h2>
              </div>
            </div>
          </div>

          <div className="border-t border-[#DCE2EA] px-6 py-7 sm:px-9 sm:py-9">
            <h3 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-[#101F36]">
              <UsersRound className="size-5 text-[#C6A24B]" aria-hidden="true" />
              Integrantes de la lista ({lista.integrantes.length})
            </h3>
            <ol className="space-y-2">
              {lista.integrantes.map((integrante, index) => (
                <li key={`${integrante.cargo}-${integrante.nombre}`} className="flex items-start gap-3 rounded-xl border border-[#DCE2EA] bg-[#F7F8FA] p-4 sm:items-center sm:gap-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-xs font-bold text-[#9A762E] ring-1 ring-[#DCE2EA]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <p className="font-semibold leading-snug text-[#101F36]">{integrante.nombre}</p>
                    <p className="mt-1 text-sm leading-snug text-[#566275] sm:mt-0 sm:w-64 sm:shrink-0 sm:text-right">{integrante.cargo}</p>
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
