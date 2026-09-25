/**
 * Reglas de la inscripción de listas.
 *
 * CONVENCIÓN DE NOMBRES DE ARCHIVO (todo en PDF):
 *
 *   Documentos de la lista (sigla + nombre de la plancha):
 *     FI_NombrePlancha.pdf              Formato de inscripción
 *     RP_NombrePlancha.pdf              Recibo de pago
 *
 *   Documentos de cada integrante (llevan además el DNI del integrante):
 *     CC_NombrePlancha_NroDNI.pdf       Carta de compromiso
 *     DNI_NombrePlancha_NroDNI.pdf      Copia de DNI
 *     RN_NombrePlancha_NroDNI.pdf       Reporte de notas
 *     FM_NombrePlancha_NroDNI.pdf       Ficha de matrícula
 *
 *   NombrePlancha va en CamelCase: si el nombre de la lista tiene espacios,
 *   las palabras se unen con la inicial en mayúscula y sin tildes.
 *     "Innovación y Desarrollo EPIS"  ->  InnovacionYDesarrolloEPIS
 *
 * Si quieres otra convención, cambia SOLO la tabla DOCS y la función buildRegex.
 */

import type { DocSpec, Errors } from "@/data/types"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                     */
/* -------------------------------------------------------------------------- */

export type MemberFiles = {
  compromiso: File | null
  dniFile: File | null
  reporteNotas: File | null
  fichaMatricula: File | null
}

export type Member = {
  id: string
  nombres: string
  apellidos: string
  codigo: string
  dni: string
  cargo: string
  files: MemberFiles
}

export type DocKind =
  | "formato"
  | "recibo"
  | "compromiso"
  | "dni"
  | "reporteNotas"
  | "fichaMatricula"

/* -------------------------------------------------------------------------- */
/*  Configuración de documentos                                               */
/* -------------------------------------------------------------------------- */

export const MAX_PDF_SIZE = 5 * 1024 * 1024 // 5 MB por archivo

/** sigla = prefijo del nombre; perMember = lleva el DNI del integrante al final. */
const DOCS: Record<DocKind, { sigla: string; perMember: boolean }> = {
  formato: { sigla: "FI", perMember: false },
  recibo: { sigla: "RP", perMember: false },
  compromiso: { sigla: "CC", perMember: true },
  dni: { sigla: "DNI", perMember: true },
  reporteNotas: { sigla: "RN", perMember: true },
  fichaMatricula: { sigla: "FM", perMember: true },
}

// Nombre de la plancha en CamelCase: solo letras y números, sin espacios,
// guiones ni guion bajo (el "_" separa las partes del nombre del archivo).
const PLANCHA = "[A-Za-z0-9]+"

function buildRegex(kind: DocKind): RegExp {
  const { sigla, perMember } = DOCS[kind]
  const dni = perMember ? "_\\d{8}" : ""
  return new RegExp(`^${sigla}_${PLANCHA}${dni}\\.pdf$`, "i")
}

export const REGEX_FORMATO_INSCRIPCION = buildRegex("formato")
export const REGEX_RECIBO = buildRegex("recibo")
export const REGEX_CARTA_COMPROMISO = buildRegex("compromiso")
export const REGEX_DNI_FILE = buildRegex("dni")
export const REGEX_REPORTE_NOTAS = buildRegex("reporteNotas")
export const REGEX_FICHA_MATRICULA = buildRegex("fichaMatricula")

/** Textos que tu página muestra como "Nombre esperado". */
export const EXPECTED_PATTERNS = {
  formato: "FI_NombrePlancha.pdf",
  recibo: "RP_NombrePlancha.pdf",
  compromiso: "CC_NombrePlancha_NroDNI.pdf",
  dni: "DNI_NombrePlancha_NroDNI.pdf",
  reporteNotas: "RN_NombrePlancha_NroDNI.pdf",
  fichaMatricula: "FM_NombrePlancha_NroDNI.pdf",
} as const

/* -------------------------------------------------------------------------- */
/*  Utilidades                                                                */
/* -------------------------------------------------------------------------- */

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

/** Padding a dos dígitos: `1` → `"01"`. */
export const pad = (n: number): string => String(n).padStart(2, "0")

/** "Innovación y Desarrollo-EPIS" -> "innovacionydesarrolloepis" (para comparar). */
function normalizeToken(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
}

/** "Innovación y Desarrollo EPIS" -> "InnovacionYDesarrolloEPIS" */
export function toCamelCase(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
}

