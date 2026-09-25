import { NextResponse } from "next/server"
import { type Member, type RegistrationPayload, toCamelCase, validateInscripcion } from "@/lib/inscripcion"
import { INSCRIPCIONES_BUCKET, supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MEMBER_DOC_KEYS = ["compromiso", "dniFile", "reporteNotas", "fichaMatricula"] as const
const PERSONERO_DOC_KEYS = ["compromiso", "dniFile", "fichaMatricula"] as const

function isStoredFile(value: unknown): value is { name: string; path: string } {
  return !!value && typeof value === "object" && typeof (value as { name?: unknown }).name === "string" && typeof (value as { path?: unknown }).path === "string"
}

function asValidatedFile(file: { name: string; path: string } | undefined): File | null {
  if (!file) return null
  return new File(["ok"], file.name, { type: file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "" })
}

function toMember(member: RegistrationPayload["members"][number] | RegistrationPayload["personero"], keys: readonly string[]): Member {
  const paths = member.paths
  return {
    id: member.id, nombres: member.nombres, apellidos: member.apellidos, codigo: member.codigo, dni: member.dni, cargo: member.cargo,
    files: {
      compromiso: asValidatedFile(isStoredFile(paths.compromiso) ? paths.compromiso : undefined),
      dniFile: asValidatedFile(isStoredFile(paths.dniFile) ? paths.dniFile : undefined),
      reporteNotas: keys.includes("reporteNotas") ? asValidatedFile(isStoredFile(paths.reporteNotas) ? paths.reporteNotas : undefined) : null,
      fichaMatricula: asValidatedFile(isStoredFile(paths.fichaMatricula) ? paths.fichaMatricula : undefined),
    },
  }
}

function hasExpectedPath(path: string, code: string, suffix: string) {
  return path === `${code}/${suffix}`
}

function hasSafeFileName(name: string) {
  return name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== ".."
}

/** Returns every uploaded object the registration is allowed to reference. */
function expectedFiles(payload: RegistrationPayload): { name: string; path: string }[] | null {
  const files: { name: string; path: string }[] = [payload.formatoInscripcion, payload.reciboPago]
  if (payload.logoPath) {
    const logoName = payload.logoPath.split("/").at(-1)
    if (
      !logoName ||
      !hasSafeFileName(logoName) ||
      !logoName.startsWith("logo.") ||
      payload.logoPath !== `${payload.code}/general/${logoName}`
    ) return null
    files.push({ name: logoName, path: payload.logoPath })
  }

  const addMemberFiles = (
    member: RegistrationPayload["members"][number] | RegistrationPayload["personero"],
    keys: readonly string[],
    section: "integrantes" | "personero",
  ) => {
    for (const key of keys) {
      const file = member.paths[key]
      if (!isStoredFile(file) || !hasSafeFileName(file.name) || !hasExpectedPath(file.path, payload.code, `${section}/${member.dni}/${file.name}`)) return false
      files.push(file)
    }
    return true
  }

  if (!addMemberFiles(payload.personero, PERSONERO_DOC_KEYS, "personero")) return null
  for (const member of payload.members) {
    if (!addMemberFiles(member, MEMBER_DOC_KEYS, "integrantes")) return null
  }
  return files.every((file) => hasSafeFileName(file.name)) ? files : null
}

/** Storage can acknowledge an object whose body was interrupted. Refuse zero-byte objects. */
async function verifyStoredFiles(files: { name: string; path: string }[]) {
  await Promise.all(files.map(async (file) => {
    const folder = file.path.slice(0, -(file.name.length + 1))
    const { data, error } = await supabaseAdmin.storage.from(INSCRIPCIONES_BUCKET).list(folder, {
      search: file.name,
      limit: 100,
    })
    if (error) throw error
    const stored = data.find((item) => item.name === file.name)
    const size = Number(stored?.metadata?.size ?? 0)
    if (!stored || !Number.isFinite(size) || size <= 0) {
      throw new Error(`No se pudo comprobar el contenido de «${file.name}». Vuelve a adjuntarlo e inténtalo de nuevo.`)
    }
  }))
}

export async function POST(request: Request) {
  let payload: RegistrationPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: "Petición JSON inválida." }, { status: 400 })
  }

  if (!/^INS-\d{8}-[A-F0-9]{6}$/.test(payload.code) || !isStoredFile(payload.formatoInscripcion) || !isStoredFile(payload.reciboPago) || !payload.personero || !Array.isArray(payload.members)) {
    return NextResponse.json({ ok: false, message: "Estructura de inscripción inválida." }, { status: 400 })
  }

  const members = payload.members.map((member) => toMember(member, MEMBER_DOC_KEYS))
  const personero = toMember(payload.personero, PERSONERO_DOC_KEYS)
  const errors = validateInscripcion(payload.nombreLista, asValidatedFile(payload.formatoInscripcion), asValidatedFile(payload.reciboPago), members, personero)
  if (Object.keys(errors).length > 0) return NextResponse.json({ ok: false, message: "Errores en el formulario.", errors }, { status: 400 })

  const code = payload.code
  if (!hasSafeFileName(payload.formatoInscripcion.name) || !hasSafeFileName(payload.reciboPago.name) ||
      !hasExpectedPath(payload.formatoInscripcion.path, code, `general/${payload.formatoInscripcion.name}`) ||
      !hasExpectedPath(payload.reciboPago.path, code, `general/${payload.reciboPago.name}`) ||
      (payload.logoPath !== null && !payload.logoPath.startsWith(`${code}/general/logo.`))) {
    return NextResponse.json({ ok: false, message: "Las rutas de documentos no son válidas." }, { status: 400 })
  }

  const files = expectedFiles(payload)
  if (!files) return NextResponse.json({ ok: false, message: "Las rutas de documentos no son válidas." }, { status: 400 })

  let createdListId: string | number | null = null
  try {
    await verifyStoredFiles(files)
    const { data: lista, error: listaError } = await supabaseAdmin.from("listas").insert({
      code, nombre: payload.nombreLista.trim(), nombre_camel_case: toCamelCase(payload.nombreLista),
      ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      logo_path: payload.logoPath, formato_inscripcion_path: payload.formatoInscripcion.path, recibo_pago_path: payload.reciboPago.path,
    }).select("id").single()
    if (listaError || !lista) throw listaError || new Error("No se pudo crear la lista.")
    createdListId = lista.id

    const row = (member: RegistrationPayload["members"][number] | RegistrationPayload["personero"], orden: number, es_personero: boolean) => ({
      lista_id: lista.id, cargo: member.cargo, nombres: member.nombres.trim(), apellidos: member.apellidos.trim(), codigo_universitario: member.codigo.trim(), dni: member.dni.trim(), orden, es_personero,
      carta_compromiso_path: member.paths.compromiso?.path ?? null, copia_dni_path: member.paths.dniFile?.path ?? null,
      reporte_notas_path: member.paths.reporteNotas?.path ?? null, ficha_matricula_path: member.paths.fichaMatricula?.path ?? null,
    })
    const rows = [row(payload.personero, 0, true), ...payload.members.map((member, index) => row(member, index + 1, false))]
    const { error: integrantesError } = await supabaseAdmin.from("integrantes").insert(rows)
    if (integrantesError) throw integrantesError
    return NextResponse.json({ ok: true, code }, { status: 201 })
  } catch (error) {
    if (createdListId !== null) {
      const { error: rollbackError } = await supabaseAdmin.from("listas").delete().eq("id", createdListId)
      if (rollbackError) console.error("[Inscripcion Rollback Error]:", rollbackError)
    }
    console.error("[Inscripcion Error]:", error)
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Ocurrió un error al registrar la lista." }, { status: 500 })
  }
}
