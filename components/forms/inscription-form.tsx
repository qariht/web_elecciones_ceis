"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, CSSProperties, DragEvent, FormEvent, ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion"
import {
  AlertCircle,
  Check,
  Copy,
  FileArchive,
  FileText,
  ImageIcon,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  MAX_FILE_SIZE,
  formatBytes,
  getExtension,
  validateFields,
  validateFile,
  type FieldErrors,
  type FieldKey,
  type InscripcionFields,
} from "@/lib/inscripcion-form"

/* -------------------------------------------------------------------------- */
/*  Tokens                                                                    */
/* -------------------------------------------------------------------------- */

const BRAND_THEME = {
  "--brand-navy": "#101F36",
  "--brand-gold": "#C6A24B",
  "--brand-gold-soft": "#FAEEC6",
  "--background": "#FFFFFF",
  "--foreground": "#12161D",
  "--card": "#FFFFFF",
  "--card-foreground": "#12161D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#12161D",
  "--primary": "#101F36",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F5F7FA",
  "--secondary-foreground": "#101F36",
  "--muted": "#F5F7FA",
  "--muted-foreground": "#566275",
  "--accent": "#FAEEC6",
  "--accent-foreground": "#101F36",
  "--border": "#DCE2EA",
  "--input": "#DCE2EA",
  "--ring": "#C6A24B",
} as CSSProperties

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Grilla arquitectónica del hero, desvanecida hacia la izquierda. */
const GRID_FADE =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#101f360a_1px,transparent_1px),linear-gradient(to_bottom,#101f360a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_left,#000_0%,transparent_75%)]"

/** Fondo de tablero para que las transparencias de un PNG se noten. */
const CHECKER: CSSProperties = {
  backgroundColor: "#FFFFFF",
  backgroundImage:
    "linear-gradient(45deg,#EEF1F5 25%,transparent 25%,transparent 75%,#EEF1F5 75%),linear-gradient(45deg,#EEF1F5 25%,transparent 25%,transparent 75%,#EEF1F5 75%)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0, 7px 7px",
}

const MAX_LOGO_SIZE = 5 * 1024 * 1024
const LOGO_TYPES = ["image/png", "image/jpeg", "image/jpg"]
const LOGO_EXT = /\.(png|jpe?g)$/i

/** Campos que cuentan para el medidor de avance (el lema es opcional). */
const REQUIRED_KEYS: FieldKey[] = [
  "listaName",
  "personero",
  "dni",
  "celular",
  "email",
  "expediente",
  "declaracion",
]

const INITIAL_VALUES: InscripcionFields = {
  listaName: "",
  lema: "",
  personero: "",
  dni: "",
  celular: "",
  email: "",
  declaracion: false,
}

const FOCUS_ORDER: (FieldKey | "logo")[] = [
  "listaName",
  "lema",
  "logo",
  "personero",
  "dni",
  "celular",
  "email",
  "expediente",
  "declaracion",
]

const groupsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
}

const groupItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

function validateLogo(file: File): string | null {
  const extOk = LOGO_EXT.test(file.name)
  const typeOk = !file.type || LOGO_TYPES.includes(file.type)
  if (!extOk || !typeOk) return "El logotipo debe estar en formato PNG, JPG o JPEG."
  if (file.size > MAX_LOGO_SIZE) return `El logotipo no debe superar los ${formatBytes(MAX_LOGO_SIZE)}.`
  return null
}

/* -------------------------------------------------------------------------- */
/*  Envío con progreso real (XHR)                                             */
/* -------------------------------------------------------------------------- */

class UploadError extends Error {
  fieldErrors?: FieldErrors
  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message)
    this.fieldErrors = fieldErrors
  }
}

type ApiResponse = { ok?: boolean; code?: string; message?: string; errors?: FieldErrors } | null

