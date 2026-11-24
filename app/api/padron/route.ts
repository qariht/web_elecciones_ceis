import { electores, miembros } from "@/data/padron"
import { resolverDni } from "@/lib/indice-dni"
import { buscarElectores } from "@/lib/padron"

const headers = { "Cache-Control": "no-store" }

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (typeof body?.consulta !== "string" || body.consulta.length > 100) {
    return Response.json({ error: "Consulta inválida." }, { status: 400, headers })
  }
  if (!electores.length) return Response.json({ pendiente: true }, { headers })
  try {
    const filas = buscarElectores(electores, body.consulta, resolverDni(body.consulta))
    const resultados = filas.map(({ nombre, codigo, mesa }) => {
      const miembro = miembros.find(m => m.codigo === codigo)
      return { nombre, codigo, mesa, designacion: miembro ? { cargo: miembro.cargo, mesa: miembro.mesa } : null }
    })
    return Response.json({ resultados, miembrosPublicados: miembros.length > 0 }, { headers })
  } catch {
    return Response.json({ error: "Consulta temporalmente indisponible." }, { status: 503, headers })
  }
}
