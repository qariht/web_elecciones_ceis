/**
 * Validación del formulario de inscripción simple (un solo expediente).
 * Compartida entre el formulario (cliente) y el Route Handler (servidor).
 * El servidor SIEMPRE vuelve a validar: lo que llega desde el navegador nunca es de fiar.
 *
 * Nota: la página de integrantes usa `lib/inscripcion.ts`; este archivo es independiente.
 */

export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
export const ALLOWED_EXTENSIONS = [".pdf", ".zip", ".rar"] as const

export type InscripcionFields = {
  listaName: string
  lema: string
  personero: string
  dni: string
  celular: string
  email: string
  declaracion: boolean
}

export type FieldKey = keyof InscripcionFields | "expediente"
export type FieldErrors = Partial<Record<FieldKey, string>>

export function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".")
  return i === -1 ? "" : filename.slice(i).toLowerCase()
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

const NAME_REGEX = /^[\p{L}\s.'-]+$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateFields(v: InscripcionFields): FieldErrors {
  const e: FieldErrors = {}

  const lista = v.listaName.trim()
  if (!lista) e.listaName = "Escribe el nombre de la lista."
  else if (lista.length < 3) e.listaName = "El nombre debe tener al menos 3 caracteres."
  else if (lista.length > 80) e.listaName = "El nombre no puede pasar de 80 caracteres."

  if (v.lema.trim().length > 200) e.lema = "El lema no puede pasar de 200 caracteres."

  const personero = v.personero.trim()
  if (!personero) e.personero = "Escribe el nombre completo del personero."
  else if (personero.length < 5) e.personero = "Escribe nombres y apellidos completos."
  else if (personero.length > 100) e.personero = "El nombre no puede pasar de 100 caracteres."
  else if (!NAME_REGEX.test(personero)) e.personero = "Usa solo letras, espacios y signos como . ' -"

  if (!v.dni) e.dni = "Escribe el DNI del personero."
  else if (!/^\d{8}$/.test(v.dni)) e.dni = "El DNI debe tener exactamente 8 dígitos."

  if (!v.celular) e.celular = "Escribe un número de celular."
  else if (!/^9\d{8}$/.test(v.celular)) e.celular = "Debe tener 9 dígitos y empezar con 9."

  const email = v.email.trim()
  if (!email) e.email = "Escribe un correo de contacto."
  else if (email.length > 120 || !EMAIL_REGEX.test(email)) e.email = "Escribe un correo válido, por ejemplo nombre@dominio.com."

  if (!v.declaracion) e.declaracion = "Debes confirmar la declaración para continuar."

  return e
}

export function validateFile(file: { name: string; size: number } | null): string | undefined {
  if (!file) return "Adjunta el expediente en PDF, ZIP o RAR."
  const ext = getExtension(file.name)
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return "Formato no admitido. Sube un archivo PDF, ZIP o RAR."
  }
  if (file.size === 0) return "El archivo está vacío."
  if (file.size > MAX_FILE_SIZE) {
    return `El archivo pesa ${formatBytes(file.size)} y el máximo es ${formatBytes(MAX_FILE_SIZE)}.`
  }
  return undefined
}