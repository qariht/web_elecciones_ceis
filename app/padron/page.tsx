import { FileText, Vote } from "lucide-react"
import { PageHeader } from "@/components/web/page-header"
import { electores, miembros, documentoPublico } from "@/data/padron"
import { consultaDniDisponible } from "@/lib/indice-dni"
import { Buscador } from "./buscador"
import styles from "./mesas.module.css"

export const metadata = { title: "Padrón electoral y miembros de mesa" }
const grupos = [
  { titulo: "Titulares", suplentes: false },
  { titulo: "Suplentes", suplentes: true },
]
const panel = "rounded-xl border border-brand-border bg-card p-5 sm:p-7"

export default function PadronPage() {
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
    <PageHeader category="Elecciones CEIS 2027" icon={Vote} title="Padrón electoral"
      description="Consulta dónde votas y si te corresponde integrar una mesa." />
    <section className={panel} aria-labelledby="buscar">
      <h2 id="buscar" className="mb-4 font-heading text-2xl font-bold">Consultar mi mesa</h2>
      {electores.length ? <Buscador permiteDni={consultaDniDisponible()} /> : <p className="text-brand-muted-fg">La consulta se habilitará cuando el comité publique el padrón.</p>}
      <div className="mt-5 flex items-center gap-2 border-t border-brand-border pt-4 text-sm">
        <FileText className="size-4 shrink-0 text-brand-gold" />
        {documentoPublico ? <a className="font-semibold underline underline-offset-4" href={documentoPublico} download>Descargar padrón electoral (PDF)</a> :
          <span>Padrón público pendiente de publicación</span>}
      </div>
    </section>
    <section id="miembros" className="mt-10 scroll-mt-24" aria-labelledby="titulo-miembros">
      <h2 id="titulo-miembros" className="mb-4 font-heading text-3xl font-bold">Miembros de mesa</h2>
      <div className="grid gap-4 md:grid-cols-2">{([1, 2] as const).map(mesa => {
        const lista = miembros.filter(m => m.mesa === mesa)
        return <article data-mesa={mesa} className={`${panel} ${styles.mesa}`} key={mesa}>
          <h3 className="border-b border-brand-border pb-3 font-heading text-xl font-bold">Mesa {mesa}</h3>
          {lista.length ? <div className="mt-4 space-y-3">
            {grupos.map(({ titulo, suplentes }) => {
              const integrantes = lista.filter(m => /suplente/i.test(m.cargo) === suplentes)
              if (!integrantes.length) return null
              return <section key={titulo} className={`${styles.grupo} ${suplentes ? styles.suplentes : ""} rounded-lg px-4 py-3`}>
                <h4 className="text-xs font-bold uppercase tracking-wide">{titulo}</h4>
                <ul className="mt-2 divide-y divide-current/15">
                  {integrantes.map(m => <li key={m.codigo} className="py-2.5 last:pb-0">
                    <p className="text-sm font-medium">{m.cargo}</p>
                    <p className="font-semibold text-foreground">{m.nombre}</p>
                    <p className="text-sm">Código {m.codigo}</p>
                  </li>)}
                </ul>
              </section>
            })}
          </div> : <p className="pt-4 text-sm text-brand-muted-fg">Integrantes pendientes de publicación.</p>}
        </article>
      })}</div>
    </section>
  </div>
}