function sendInscripcion(
  body: FormData,
  onProgress: (percent: number) => void,
  xhrRef: { current: XMLHttpRequest | null },
): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr

    xhr.open("POST", "/api/inscripcion")
    xhr.responseType = "json"
    xhr.timeout = 5 * 60 * 1000

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }

    xhr.onload = () => {
      const data = xhr.response as ApiResponse
      if (xhr.status >= 200 && xhr.status < 300 && data?.ok && data.code) {
        resolve({ code: data.code })
        return
      }
      const fallback =
        xhr.status === 413
          ? "El archivo supera el límite que acepta el servidor."
          : "No pudimos registrar la inscripción. Inténtalo de nuevo en unos minutos."
      reject(new UploadError(data?.message ?? fallback, data?.errors))
    }
    xhr.onerror = () =>
      reject(new UploadError("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo."))
    xhr.ontimeout = () =>
      reject(new UploadError("La subida tardó demasiado. Prueba con un archivo más liviano o con mejor conexión."))
    xhr.onabort = () => reject(new UploadError("Subida cancelada."))

    xhr.send(body)
  })
}

/* -------------------------------------------------------------------------- */
/*  Piezas pequeñas                                                           */
/* -------------------------------------------------------------------------- */

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key={message}
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-start gap-1.5 overflow-hidden text-xs font-medium text-destructive"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-xs font-semibold text-[var(--brand-navy)]">
          {label}
        </Label>
        {optional && <span className="font-mono text-[11px] text-[var(--muted-foreground)]">Opcional</span>}
      </div>
      {children}
      {hint && !error && <p className="text-[11px] text-[var(--muted-foreground)]">{hint}</p>}
      <FieldError id={id} message={error} />
    </div>
  )
}

function Group({
  index,
  title,
  badge,
  children,
}: {
  index: string
  title: string
  badge?: string
  children: ReactNode
}) {
  return (
    <motion.section variants={groupItem} className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[var(--brand-navy)] font-mono text-[11px] font-bold text-white">
          {index}
        </span>
        <h3 className="text-sm font-semibold tracking-tight text-[var(--brand-navy)]">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
        {badge && <span className="font-mono text-[11px] text-[var(--muted-foreground)]">{badge}</span>}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.section>
  )
}

