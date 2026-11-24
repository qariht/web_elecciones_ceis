import type { Elector } from "@/data/padron"

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim()
}

// Tolera una letra omitida, añadida, sustituida o dos letras contiguas invertidas.
function similar(a: string, b: string) {
  if (a.length < 4 || Math.abs(a.length - b.length) > 1) return false
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  if (a.length < b.length) return a.slice(i) === b.slice(i + 1)
  if (a.length > b.length) return a.slice(i + 1) === b.slice(i)
  return a.slice(i + 1) === b.slice(i + 1) ||
    (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2))
}

export function buscarElectores(filas: Elector[], texto: string, codigoPorDni?: string) {
  const consulta = normalizar(texto)
  const compacto = consulta.replaceAll(" ", "")
  if (compacto.length < 2) return []
  const partes = consulta.split(" ")
  const resultados = filas.map(elector => {
    const codigo = normalizar(elector.codigo).replaceAll(" ", "")
    const nombre = normalizar(elector.nombre)
    let rango = Infinity
    if (elector.codigo === codigoPorDni || codigo === compacto || nombre === consulta) rango = 0
    else if (codigo.startsWith(compacto) || nombre.replaceAll(" ", "").includes(compacto)) rango = 1
    else {
      const palabras = nombre.split(" ")
      if (partes.every(p => palabras.some(w => w.startsWith(p)))) rango = 2
      else if (partes.every(p => palabras.some(w => w.startsWith(p) || similar(p, w)))) rango = 3
    }
    return { elector, rango }
  })
  return resultados.filter(r => Number.isFinite(r.rango))
    .sort((a, b) => a.rango - b.rango || a.elector.nombre.localeCompare(b.elector.nombre, "es"))
    .slice(0, 8).map(r => r.elector)
}
