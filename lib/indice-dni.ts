import "server-only"
import indiceImportado from "./indice-dni.json"
import { createHmac } from "node:crypto"

// Al importar, generar HMAC-SHA256 del DNI de ocho dígitos con PADRON_CLAVE_DNI.
// Solo se conservan el resumen hexadecimal y el código, nunca el DNI original.
const indice: Record<string, string> = indiceImportado

export function consultaDniDisponible() {
  return Boolean(process.env.PADRON_CLAVE_DNI && Object.keys(indice).length)
}

export function resolverDni(consulta: string) {
  const dni = consulta.replace(/[\s.-]/g, "")
  if (!/^\d{8}$/.test(dni) || !Object.keys(indice).length) return undefined
  const clave = process.env.PADRON_CLAVE_DNI
  if (!clave) return undefined
  return indice[createHmac("sha256", clave).update(dni).digest("hex")]
}