/** Nombre sugerido para el archivo, listo para copiar: "FI_InnovacionYDesarrolloEPIS.pdf" */
export function suggestFileName(kind: DocKind, nombreLista: string, dni?: string): string {
  const { sigla, perMember } = DOCS[kind]
  const plancha = toCamelCase(nombreLista) || "NombrePlancha"
  return perMember
    ? `${sigla}_${plancha}_${dni && /^\d{8}$/.test(dni) ? dni : "NroDNI"}.pdf`
    : `${sigla}_${plancha}.pdf`
}

/** Separa un nombre que YA cumple la regex en sus partes (SIGLA_Plancha[_DNI]). */
function fileParts(name: string) {
  const parts = name.replace(/\.pdf$/i, "").split("_")
  return {
    plancha: normalizeToken(parts[1] ?? ""),
    dni: parts.length === 3 ? parts[2] : undefined,
  }
}

/* -------------------------------------------------------------------------- */
/*  Factories de integrantes                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Lista ordenada de cargos para la inscripción.
 * Se importa desde `data/inscripcion.ts` en la UI; aquí la usamos para las factories.
 */
const CARGOS = [
  "Presidente",
  "Vicepresidente",
  "Secretario(a) de Organización",
  "Secretario(a) de Actas y Archivos",
  "Coordinador(a) de Tecnología y Desarrollo",
  "Coordinador(a) Académico(a)",
  "Coordinador(a) de Economía",
  "Coordinador(a) de Prensa y Propaganda",
  "Coordinador(a) de Relaciones Públicas",
  "Coordinador(a) de Deportes 1",
  "Coordinador(a) de Deportes 2",
  "Coordinador(a) de Eventos Culturales",
  "Vocal 1",
  "Vocal 2",
]

export const cargoFor = (index: number): string =>
  `Candidato / ${CARGOS[index] ?? `Cargo adicional ${index + 1}`}`

export const cargoTituloFor = (index: number): string =>
  CARGOS[index] ?? `Cargo adicional ${index + 1}`

export const createMember = (id: string, index: number): Member => ({
  id,
  nombres: "",
  apellidos: "",
  codigo: "",
  dni: "",
  cargo: cargoFor(index),
  files: { compromiso: null, dniFile: null, reporteNotas: null, fichaMatricula: null },
})

export const createPersonero = (): Member => ({
  id: "personero",
  nombres: "",
  apellidos: "",
  codigo: "",
  dni: "",
  cargo: "Personero General de la Lista",
  files: { compromiso: null, dniFile: null, reporteNotas: null, fichaMatricula: null },
})

/* -------------------------------------------------------------------------- */
/*  Validación del logotipo                                                   */
/* -------------------------------------------------------------------------- */

const LOGO_REQUIRED = true
const MAX_LOGO_SIZE = 5 * 1024 * 1024
const LOGO_TYPES = ["image/png", "image/jpeg", "image/jpg"]
const LOGO_EXT = /\.(png|jpe?g)$/i

export function validateLogo(file: File | null): string | null {
  if (!file) return LOGO_REQUIRED ? "Adjunta el logotipo de la lista (PNG, JPG o JPEG)." : null
  const extOk = LOGO_EXT.test(file.name)
  const typeOk = !file.type || LOGO_TYPES.includes(file.type)
  if (!extOk || !typeOk) return "El logotipo debe estar en formato PNG, JPG o JPEG."
  if (file.size > MAX_LOGO_SIZE) return `El logotipo no debe superar los ${formatBytes(MAX_LOGO_SIZE)}.`
  return null
}

/* -------------------------------------------------------------------------- */
/*  Validación de un archivo                                                  */
/* -------------------------------------------------------------------------- */

/** Devuelve el mensaje de error, o null si el archivo es válido. */
export function validateFile(
  file: File | null,
  regex: RegExp,
  expectedPattern: string,
  label: string,
): string | null {
  if (!file) return `Adjunta el documento: ${label}.`

  const isPdf =
    file.name.toLowerCase().endsWith(".pdf") && (file.type === "" || file.type === "application/pdf")
  if (!isPdf) return `${label}: solo se aceptan archivos PDF.`

  if (file.size === 0) return `${label}: el archivo está vacío.`
  if (file.size > MAX_PDF_SIZE) {
    return `${label}: pesa ${formatBytes(file.size)} y el máximo es ${formatBytes(MAX_PDF_SIZE)}.`
  }

  regex.lastIndex = 0
  if (!regex.test(file.name)) {
    return `${label}: el nombre «${file.name}» no cumple el formato ${expectedPattern}`
  }

  return null
}

