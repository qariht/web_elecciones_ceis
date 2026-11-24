"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import type { Elector, Mesa } from "@/data/padron"
import styles from "./mesas.module.css"

type Resultado = Elector & { designacion: { cargo: string, mesa: Mesa } | null }
type Respuesta = { resultados: Resultado[], miembrosPublicados: boolean }

export function Buscador({ permiteDni }: { permiteDni: boolean }) {
  const [consulta, cambiar] = useState("")
  const [respuesta, mostrar] = useState<Respuesta | null>(null)
  const [error, informar] = useState(false)
  const activa = consulta.replace(/[^\p{L}\p{N}]/gu, "").length >= 2

  useEffect(() => {
    if (!activa) return
    const control = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/padron", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consulta }), signal: control.signal, cache: "no-store",
        })
        if (!res.ok) throw new Error()
        const datos = await res.json()
        if (!Array.isArray(datos.resultados)) throw new Error()
        if (!control.signal.aborted) mostrar(datos)
      } catch {
        if (!control.signal.aborted) informar(true)
      }
    }, 240)
    return () => { clearTimeout(timer); control.abort() }
  }, [consulta, activa])

  return (
    <div className="space-y-3">
      <label htmlFor="consulta" className="block text-sm font-semibold">{permiteDni ? "Nombres, apellidos, código o DNI" : "Nombres, apellidos o código"}</label>
      <div className="relative">
        <Search aria-hidden className="absolute left-3 top-3.5 size-4 text-brand-muted-fg" />
        <input id="consulta" type="search" maxLength={100} autoComplete="off" value={consulta}
          aria-describedby="ayuda-consulta" placeholder="Escribe tus datos"
          className="h-11 w-full rounded-lg border border-brand-border bg-background pl-10 pr-3 focus-visible:outline-primary"
          onChange={e => { cambiar(e.target.value); mostrar(null); informar(false) }} />
      </div>
      <p id="ayuda-consulta" className="text-sm text-brand-muted-fg">Escribe al menos dos caracteres.{permiteDni && " Para buscar por DNI, ingresa sus ocho dígitos."}</p>
      <div role="status" className="text-sm">
        {activa && (error ? "No se pudo realizar la consulta. Vuelve a intentarlo." :
          !respuesta ? "Buscando…" : !respuesta.resultados.length ? "Sin coincidencias. Revisa los datos o prueba con otro apellido." :
          respuesta.resultados.length === 8 ? "Primeras ocho coincidencias. Agrega un apellido o el código para precisar." : "Coincidencias encontradas")}
      </div>
      {activa && respuesta && <ul className="divide-y divide-brand-border">
        {respuesta.resultados.map(r => <li key={r.codigo} className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <strong>{r.nombre}</strong>
              <p className="text-sm">Código {r.codigo}</p>
            </div>
            <p className="flex items-center gap-2 text-sm text-brand-muted-fg">
              Vota en
              <strong data-mesa={r.mesa} className={`${styles.mesa} ${styles.insignia} rounded-md px-3 py-1.5 font-bold`}>
                Mesa {r.mesa}
              </strong>
            </p>
          </div>
          <p className="mt-1 text-sm text-brand-muted-fg">{r.designacion ? `${r.designacion.cargo} · Mesa ${r.designacion.mesa}` :
            respuesta.miembrosPublicados ? "Sin cargo de mesa" : "Designaciones pendientes de publicación"}</p>
        </li>)}
      </ul>}
    </div>
  )
}