function FormatChips({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {items.map((t) => (
        <span
          key={t}
          className="rounded border border-[var(--border)] bg-[var(--secondary)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

/** Cuatro esquinas doradas que se cierran cuando el usuario arrastra un archivo. */
function Corners({ active }: { active: boolean }) {
  const base = "pointer-events-none absolute size-3 border-[var(--brand-gold)] transition-all duration-200"
  const state = active ? "m-0 opacity-100" : "m-1.5 opacity-0 group-hover:m-0 group-hover:opacity-100"
  return (
    <>
      <span aria-hidden className={cn(base, state, "left-0 top-0 rounded-tl-md border-l-2 border-t-2")} />
      <span aria-hidden className={cn(base, state, "right-0 top-0 rounded-tr-md border-r-2 border-t-2")} />
      <span aria-hidden className={cn(base, state, "bottom-0 left-0 rounded-bl-md border-b-2 border-l-2")} />
      <span aria-hidden className={cn(base, state, "bottom-0 right-0 rounded-br-md border-b-2 border-r-2")} />
    </>
  )
}

function LogoPreviewImage({
  src,
  onSize,
}: {
  src: string
  onSize: (src: string, w: number, h: number) => void
}) {
  return (
    <Image
      src={src}
      alt="Vista previa del logotipo"
      fill
      unoptimized
      className="object-contain p-2"
      onLoad={(e) => onSize(src, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
    />
  )
}

function ProgressMeter({ done, total }: { done: number; total: number }) {
  return (
    <div
      className="space-y-2"
      role="progressbar"
      aria-label="Avance del formulario"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
          {done === total ? "Formulario completo, listo para enviar" : "Requisitos completados"}
        </span>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--brand-navy)]">
          {done}
          <span className="text-[var(--muted-foreground)]">/{total}</span>
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <motion.span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            initial={false}
            animate={{ backgroundColor: i < done ? "#C6A24B" : "#DCE2EA" }}
            transition={{ duration: 0.3, delay: i < done ? i * 0.03 : 0 }}
          />
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Constancia de recepción                                                   */
/* -------------------------------------------------------------------------- */

function SuccessPanel({
  code,
  lista,
  logoUrl,
  onReset,
}: {
  code: string
  lista: string
  logoUrl: string | null
  onReset: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [receivedAt] = useState(() => new Date())
  const fecha = useMemo(
    () => new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(receivedAt),
    [receivedAt],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El portapapeles puede estar bloqueado; el código sigue siendo seleccionable.
    }
  }

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <Card className="relative gap-0 overflow-hidden rounded-2xl border-[var(--brand-gold)] bg-white py-0 shadow-none">
        <div className="relative overflow-hidden bg-[var(--brand-navy)] px-6 py-4 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_left,#000,transparent_80%)]"
          />
          <div className="relative flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-white">Constancia de recepción</span>
            <span className="font-mono text-[11px] text-[var(--brand-gold)]">Mesa de Partes Virtual</span>
          </div>
        </div>

        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-gold-soft)] text-[var(--brand-navy)] ring-8 ring-[var(--brand-gold-soft)]/50">
            <motion.svg
              viewBox="0 0 52 52"
              className="size-10 stroke-[3]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <motion.circle
                cx="26"
                cy="26"
                r="23"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.path
                d="M15 27l8 8 14-16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              />
            </motion.svg>
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-[var(--brand-navy)] sm:text-2xl">
              Inscripción registrada
            </h2>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
              El expediente de la lista <strong className="text-[var(--brand-navy)]">«{lista}»</strong> quedó
              registrado en el sistema del Comité Electoral EPIS. Recibirás las observaciones o tachas por el
              correo indicado.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-left">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-[var(--border)]" style={CHECKER}>
                  <Image src={logoUrl} alt="" fill unoptimized className="object-contain p-1" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--brand-navy)]">{lista}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">Recibido el {fecha}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-[var(--border)] pt-3">
              <p className="text-[11px] font-medium text-[var(--muted-foreground)]">Código único de registro</p>
              <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-white py-1.5 pl-3 pr-1.5 shadow-2xs">
                <code className="select-all font-mono text-base font-bold tracking-wider text-[var(--brand-navy)]">
                  {code}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-[var(--muted-foreground)] hover:text-[var(--brand-navy)]"
                  onClick={copy}
                  aria-label={copied ? "Código copiado" : "Copiar código"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "ok" : "copy"}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.12 }}
                    >
                      {copied ? <Check className="size-4 stroke-[3] text-emerald-600" /> : <Copy className="size-4" />}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                Guárdalo: lo necesitarás para dar seguimiento a tachas y observaciones.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-[var(--border)] text-[var(--brand-navy)] hover:border-[var(--brand-navy)] hover:bg-[var(--secondary)]"
            onClick={onReset}
          >
            Registrar otra lista
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Formulario                                                                */
/* -------------------------------------------------------------------------- */

type Status = "idle" | "uploading" | "success" | "error"

export function InscriptionForm() {
  const [values, setValues] = useState<InscripcionFields>(INITIAL_VALUES)
  const [file, setFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoDims, setLogoDims] = useState<{ src: string; w: number; h: number } | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Partial<Record<FieldKey | "logo", boolean>>>({})
  const [attempted, setAttempted] = useState(false)
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [progress, setProgress] = useState(0)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [draggingExp, setDraggingExp] = useState(false)
  const [draggingLogo, setDraggingLogo] = useState(false)
  const [submittedLista, setSubmittedLista] = useState("")

  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const expInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => xhrRef.current?.abort(), [])

  useEffect(() => {
    if (!logoFile) return

    let cancelled = false
    const reader = new FileReader()
    reader.onload = () => {
      if (!cancelled && typeof reader.result === "string") setLogoPreview(reader.result)
    }
    reader.onerror = () => {
      if (!cancelled) setLogoPreview(null)
    }
    reader.readAsDataURL(logoFile)
    return () => {
      cancelled = true
      if (reader.readyState === FileReader.LOADING) reader.abort()
    }
  }, [logoFile])

  const busy = status === "uploading"

  const errors = useMemo<FieldErrors>(() => {
    const e = validateFields(values)
    const fileError = validateFile(file)
    if (fileError) e.expediente = fileError
    return e
  }, [values, file])

  const completed = REQUIRED_KEYS.filter((k) => !errors[k]).length

  const errorOf = (key: FieldKey) =>
    ((touched[key] || attempted) ? errors[key] : undefined) ?? serverErrors[key]

  const a11y = (key: FieldKey) => {
    const message = errorOf(key)
    return {
      "aria-invalid": message ? true : undefined,
      "aria-describedby": message ? `${key}-error` : undefined,
      className: message
        ? "border-destructive focus-visible:ring-destructive/30"
        : "border-[var(--border)] focus-visible:border-[var(--brand-gold)] focus-visible:ring-[var(--brand-gold)]/20",
    }
  }

  const touch = (key: FieldKey | "logo") => setTouched((t) => (t[key] ? t : { ...t, [key]: true }))

  const clearServerError = (key: FieldKey) =>
    setServerErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  const setField = <K extends keyof InscripcionFields>(key: K, value: InscripcionFields[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    clearServerError(key)
  }

  /* ---- Logo ------------------------------------------------------------- */

  const handleLogoFile = (f: File) => {
    touch("logo")
    const message = validateLogo(f)
    if (message) {
      setLogoError(message)
      return
    }
    setLogoError(null)
    setLogoFile(f)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoError(null)
    setLogoDims(null)
  }

  const onPickLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleLogoFile(f)
    e.target.value = ""
  }

  const onDragLogo = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDraggingLogo(true)
  }

  const onDragLeaveLogo = (e: DragEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDraggingLogo(false)
  }

  const onDropLogo = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDraggingLogo(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleLogoFile(f)
  }

  /* ---- Expediente ------------------------------------------------------- */

  const chooseFile = (f: File) => {
    setFile(f)
    touch("expediente")
    clearServerError("expediente")
  }

  const onPickExp = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) chooseFile(f)
    e.target.value = ""
  }

  const onDragExp = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDraggingExp(true)
  }

  const onDragLeaveExp = (e: DragEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDraggingExp(false)
  }

  const onDropExp = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDraggingExp(false)
    const f = e.dataTransfer.files?.[0]
    if (f) chooseFile(f)
  }

  /* ---- Envío ------------------------------------------------------------ */

  const reset = () => {
    setValues(INITIAL_VALUES)
    setFile(null)
    setLogoFile(null)
    setLogoPreview(null)
    setLogoDims(null)
    setLogoError(null)
    setTouched({})
    setAttempted(false)
    setServerErrors({})
    setServerMessage(null)
    setProgress(0)
    setCode(null)
    setStatus("idle")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return

    setAttempted(true)
    const firstInvalid = FOCUS_ORDER.find((k) => (k === "logo" ? false : errors[k as FieldKey]))
    if (firstInvalid || !file || logoError) {
      if (firstInvalid) document.getElementById(firstInvalid)?.focus()
      return
    }

    const body = new FormData()
    body.append("listaName", values.listaName.trim())
    body.append("lema", values.lema.trim())
    body.append("personero", values.personero.trim())
    body.append("dni", values.dni)
    body.append("celular", values.celular)
    body.append("email", values.email.trim())
    body.append("declaracion", String(values.declaracion))
    body.append("expediente", file)
    if (logoFile) body.append("logo", logoFile)

    setStatus("uploading")
    setProgress(0)
    setServerMessage(null)
    setServerErrors({})

    try {
      const result = await sendInscripcion(body, setProgress, xhrRef)
      setSubmittedLista(values.listaName.trim())
      setCode(result.code)
      setStatus("success")
    } catch (err) {
      const error = err instanceof UploadError ? err : new UploadError("Ocurrió un error inesperado.")
      setServerMessage(error.message)
      setServerErrors(error.fieldErrors ?? {})
      setStatus("error")
    }
  }

  const fileError = errorOf("expediente")
  const ext = file ? getExtension(file.name) : ""
  const FileIcon = ext === ".pdf" ? FileText : FileArchive
  const shownDims = logoDims && logoDims.src === logoPreview ? logoDims : null

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-2xl" style={BRAND_THEME}>
        <AnimatePresence mode="wait">
          {status === "success" && code ? (
            <SuccessPanel key="success" code={code} lista={submittedLista} logoUrl={logoPreview} onReset={reset} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <Card className="relative gap-0 overflow-hidden rounded-2xl border-[var(--border)] bg-white py-0 shadow-none">
                <motion.div
                  aria-hidden
                  className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left bg-gradient-to-r from-[var(--brand-navy)] via-[var(--brand-gold)] to-[var(--brand-navy)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                />

                <CardHeader className="relative gap-0 overflow-hidden border-b border-[var(--border)] bg-[var(--secondary)]/50 p-6 sm:p-7">
                  <div aria-hidden className={GRID_FADE} />
                  <div className="relative space-y-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">
                          Mesa de Partes Virtual
                        </span>
                        <Badge
                          variant="outline"
                          className="border-[var(--border)] bg-white/80 font-mono text-[10px] text-[var(--muted-foreground)]"
                        >
                          Convocatoria 2026
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight text-[var(--brand-navy)] sm:text-2xl">
                        Inscripción de Lista de Candidatos
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
                        Completa los datos de la lista, adjunta su símbolo y sube el expediente consolidado conforme
                        al reglamento electoral.
                      </CardDescription>
                    </div>
                    <ProgressMeter done={completed} total={REQUIRED_KEYS.length} />
                  </div>
                </CardHeader>

                <form onSubmit={handleSubmit} noValidate>
                  <CardContent className="p-6 sm:p-7">
                    <fieldset disabled={busy} className="m-0 min-w-0 border-0 p-0">
                      <motion.div
                        variants={groupsContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-9"
                      >
                        {/* ------------------------------------------------ */}
                        <Group index="I" title="Información de la plancha" badge="Datos y símbolo">
                          <Field id="listaName" label="Nombre oficial de la lista" error={errorOf("listaName")}>
                            <Input
                              id="listaName"
                              name="listaName"
                              autoComplete="off"
                              placeholder="Ej. Innovación y Unidad EPIS"
                              value={values.listaName}
                              maxLength={80}
                              onChange={(e) => setField("listaName", e.target.value)}
                              onBlur={() => touch("listaName")}
                              {...a11y("listaName")}
                              className={cn("h-10 rounded-lg bg-white", a11y("listaName").className)}
                            />
                          </Field>

                          <Field id="lema" label="Lema o frase distintiva" optional error={errorOf("lema")}>
                            <Textarea
                              id="lema"
                              name="lema"
                              rows={2}
                              maxLength={200}
                              placeholder="Escribe el lema que sintetice las propuestas de campaña"
                              className={cn("resize-none rounded-lg bg-white", a11y("lema").className)}
                              value={values.lema}
                              onChange={(e) => setField("lema", e.target.value)}
                              onBlur={() => touch("lema")}
                              aria-invalid={a11y("lema")["aria-invalid"]}
                              aria-describedby={a11y("lema")["aria-describedby"]}
                            />
                            <p className="text-right font-mono text-[10px] tabular-nums text-[var(--muted-foreground)]">
                              {values.lema.length}/200
                            </p>
                          </Field>

                          {/* Logo ------------------------------------------ */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <Label htmlFor="logo" className="text-xs font-semibold text-[var(--brand-navy)]">
                                Logotipo de la plancha
                              </Label>
                              <div className="flex items-center gap-2">
                                <FormatChips items={["PNG", "JPG", "JPEG"]} />
                                <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                                  Máx. {formatBytes(MAX_LOGO_SIZE)}
                                </span>
                              </div>
                            </div>

                            <input
                              ref={logoInputRef}
                              id="logo"
                              name="logo"
                              type="file"
                              accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                              className="sr-only"
                              tabIndex={-1}
                              onChange={onPickLogo}
                            />

                            <div
                              onDragEnter={onDragLogo}
                              onDragOver={onDragLogo}
                              onDragLeave={onDragLeaveLogo}
                              onDrop={onDropLogo}
                              className={cn(
                                "group relative flex flex-col items-center gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:gap-5",
                                draggingLogo
                                  ? "border-dashed border-[var(--brand-gold)] bg-[var(--brand-gold-soft)]/40"
                                  : logoFile
                                    ? "border-[var(--brand-gold)]/50 bg-[var(--brand-gold-soft)]/20"
                                    : "border-dashed border-[var(--border)] bg-[var(--secondary)]",
                                logoError && !draggingLogo && "border-destructive/60",
                              )}
                            >
                              {!logoFile && <Corners active={draggingLogo} />}

                              <motion.div
                                animate={draggingLogo ? { scale: 1.06 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                                className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-2xs"
                                style={logoPreview ? CHECKER : undefined}
                              >
                                <AnimatePresence mode="wait" initial={false}>
                                  {logoFile && logoPreview ? (
                                    <motion.div
                                      key={logoPreview}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.2, ease: EASE }}
                                      className="absolute inset-0"
                                    >
                                      <LogoPreviewImage
                                        src={logoPreview}
                                        onSize={(src, w, h) => setLogoDims({ src, w, h })}
                                      />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="empty"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute inset-0 grid place-items-center text-[var(--brand-gold)]"
                                    >
                                      <ImageIcon className="size-8" aria-hidden />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>

                              <div className="min-w-0 flex-1 text-center sm:text-left">
                                {logoFile ? (
                                  <div className="space-y-0.5">
                                    <p className="truncate text-sm font-semibold text-[var(--brand-navy)]" title={logoFile.name}>
                                      {logoFile.name}
                                    </p>
                                    <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                                      {formatBytes(logoFile.size)}
                                      {shownDims ? `  ·  ${shownDims.w} × ${shownDims.h} px` : ""}
                                    </p>
                                    <p className="flex items-center justify-center gap-1 pt-1 text-[11px] font-medium text-emerald-700 sm:justify-start">
                                      <Check className="size-3 stroke-[3]" aria-hidden />
                                      Aparecerá en la cédula de votación
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-semibold text-[var(--brand-navy)]">
                                      {draggingLogo ? "Suelta la imagen aquí" : "Arrastra el logotipo o selecciónalo"}
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                                      Usa una imagen cuadrada y nítida. Un PNG con fondo transparente se ve mejor
                                      en la cédula.
                                    </p>
                                  </div>
                                )}

                                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => logoInputRef.current?.click()}
                                    className="gap-1.5 border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-navy)] hover:bg-white"
                                  >
                                    {logoFile ? (
                                      <RefreshCw className="size-3.5 text-[var(--brand-gold)]" aria-hidden />
                                    ) : (
                                      <UploadCloud className="size-3.5 text-[var(--brand-gold)]" aria-hidden />
                                    )}
                                    {logoFile ? "Cambiar imagen" : "Seleccionar imagen"}
                                  </Button>
                                  <AnimatePresence initial={false}>
                                    {logoFile && (
                                      <motion.div
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={removeLogo}
                                          className="gap-1.5 text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive"
                                        >
                                          <X className="size-3.5" aria-hidden />
                                          Quitar
                                        </Button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>

                            <FieldError id="logo" message={logoError ?? undefined} />
                          </div>
                        </Group>

                        {/* ------------------------------------------------ */}
                        <Group index="II" title="Personero general" badge="Acreditación">
                          <Field id="personero" label="Nombres y apellidos completos" error={errorOf("personero")}>
                            <Input
                              id="personero"
                              name="personero"
                              autoComplete="name"
                              placeholder="Tal como figura en el DNI"
                              value={values.personero}
                              maxLength={100}
                              onChange={(e) => setField("personero", e.target.value)}
                              onBlur={() => touch("personero")}
                              {...a11y("personero")}
                              className={cn("h-10 rounded-lg bg-white", a11y("personero").className)}
                            />
                          </Field>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field id="dni" label="DNI" error={errorOf("dni")}>
                              <Input
                                id="dni"
                                name="dni"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="8 dígitos"
                                maxLength={8}
                                value={values.dni}
                                onChange={(e) => setField("dni", e.target.value.replace(/\D/g, ""))}
                                onBlur={() => touch("dni")}
                                {...a11y("dni")}
                                className={cn("h-10 rounded-lg bg-white font-mono tracking-wider", a11y("dni").className)}
                              />
                            </Field>

                            <Field id="celular" label="Celular de coordinación" error={errorOf("celular")}>
                              <Input
                                id="celular"
                                name="celular"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                placeholder="9XXXXXXXX"
                                maxLength={9}
                                value={values.celular}
                                onChange={(e) => setField("celular", e.target.value.replace(/\D/g, ""))}
                                onBlur={() => touch("celular")}
                                {...a11y("celular")}
                                className={cn("h-10 rounded-lg bg-white font-mono tracking-wider", a11y("celular").className)}
                              />
                            </Field>
                          </div>

                          <Field id="email" label="Correo institucional" error={errorOf("email")}>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="estudiante@unsch.edu.pe"
                              value={values.email}
                              onChange={(e) => setField("email", e.target.value)}
                              onBlur={() => touch("email")}
                              {...a11y("email")}
                              className={cn("h-10 rounded-lg bg-white", a11y("email").className)}
                            />
                          </Field>
                        </Group>

                        {/* ------------------------------------------------ */}
                        <Group index="III" title="Expediente de candidatura" badge="Requisitos">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <Label htmlFor="expediente" className="text-xs font-semibold text-[var(--brand-navy)]">
                                Carpeta consolidada: formatos F-01, F-02, F-03 y adherentes
                              </Label>
                              <div className="flex items-center gap-2">
                                <FormatChips items={["PDF", "ZIP", "RAR"]} />
                                <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                                  Hasta {formatBytes(MAX_FILE_SIZE)}
                                </span>
                              </div>
                            </div>

                            <input
                              ref={expInputRef}
                              id="expediente"
                              name="expediente"
                              type="file"
                              accept=".pdf,.zip,.rar"
                              className="sr-only"
                              tabIndex={file ? -1 : 0}
                              onChange={onPickExp}
                              aria-invalid={fileError ? true : undefined}
                              aria-describedby={fileError ? "expediente-error" : undefined}
                            />

                            <AnimatePresence mode="wait" initial={false}>
                              {file ? (
                                <motion.div
                                  key="file"
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.98 }}
                                  transition={{ duration: 0.18 }}
                                  className={cn(
                                    "flex items-center justify-between gap-3 rounded-xl border p-4",
                                    fileError
                                      ? "border-destructive/60 bg-destructive/5"
                                      : "border-[var(--brand-gold)]/50 bg-[var(--brand-gold-soft)]/20",
                                  )}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="relative grid size-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-white text-[var(--brand-navy)] shadow-2xs">
                                      <FileIcon className="size-5 text-[var(--brand-gold)]" aria-hidden />
                                      {!fileError && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.05 }}
                                          className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white"
                                        >
                                          <Check className="size-2.5 stroke-[3.5]" aria-hidden />
                                        </motion.span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-[var(--brand-navy)]" title={file.name}>
                                        {file.name}
                                      </p>
                                      <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                                        {ext.replace(".", "").toUpperCase()}  ·  {formatBytes(file.size)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--brand-navy)]"
                                      onClick={() => expInputRef.current?.click()}
                                    >
                                      <RefreshCw className="size-3.5" aria-hidden />
                                      <span className="hidden sm:inline">Reemplazar</span>
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="size-8 text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => setFile(null)}
                                      aria-label="Quitar archivo"
                                    >
                                      <X className="size-4" />
                                    </Button>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.label
                                  key="dropzone"
                                  htmlFor="expediente"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  onDragEnter={onDragExp}
                                  onDragOver={onDragExp}
                                  onDragLeave={onDragLeaveExp}
                                  onDrop={onDropExp}
                                  className={cn(
                                    "group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-9 text-center transition-colors",
                                    "focus-within:ring-2 focus-within:ring-[var(--brand-gold)]/40",
                                    draggingExp
                                      ? "border-[var(--brand-gold)] bg-[var(--brand-gold-soft)]/50"
                                      : "border-[var(--border)] bg-[var(--secondary)] hover:border-[var(--brand-navy)]/60 hover:bg-white",
                                    fileError && !draggingExp && "border-destructive/60",
                                  )}
                                >
                                  <Corners active={draggingExp} />
                                  <motion.div
                                    animate={draggingExp ? { y: [0, -4, 0], scale: 1.08 } : { y: 0, scale: 1 }}
                                    transition={
                                      draggingExp
                                        ? { y: { repeat: Infinity, duration: 0.8 }, scale: { duration: 0.2 } }
                                        : { type: "spring", stiffness: 300, damping: 20 }
                                    }
                                    className="grid size-12 place-items-center rounded-xl border border-[var(--border)] bg-white text-[var(--brand-gold)] shadow-2xs"
                                  >
                                    <UploadCloud className="size-5" aria-hidden />
                                  </motion.div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-semibold text-[var(--brand-navy)]">
                                      {draggingExp ? "Suelta el expediente aquí" : "Arrastra el archivo o haz clic para seleccionarlo"}
                                    </p>
                                    <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                                      Reúne los 4 requisitos en un solo PDF legible o comprímelos en un ZIP o RAR.
                                    </p>
                                  </div>
                                </motion.label>
                              )}
                            </AnimatePresence>

                            <FieldError id="expediente" message={fileError} />
                          </div>

                          <div
                            className={cn(
                              "space-y-2 rounded-xl border p-4 transition-colors",
                              values.declaracion
                                ? "border-[var(--brand-gold)]/60 bg-[var(--brand-gold-soft)]/20"
                                : "border-[var(--border)] bg-[var(--secondary)]/60",
                              errorOf("declaracion") && "border-destructive/50",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="declaracion"
                                checked={values.declaracion}
                                onCheckedChange={(checked) => {
                                  setField("declaracion", checked === true)
                                  touch("declaracion")
                                }}
                                aria-invalid={errorOf("declaracion") ? true : undefined}
                                aria-describedby={errorOf("declaracion") ? "declaracion-error" : undefined}
                                className="mt-0.5 border-[var(--border)] data-[state=checked]:bg-[var(--brand-navy)] data-[state=checked]:text-white"
                              />
                              <Label
                                htmlFor="declaracion"
                                className="text-xs font-medium leading-relaxed text-[var(--muted-foreground)]"
                              >
                                Declaro bajo juramento que la información consignada y los documentos adjuntos son
                                fidedignos, y asumo la representación y personería legal de esta lista conforme al
                                Reglamento Electoral de la EPIS.
                              </Label>
                            </div>
                            <FieldError id="declaracion" message={errorOf("declaracion")} />
                          </div>
                        </Group>
                      </motion.div>
                    </fieldset>
                  </CardContent>

                  <CardFooter className="flex-col items-stretch gap-4 border-t border-[var(--border)] bg-[var(--secondary)]/40 p-6 sm:p-7">
                    <AnimatePresence initial={false}>
                      {status === "error" && serverMessage && (
                        <motion.div
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs font-medium text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{serverMessage}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                      {busy && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1.5 pb-1">
                            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--muted-foreground)]">
                              <span>{progress < 100 ? "Transmitiendo expediente" : "Validando y registrando en mesa"}</span>
                              <span className="font-semibold tabular-nums text-[var(--brand-navy)]">{progress}%</span>
                            </div>
                            <div
                              role="progressbar"
                              aria-label="Progreso de la subida"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={progress}
                              className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]"
                            >
                              <motion.div
                                className="relative h-full overflow-hidden rounded-full bg-[var(--brand-gold)]"
                                initial={false}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <motion.span
                                  aria-hidden
                                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                  animate={{ x: ["-100%", "250%"] }}
                                  transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={busy}
                      className="group/btn relative h-12 w-full overflow-hidden bg-[var(--brand-navy)] font-semibold text-white shadow-xs transition-all hover:bg-[var(--brand-navy)]/90 active:scale-[0.99]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15 opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100"
                      />
                      {busy ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-[var(--brand-gold)]" aria-hidden />
                          Enviando expediente…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UploadCloud className="size-4 text-[var(--brand-gold)]" aria-hidden />
                          Registrar inscripción de la lista
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--muted-foreground)]">
                      <ShieldCheck className="size-3.5 shrink-0 text-[var(--brand-gold)]" aria-hidden />
                      <span>Proceso auditado por el Comité Electoral Autónomo de la EPIS</span>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
