"use client"

import { useEffect, useState } from "react"
import { PUBLICACION_LISTA_MS } from "@/data/publicacion-lista"

export function useListaPublicada() {
  const [publicada, setPublicada] = useState(false)

  useEffect(() => {
    const update = () => setPublicada(Date.now() >= PUBLICACION_LISTA_MS)
    const initialTimer = window.setTimeout(update, 0)
    const interval = window.setInterval(update, 1000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(interval)
    }
  }, [])

  return publicada
}