/* -------------------------------------------------------------------------- */
/*  Cálculo de progreso por integrante                                        */
/* -------------------------------------------------------------------------- */

/**
 * Calcula cuántos requisitos (datos + documentos) tiene completados un integrante.
 * Se usa para los anillos de progreso y el panel de resumen.
 */
export function memberProgress(
  m: Member,
  errors: Errors,
  docs: DocSpec[],
  errorPrefix = "m",
): { done: number; total: number; dataDone: number; docsDone: number } {
  const data = [
    m.nombres.trim().length > 0,
    m.apellidos.trim().length > 0,
    m.codigo.length === 8,
    m.dni.length === 8,
  ]
  const completedDocs = docs.map((d) => !!m.files[d.key] && !errors[`${errorPrefix}_${m.id}_${d.key}`])
  const dataDone = data.filter(Boolean).length
  const docsDone = completedDocs.filter(Boolean).length
  return { done: dataDone + docsDone, total: data.length + docs.length, dataDone, docsDone }
}

/* -------------------------------------------------------------------------- */
/*  Validación completa de la inscripción                                     */
/* -------------------------------------------------------------------------- */

const NAME_REGEX = /^[\p{L}\s.'-]+$/u

const MEMBER_DOCS_VALIDATION: { key: keyof MemberFiles; kind: DocKind; regex: RegExp; label: string }[] = [
  { key: "compromiso", kind: "compromiso", regex: REGEX_CARTA_COMPROMISO, label: "Carta de Compromiso" },
  { key: "dniFile", kind: "dni", regex: REGEX_DNI_FILE, label: "Copia de DNI" },
  { key: "reporteNotas", kind: "reporteNotas", regex: REGEX_REPORTE_NOTAS, label: "Reporte de Notas" },
  { key: "fichaMatricula", kind: "fichaMatricula", regex: REGEX_FICHA_MATRICULA, label: "Ficha de Matrícula" },
]

const PERSONERO_DOCS_VALIDATION = MEMBER_DOCS_VALIDATION.filter(
  (d) => d.key === "compromiso" || d.key === "dniFile" || d.key === "fichaMatricula",
)

/**
 * Valida todo el expediente. Devuelve un objeto de errores con las claves que
 * usa tu página: nombreLista, formatoInscripcion, reciboPago,
 * m_<id>_nombres | apellidos | codigo | dni | compromiso | dniFile | reporteNotas | fichaMatricula
 * p_<id>_nombres | ... (para el personero)
 * Si el objeto queda vacío, todo está correcto.
 */
export function validateInscripcion(
  nombreLista: string,
  formatoInscripcion: File | null,
  reciboPago: File | null,
  members: Member[],
  personero?: Member,
): Record<string, string> {
  const errors: Record<string, string> = {}

  // --- Lista -------------------------------------------------------------
  const lista = nombreLista.trim()
  if (!lista) errors.nombreLista = "Escribe el nombre de la lista o plancha."
  else if (lista.length < 3) errors.nombreLista = "El nombre debe tener al menos 3 caracteres."
  else if (lista.length > 80) errors.nombreLista = "El nombre no puede pasar de 80 caracteres."
  else if (!normalizeToken(lista)) errors.nombreLista = "El nombre debe incluir letras o números."

  const planchaKey = errors.nombreLista ? "" : normalizeToken(lista)

  /** Además de la regex, el archivo debe llevar el nombre de la plancha (en CamelCase). */
  const checkPlancha = (file: File, label: string, kind: DocKind, dni?: string): string | null =>
    planchaKey && fileParts(file.name).plancha !== planchaKey
      ? `${label}: el nombre del archivo debe incluir la plancha «${lista}». Ejemplo: ${suggestFileName(kind, lista, dni)}`
      : null

  // --- Documentos de la lista (SIGLA_Plancha) ---------------------------
  const general: [string, File | null, DocKind, RegExp, string][] = [
    ["formatoInscripcion", formatoInscripcion, "formato", REGEX_FORMATO_INSCRIPCION, "Formato de inscripción"],
    ["reciboPago", reciboPago, "recibo", REGEX_RECIBO, "Recibo de pago"],
  ]
  for (const [key, file, kind, regex, label] of general) {
    const msg = validateFile(file, regex, EXPECTED_PATTERNS[kind], label)
    if (msg) errors[key] = msg
    else if (file) {
      const plancha = checkPlancha(file, label, kind)
      if (plancha) errors[key] = plancha
    }
  }

  // --- Helper para validar los documentos de un integrante ---------------
  const validateMemberDocs = (
    m: Member,
    index: number,
    prefix: string,
    docs: typeof MEMBER_DOCS_VALIDATION,
    seenDni: Map<string, number>,
    seenCodigo: Map<string, number>,
  ) => {
    const k = (field: string) => `${prefix}_${m.id}_${field}`

    for (const field of ["nombres", "apellidos"] as const) {
      const value = m[field].trim()
      const name = field === "nombres" ? "los nombres" : "los apellidos"
      if (!value) errors[k(field)] = `Escribe ${name}.`
      else if (value.length < 2) errors[k(field)] = "Muy corto."
      else if (value.length > 60) errors[k(field)] = "Máximo 60 caracteres."
      else if (!NAME_REGEX.test(value)) errors[k(field)] = "Solo letras y espacios."
    }

    const codigo = m.codigo.trim()
    if (!codigo) errors[k("codigo")] = "Escribe el código."
    else if (!/^\d{8}$/.test(codigo)) errors[k("codigo")] = "Deben ser 8 dígitos."
    else if (seenCodigo.has(codigo)) errors[k("codigo")] = `Repetido con el integrante #${seenCodigo.get(codigo)}.`
    else seenCodigo.set(codigo, index + 1)

    const dni = m.dni.trim()
    if (!dni) errors[k("dni")] = "Escribe el DNI."
    else if (!/^\d{8}$/.test(dni)) errors[k("dni")] = "Deben ser 8 dígitos."
    else if (seenDni.has(dni)) errors[k("dni")] = `Repetido con el integrante #${seenDni.get(dni)}.`
    else seenDni.set(dni, index + 1)

    // Documentos del integrante (SIGLA_Plancha_DNI)
    for (const doc of docs) {
      const file = m.files[doc.key]
      const msg = validateFile(file, doc.regex, EXPECTED_PATTERNS[doc.kind], doc.label)
      if (msg) {
        errors[k(doc.key)] = msg
        continue
      }
      if (!file) continue

      const plancha = checkPlancha(file, doc.label, doc.kind, dni)
      if (plancha) {
        errors[k(doc.key)] = plancha
        continue
      }

      // El DNI del nombre del archivo debe ser el del integrante.
      if (/^\d{8}$/.test(dni) && fileParts(file.name).dni !== dni) {
        errors[k(doc.key)] = `${doc.label}: el DNI del archivo no coincide con el del integrante (${dni}).`
      }
    }
  }

  // --- Integrantes -------------------------------------------------------
  const seenDni = new Map<string, number>()
  const seenCodigo = new Map<string, number>()

  // Validar el personero primero (si se proporcionó)
  if (personero) {
    validateMemberDocs(personero, 0, "p", PERSONERO_DOCS_VALIDATION, seenDni, seenCodigo)
  }

  // Validar cada integrante
  members.forEach((m, index) => {
    validateMemberDocs(m, index, "m", MEMBER_DOCS_VALIDATION, seenDni, seenCodigo)
  })

  return errors
}

/* -------------------------------------------------------------------------- */
/*  Carga directa y registro ligero                                          */
/* -------------------------------------------------------------------------- */

/**
 * Arma el FormData listo para enviarse al Route Handler `/api/inscripcion`.
 * Las claves coinciden con las que parsea `route.ts`.
 */
export type StoredFile = {
  name: string
  path: string
}

export type RegistrationPayload = {
  code: string
  nombreLista: string
  logoPath: string | null
  formatoInscripcion: StoredFile
  reciboPago: StoredFile
  members: Array<Omit<Member, "files"> & { paths: Record<string, StoredFile> }>
  personero: Omit<Member, "files"> & { paths: Record<string, StoredFile> }
}

type UploadProgress = {
  completed: number
  total: number
  fileName: string
}

/**
 * Convierte explícitamente el File seleccionado a bytes antes de entregarlo al
 * SDK. Esto evita que ciertos navegadores/subidas directas envíen un cuerpo
 * vacío para archivos que siguen referenciados por un input oculto.
 */
async function fileToUploadBytes(file: File): Promise<ArrayBuffer> {
  if (file.size === 0) throw new Error(`El archivo «${file.name}» está vacío.`)

  const bytes = await file.arrayBuffer()
  if (bytes.byteLength !== file.size) {
    throw new Error(`No se pudieron leer correctamente los datos de «${file.name}». Selecciónalo otra vez.`)
  }

  return bytes
}

/** Genera una carpeta única que agrupa todos los documentos de una inscripción. */
function makeRegistrationCode(): string {
  const ymd = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  return `INS-${ymd}-${crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`
}

/**
 * Valida previamente el formulario en la UI y luego sube cada archivo, de uno
 * en uno, a Supabase Storage. No envía PDFs a Vercel.
 */
export async function uploadAndRegister(
  nombreLista: string,
  logo: File | null,
  formato: File | null,
  recibo: File | null,
  members: Member[],
  personero: Member,
  memberDocKeys: readonly { key: keyof MemberFiles }[],
  personeroDocKeys: readonly { key: keyof MemberFiles }[],
  onProgress: (progress: UploadProgress) => void,
): Promise<void> {
  if (!formato || !recibo) throw new Error("Faltan documentos obligatorios.")
  const code = makeRegistrationCode()
  const uploads: Array<{ file: File; path: string }> = []
  if (logo) uploads.push({ file: logo, path: `${code}/general/logo.${logo.name.split(".").pop() || "png"}` })
  uploads.push(
    { file: formato, path: `${code}/general/${formato.name}` },
    { file: recibo, path: `${code}/general/${recibo.name}` },
  )
  members.forEach((member) => memberDocKeys.forEach((doc) => {
    const file = member.files[doc.key]
    if (file) uploads.push({ file, path: `${code}/integrantes/${member.dni}/${file.name}` })
  }))
  personeroDocKeys.forEach((doc) => {
    const file = personero.files[doc.key]
    if (file) uploads.push({ file, path: `${code}/personero/${personero.dni}/${file.name}` })
  })

  const supabase = getSupabaseBrowserClient()
  const uploadedPaths: string[] = []
  try {
    for (let index = 0; index < uploads.length; index += 1) {
      const upload = uploads[index]
      onProgress({ completed: index, total: uploads.length, fileName: upload.file.name })
      const body = await fileToUploadBytes(upload.file)
      const { error } = await supabase.storage.from("inscripciones").upload(upload.path, body, {
        contentType: upload.file.type || "application/pdf",
        cacheControl: "3600",
        upsert: false,
      })
      if (error) {
        throw new Error(`Supabase rechazó «${upload.file.name}» (${formatBytes(upload.file.size)}): ${error.message}`)
      }
      uploadedPaths.push(upload.path)
      onProgress({ completed: index + 1, total: uploads.length, fileName: upload.file.name })
    }

    const stored = (file: File, path: string): StoredFile => ({ name: file.name, path })
    const payload: RegistrationPayload = {
      code,
      nombreLista: nombreLista.trim(),
      logoPath: logo ? `${code}/general/logo.${logo.name.split(".").pop() || "png"}` : null,
      formatoInscripcion: stored(formato, `${code}/general/${formato.name}`),
      reciboPago: stored(recibo, `${code}/general/${recibo.name}`),
      members: members.map((member) => ({
        id: member.id, nombres: member.nombres.trim(), apellidos: member.apellidos.trim(), codigo: member.codigo.trim(), dni: member.dni.trim(), cargo: member.cargo,
        paths: Object.fromEntries(memberDocKeys.map((doc) => {
          const file = member.files[doc.key]!
          return [doc.key, stored(file, `${code}/integrantes/${member.dni}/${file.name}`)]
        })),
      })),
      personero: {
        id: personero.id, nombres: personero.nombres.trim(), apellidos: personero.apellidos.trim(), codigo: personero.codigo.trim(), dni: personero.dni.trim(), cargo: personero.cargo,
        paths: Object.fromEntries(personeroDocKeys.map((doc) => {
          const file = personero.files[doc.key]!
          return [doc.key, stored(file, `${code}/personero/${personero.dni}/${file.name}`)]
        })),
      },
    }

    const res = await fetch("/api/inscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  if (!res.ok) {
    const data = await res.json().catch(() => null)

    throw new Error(
      data?.message || "No pudimos registrar la lista. Inténtalo de nuevo en unos minutos.",
    )
    }
  } catch (error) {
    if (uploadedPaths.length > 0) await supabase.storage.from("inscripciones").remove(uploadedPaths)
    throw error
  }
}
