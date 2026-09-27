"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
  type MouseEvent,
} from "react"
import Image from "next/image"
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  AlertCircle,
  Check,
  ChevronDown,
  FileText,
  ImageIcon,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Table2Icon,
  Trash2,
  UploadCloud,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/web/page-header"
import type { Errors, MemberTextKey, DocSpec } from "@/data/types"
import type { Member, MemberFiles } from "@/lib/inscripcion"

import {
  BRAND_THEME,
  EASE,
  CHECKER,
  GRID_HERO,
  GRID_FADE,
  LOGO_REQUIRED,
  MAX_LOGO_SIZE,
  DOCS_PER_MEMBER,
  DOCS_PER_PERSONERO,
  ITEMS_PER_MEMBER,
  ITEMS_PER_PERSONERO,
  MEMBER_DOCS,
  PERSONERO_DOCS,
  MEMBER_FIELDS,
  FileCheck2,
  Receipt,
} from "@/data/inscripcion"

import {
  pad,
  formatBytes,
  cargoFor,
  cargoTituloFor,
  createMember,
  createPersonero,
  validateLogo,
  validateFile,
  validateInscripcion,
  memberProgress,
  uploadAndRegister,
  EXPECTED_PATTERNS,
  REGEX_FORMATO_INSCRIPCION,
  REGEX_RECIBO,
} from "@/lib/inscripcion"

/* -------------------------------------------------------------------------- */
/*  Piezas base                                                               *
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

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "className" | "onChange"> & {
  id: string
  label: string
  error?: string
  mono?: boolean
  onValue: (value: string) => void
}

function TextField({ id, label, error, mono, onValue, ...props }: TextFieldProps) {
  return (
    <div data-invalid={error ? "true" : undefined} className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-[var(--brand-navy)]">
        {label} <span className="text-[var(--brand-gold)]">*</span>
      </Label>
      <Input
        id={id}
        {...props}
        onChange={(e) => onValue(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-10 px-3.5 rounded-lg bg-white",
          mono && "font-mono tracking-wider",
          error
            ? "border-destructive focus-visible:ring-destructive/30"
            : "border-[var(--border)] focus-visible:border-[var(--brand-gold)] focus-visible:ring-[var(--brand-gold)]/20",
        )}
      />
      <FieldError id={id} message={error} />
    </div>
  )
}

function FormatChips({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {items.map((t) => (
        <span
          key={t}
          className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]"
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

function StatusDot({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
        done ? "border-emerald-500 bg-emerald-500" : "border-[var(--border)] bg-white",
      )}
    >
      <AnimatePresence initial={false}>
        {done && (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
          >
            <Check className="size-2.5 stroke-[3.5] text-white" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const size = 40
  const stroke = 3.5
  const r = (size - stroke) / 2
  const complete = done === total
  return (
    <span
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${done} de ${total} requisitos completos`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#DCE2EA" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: done / total, stroke: complete ? "#10B981" : "#C6A24B" }}
          transition={{ duration: 0.45, ease: EASE }}
        />
      </svg>
      <span className="absolute font-mono text-[10px] font-bold tabular-nums text-[var(--brand-navy)]">
        {complete ? <Check className="size-4 stroke-[3] text-emerald-600" aria-hidden /> : `${done}/${total}`}
      </span>
    </span>
  )
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 110, damping: 22 })
  const rounded = useTransform(spring, (v) => Math.round(v))
  useEffect(() => {
    spring.set(value)
  }, [spring, value])
  return <motion.span className={className}>{rounded}</motion.span>
}

function LogoPreviewImage({
  src,
  onSize,
  className,
}: {
  src: string
  onSize?: (src: string, w: number, h: number) => void
  className?: string
}) {
  return (
    <Image
      src={src}
      alt="Vista previa del logotipo"
      fill
      unoptimized
      className={cn("object-contain p-2", className)}
      onLoad={(e) => onSize?.(src, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
    />
  )
}

function SubmitButton({
  submitting,
  uploadProgress,
  label,
  className,
}: {
  submitting: boolean
  uploadProgress?: { completed: number; total: number; fileName: string } | null
  label: string
  className?: string
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={submitting}
      className={cn(
        "group/btn relative h-12 w-full overflow-hidden bg-[var(--brand-navy)] font-semibold text-white shadow-xs transition-all hover:bg-[var(--brand-navy)]/90 active:scale-[0.99]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15 opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100"
      />
      {submitting ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin text-[var(--brand-gold)]" aria-hidden />
          {uploadProgress ? `Subiendo ${uploadProgress.completed}/${uploadProgress.total}…` : "Validando…"}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <UploadCloud className="size-4 text-[var(--brand-gold)]" aria-hidden />
          {label}
        </span>
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Carga de archivos                                                         */
/* -------------------------------------------------------------------------- */

type FileSlotProps = {
  id: string
  label: string
  icon: LucideIcon
  pattern?: string
  accept: string
  badge: string
  file: File | null
  error?: string
  compact?: boolean
  onChange: (file: File | null) => void
}

function FileSlot({ id, label, icon: Icon, pattern, accept, badge, file, error, compact, onChange }: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const pick = () => inputRef.current?.click()

  const dragProps = {
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragging(true)
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
      setDragging(true)
    },
    onDragLeave: (e: DragEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f) onChange(f)
    },
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onChange(f)
    e.target.value = ""
  }

  const height = compact ? "min-h-[76px] p-3" : "min-h-[88px] p-4"

  return (
    <div
      data-invalid={error ? "true" : undefined}
      className={cn("space-y-2", !compact && "rounded-xl border border-[var(--border)] bg-[var(--secondary)]/60 p-4")}
    >
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-navy)]">
          <Icon className="size-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
          {label} <span className="text-[var(--brand-gold)]">*</span>
        </Label>
        <FormatChips items={[badge]} />
      </div>

      {pattern && (
        <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">
          Nombre esperado:{" "}
          <code className="break-all rounded border border-[var(--border)] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-navy)]">
            {pattern}
          </code>
        </p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        onChange={handleInput}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
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
              "flex items-center gap-3 rounded-xl border",
              height,
              error
                ? "border-destructive/50 bg-destructive/5"
                : "border-[var(--brand-gold)]/50 bg-[var(--brand-gold-soft)]/25",
            )}
          >
            <span
              className={cn(
                "relative grid size-10 shrink-0 place-items-center rounded-lg border bg-white shadow-2xs",
                error ? "border-destructive/30 text-destructive" : "border-[var(--border)] text-[var(--brand-navy)]",
              )}
            >
              <Icon className="size-[18px]" aria-hidden />
              {!error && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.05 }}
                  className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white"
                >
                  <Check className="size-2.5 stroke-[3.5]" aria-hidden />
                </motion.span>
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-[var(--brand-navy)]" title={file.name}>
                {file.name}
              </span>
              <span className="block font-mono text-[11px] text-[var(--muted-foreground)]">
                {formatBytes(file.size)}
                {error ? "  ·  revisar nombre" : "  ·  validado"}
              </span>
            </span>

            <span className="flex shrink-0 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-[var(--muted-foreground)] hover:text-[var(--brand-navy)]"
                onClick={pick}
                aria-label={`Reemplazar ${label}`}
              >
                <RefreshCw className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onChange(null)}
                aria-label={`Quitar ${label}`}
              >
                <X className="size-4" />
              </Button>
            </span>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={pick}
            {...dragProps}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-xl border border-dashed text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]/40",
              height,
              dragging
                ? "border-[var(--brand-gold)] bg-[var(--brand-gold-soft)]/50"
                : "border-[var(--border)] bg-white hover:border-[var(--brand-navy)]/50",
              error && !dragging && "border-destructive/60",
            )}
          >
            <Corners active={dragging} />
            <motion.span
              animate={dragging ? { y: [0, -3, 0] } : { y: 0 }}
              transition={
                dragging
                  ? { repeat: Infinity, duration: 0.8 }
                  : { type: "spring", stiffness: 300, damping: 20 }
              }
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--brand-gold)]"
            >
              <UploadCloud className="size-[18px]" aria-hidden />
            </motion.span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-[var(--brand-navy)]">
                {dragging ? "Suelta el archivo aquí" : "Arrastra o haz clic para cargar"}
              </span>
              <span className="block text-[11px] text-[var(--muted-foreground)]">Solo archivos {badge}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <FieldError id={id} message={error} />
    </div>
  )
}

function LogoUploader({
  file,
  preview,
  error,
  onChange,
}: {
  file: File | null
  preview: string | null
  error?: string
  onChange: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dims, setDims] = useState<{ src: string; w: number; h: number } | null>(null)
  const shownDims = dims && dims.src === preview ? dims : null

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onChange(f)
    e.target.value = ""
  }

  const dragProps = {
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragging(true)
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
      setDragging(true)
    },
    onDragLeave: (e: DragEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f) onChange(f)
    },
  }

  return (
    <div data-invalid={error ? "true" : undefined} className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor="logo" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-navy)]">
          <ImageIcon className="size-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
          Logotipo de la plancha
          {LOGO_REQUIRED && <span className="text-[var(--brand-gold)]">*</span>}
        </Label>
        <div className="flex items-center gap-2">
          <FormatChips items={["PNG", "JPG", "JPEG"]} />
          <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
            Máx. {formatBytes(MAX_LOGO_SIZE)}
          </span>
        </div>
      </div>

      <input
        ref={inputRef}
        id="logo"
        type="file"
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        className="sr-only"
        tabIndex={-1}
        onChange={handleInput}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "logo-error" : undefined}
      />

      <div
        {...dragProps}
        className={cn(
          "group relative flex flex-col items-center gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:gap-5",
          dragging
            ? "border-dashed border-[var(--brand-gold)] bg-[var(--brand-gold-soft)]/40"
            : file
              ? "border-[var(--brand-gold)]/50 bg-[var(--brand-gold-soft)]/20"
              : "border-dashed border-[var(--border)] bg-[var(--secondary)]",
          error && !dragging && "border-destructive/60",
        )}
      >
        {!file && <Corners active={dragging} />}

        <motion.div
          animate={dragging ? { scale: 1.06 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-2xs"
          style={preview ? CHECKER : undefined}
        >
          <AnimatePresence mode="wait" initial={false}>
            {file && preview ? (
              <motion.div
                key={preview}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute inset-0"
              >
                <LogoPreviewImage src={preview} onSize={(src, w, h) => setDims({ src, w, h })} />
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
          {file ? (
            <div className="space-y-0.5">
              <p className="truncate text-sm font-semibold text-[var(--brand-navy)]" title={file.name}>
                {file.name}
              </p>
              <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                {formatBytes(file.size)}
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
                {dragging ? "Suelta la imagen aquí" : "Arrastra el logotipo o selecciónalo"}
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                Usa una imagen cuadrada y nítida. Un PNG con fondo transparente se ve mejor en la cédula.
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="gap-1.5 border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-navy)] hover:bg-white"
            >
              {file ? (
                <RefreshCw className="size-3.5 text-[var(--brand-gold)]" aria-hidden />
              ) : (
                <UploadCloud className="size-3.5 text-[var(--brand-gold)]" aria-hidden />
              )}
              {file ? "Cambiar imagen" : "Seleccionar imagen"}
            </Button>
            <AnimatePresence initial={false}>
              {file && (
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
                    onClick={() => onChange(null)}
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

      <FieldError id="logo" message={error} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Integrantes                                                               */
/* -------------------------------------------------------------------------- */

type MemberCardProps = {
  member: Member
  index: number
  open: boolean
  canRemove: boolean
  errors: Errors
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onText: (id: string, field: MemberTextKey, value: string) => void
  onFile: (id: string, doc: DocSpec, file: File | null) => void
  docs?: DocSpec[]
  errorPrefix?: string
  badge?: string
}

function MemberCard({ member, index, open, canRemove, errors, onToggle, onRemove, onText, onFile, docs = MEMBER_DOCS, errorPrefix = "m", badge }: MemberCardProps) {
  const errorKey = (field: string) => `${errorPrefix}_${member.id}_${field}`
  const prog = memberProgress(member, errors, docs, errorPrefix)
  const errCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}_${member.id}_`)).length
  const bodyId = `member-body-${member.id}`
  const fullName = `${member.nombres} ${member.apellidos}`.trim()

  const [confirming, setConfirming] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const handleRemove = () => {
    if (!confirming) {
      setConfirming(true)
      timer.current = setTimeout(() => setConfirming(false), 3200)
      return
    }
    if (timer.current) clearTimeout(timer.current)
    onRemove(member.id)
  }

  return (
    <motion.article
      id={`member-${member.id}`}
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -18, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: EASE }}
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-2xl border bg-white transition-colors",
        open ? "border-[var(--brand-gold)]/60" : "border-[var(--border)]",
        errCount > 0 && !open && "border-destructive/50",
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 origin-top bg-[var(--brand-gold)]"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />

      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={() => onToggle(member.id)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3.5 text-left transition-colors hover:bg-[var(--secondary)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]/40 sm:p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--brand-navy)] font-mono text-xs font-bold text-white">
            {badge ?? pad(index + 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-bold leading-tight text-[var(--brand-navy)]">
                {fullName || member.cargo || cargoTituloFor(index)}
              </span>
              <AnimatePresence initial={false}>
                {errCount > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive"
                  >
                    {errCount} {errCount === 1 ? "observación" : "observaciones"}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="mt-0.5 block truncate font-mono text-xs text-[var(--brand-gold)]">{member.cargo}</span>
          </span>
          <ProgressRing done={prog.done} total={prog.total} />
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="text-[var(--muted-foreground)]"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            aria-label={confirming ? "Confirmar eliminación del integrante" : "Eliminar integrante"}
            className={cn(
              "h-8 shrink-0 gap-1.5 px-2 transition-colors",
              confirming
                ? "bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
                : "text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <Trash2 className="size-4" />
            <AnimatePresence initial={false}>
              {confirming && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden whitespace-nowrap text-xs font-semibold"
                >
                  ¿Eliminar?
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-6 border-t border-[var(--border)] px-4 pb-6 pt-5 sm:px-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {MEMBER_FIELDS.map((f) => (
                  <TextField
                    key={f.key}
                    id={`m${member.id}-${f.key}`}
                    label={f.label}
                    placeholder={f.placeholder}
                    value={member[f.key]}
                    maxLength={f.numeric ? 8 : undefined}
                    inputMode={f.numeric ? "numeric" : undefined}
                    mono={f.numeric}
                    autoComplete="off"
                    error={errors[errorKey(f.key)]}
                    onValue={(v) => onText(member.id, f.key, f.numeric ? v.replace(/\D/g, "") : v)}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--brand-navy)]">Documentación reglamentaria</span>
                  <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
                  <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                    {prog.docsDone}/{docs.length} en PDF
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {docs.map((doc, i) => (
                    <FileSlot
                      key={doc.key}
                      compact
                      id={`m${member.id}-${doc.key}`}
                      label={`${i + 1}. ${doc.label}`}
                      icon={doc.icon}
                      pattern={doc.pattern}
                      accept=".pdf"
                      badge=".PDF"
                      file={member.files[doc.key]}
                      error={errors[errorKey(doc.key)]}
                      onChange={(f) => onFile(member.id, doc, f)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Panel de resumen (cédula en vivo + checklist)                             */
/* -------------------------------------------------------------------------- */

function BallotPreview({ name, logo }: { name: string; logo: string | null }) {
  const filled = name.trim().length > 0
  return (
    <div className="overflow-hidden rounded-xl border-2 border-[var(--brand-navy)] bg-white">
      <div className="flex items-center justify-between bg-[var(--brand-navy)] px-3 py-1.5">
        <span className="text-[11px] font-semibold text-white">Cédula de sufragio</span>
        <span className="font-mono text-[10px] text-[var(--brand-gold)]">Vista previa</span>
      </div>
      <div className="flex items-center gap-3 p-3.5">
        <div
          className="relative size-[72px] shrink-0 overflow-hidden rounded-lg border border-[var(--border)]"
          style={CHECKER}
        >
          <AnimatePresence mode="wait" initial={false}>
            {logo ? (
              <motion.div
                key={logo}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute inset-0"
              >
                <LogoPreviewImage src={logo} className="p-1.5" />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center text-[var(--border)]"
              >
                <ImageIcon className="size-7" aria-hidden />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={filled ? "name" : "empty"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "line-clamp-3 break-words text-sm leading-snug",
                filled ? "font-bold text-[var(--brand-navy)]" : "font-medium text-[var(--muted-foreground)]/70",
              )}
            >
              {filled ? name.trim() : "Nombre de la lista"}
            </motion.p>
          </AnimatePresence>
        </div>

        <span aria-hidden className="size-9 shrink-0 rounded-md border-2 border-[var(--brand-navy)]/70" />
      </div>
    </div>
  )
}

type SummaryProps = {
  nombreLista: string
  logoPreview: string | null
  general: { key: string; label: string; done: boolean }[]
  memberRows: { id: string; label: string; name: string; done: number; total: number }[]
  done: number
  total: number
  percent: number
  submitting: boolean
  uploadProgress: { completed: number; total: number; fileName: string } | null
  onFocusMember: (id: string) => void
}

function SummaryPanel({
  nombreLista,
  logoPreview,
  general,
  memberRows,
  done,
  total,
  percent,
  submitting,
  uploadProgress,
  onFocusMember,
}: SummaryProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-4">
      <BallotPreview name={nombreLista} logo={logoPreview} />

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-[var(--brand-navy)]">Avance del expediente</span>
          <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
            {done} de {total}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Avance del expediente"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-2 w-full overflow-hidden rounded-full bg-[var(--secondary)]"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-[#E3C878]"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <p className="text-right font-mono text-[11px] text-[var(--muted-foreground)]">
          <AnimatedNumber value={percent} className="font-bold text-[var(--brand-navy)]" />% completado
        </p>
      </div>

      <div className="space-y-1 border-t border-dashed border-[var(--border)] pt-3">
        <p className="pb-1 text-[11px] font-semibold text-[var(--muted-foreground)]">Datos de la lista</p>
        {general.map((g) => (
          <div key={g.key} className="flex items-center gap-2.5 py-1 text-xs">
            <StatusDot done={g.done} />
            <span className={cn("flex-1", g.done ? "text-[var(--brand-navy)]" : "text-[var(--muted-foreground)]")}>
              {g.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-dashed border-[var(--border)] pt-3">
        <p className="pb-1 text-[11px] font-semibold text-[var(--muted-foreground)]">Integrantes</p>
        <ul className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {memberRows.map((m) => (
              <motion.li
                key={m.id}
                layout="position"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => onFocusMember(m.id)}
                  className="flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left text-xs transition-colors hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]/40"
                >
                  <StatusDot done={m.done === m.total} />
                  <span className="min-w-0 flex-1 truncate text-[var(--brand-navy)]">
                    {m.name || m.label}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                    {m.done}/{m.total}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="hidden space-y-3 lg:block">
        <SubmitButton submitting={submitting} uploadProgress={uploadProgress} label="Validar y registrar lista" />
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[var(--muted-foreground)]">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-gold)]" aria-hidden />
          Los datos son vinculantes y quedan protegidos por el Comité Electoral.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Constancia de recepción                                                   */
/* -------------------------------------------------------------------------- */

function SuccessView({
  nombreLista,
  logoPreview,
  integrantes,
  documentos,
  receivedAt,
  onHome,
}: {
  nombreLista: string
  logoPreview: string | null
  integrantes: number
  documentos: number
  receivedAt: Date
  onHome: () => void
}) {
  const fecha = useMemo(
    () => new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(receivedAt),
    [receivedAt],
  )

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-gold)] bg-white">
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

        <div className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-8">
          <div className="grid size-16 place-items-center rounded-full bg-[var(--brand-gold-soft)] text-[var(--brand-navy)] ring-8 ring-[var(--brand-gold-soft)]/50">
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
            <h2 className="text-2xl font-bold tracking-tight text-[var(--brand-navy)] sm:text-3xl">
              Expediente presentado
            </h2>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
              El Comité Electoral recibió el expediente de la lista{" "}
              <strong className="text-[var(--brand-navy)]">«{nombreLista}»</strong>. La documentación se verificará
              durante el periodo reglamentario de tachas y observaciones.
            </p>
          </div>

          <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3 text-left">
            {logoPreview && (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-[var(--border)]" style={CHECKER}>
                <Image src={logoPreview} alt="" fill unoptimized className="object-contain p-1" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--brand-navy)]">{nombreLista}</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">Recibido el {fecha}</p>
            </div>
          </div>
        </div>

        {/* Perforación de ticket */}
        <div className="relative">
          <div aria-hidden className="border-t border-dashed border-[var(--border)]" />
          <span aria-hidden className="absolute -left-3 -top-3 size-6 rounded-full border border-[var(--brand-gold)] bg-white" />
          <span aria-hidden className="absolute -right-3 -top-3 size-6 rounded-full border border-[var(--brand-gold)] bg-white" />
        </div>

        <div className="grid grid-cols-2 divide-x divide-[var(--border)] bg-[var(--secondary)]/50">
          {[
            { icon: Users, label: "Candidatos y personero", value: String(integrantes) },
            { icon: FileText, label: "Documentos adjuntos", value: String(documentos) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 sm:px-8">
              <Icon className="size-5 shrink-0 text-[var(--brand-gold)]" aria-hidden />
              <div>
                <p className="text-[11px] font-medium text-[var(--muted-foreground)]">{label}</p>
                <p className="text-sm font-semibold tabular-nums text-[var(--brand-navy)]">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center border-t border-[var(--border)] p-5">
          <Button
            type="button"
            variant="outline"
            onClick={onHome}
            className="border-[var(--border)] font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-navy)] hover:bg-[var(--secondary)]"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                    */
/* -------------------------------------------------------------------------- */

export default function InscripcionPage() {
  const [nombreLista, setNombreLista] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formatoInscripcion, setFormatoInscripcion] = useState<File | null>(null)
  const [reciboPago, setReciboPago] = useState<File | null>(null)
  const [members, setMembers] = useState<Member[]>(() => [createMember("1", 0)])
  const [personero, setPersonero] = useState<Member>(createPersonero)
  const [openIds, setOpenIds] = useState<string[]>(["1"])

  const [errors, setErrors] = useState<Errors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number; fileName: string } | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [receivedAt, setReceivedAt] = useState<Date | null>(null)

  const nextId = useRef(2)

  /* Spotlight dorado que sigue al mouse (mismo recurso del hero) */
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 140, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 140, mass: 0.5 })

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    mouseX.set(el.getBoundingClientRect().width / 2)
    mouseY.set(240)
  }, [mouseX, mouseY])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  /* Vista previa del logotipo */
  useEffect(() => {
    if (!logo) return

    let cancelled = false
    const reader = new FileReader()
    reader.onload = () => {
      if (!cancelled && typeof reader.result === "string") setLogoPreview(reader.result)
    }
    reader.onerror = () => {
      if (!cancelled) setLogoPreview(null)
    }
    reader.readAsDataURL(logo)
    return () => {
      cancelled = true
      if (reader.readyState === FileReader.LOADING) reader.abort()
    }
  }, [logo])

  /* ---- Errores ---------------------------------------------------------- */

  const setError = useCallback((key: string, message?: string | null) => {
    setErrors((prev) => {
      if (message) return prev[key] === message ? prev : { ...prev, [key]: message }
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  /* ---- Archivos generales ---------------------------------------------- */

  const onLogo = (file: File | null) => {
    if (!file) {
      setLogo(null)
      setLogoPreview(null)
      setError("logo", null)
      return
    }
    const message = validateLogo(file)
    if (message) {
      setError("logo", message)
      return
    }
    setError("logo", null)
    setLogo(file)
  }

  const onFormato = (file: File | null) => {
    setFormatoInscripcion(file)
    setError(
      "formatoInscripcion",
      file
        ? validateFile(file, REGEX_FORMATO_INSCRIPCION, EXPECTED_PATTERNS.formato, "Formato de inscripción")
        : null,
    )
  }

  const onRecibo = (file: File | null) => {
    setReciboPago(file)
    setError("reciboPago", file ? validateFile(file, REGEX_RECIBO, EXPECTED_PATTERNS.recibo, "Recibo de pago") : null)
  }

  /* ---- Integrantes ------------------------------------------------------ */

  const toggleMember = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const scrollToMember = (id: string) => {
    window.setTimeout(() => {
      document.getElementById(`member-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 140)
  }

  const focusMember = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    scrollToMember(id)
  }

  const addMember = () => {
    const id = String(nextId.current++)
    setMembers((prev) => [...prev, createMember(id, prev.length)])
    setOpenIds((prev) => [...prev, id])
  }

  const removeMember = (id: string) => {
    if (members.length === 1) return
    setMembers((prev) => prev.filter((m) => m.id !== id).map((m, i) => ({ ...m, cargo: cargoFor(i) })))
    setOpenIds((prev) => prev.filter((x) => x !== id))
    setErrors((prev) => {
      const next: Errors = {}
      for (const [k, v] of Object.entries(prev)) if (!k.startsWith(`m_${id}_`)) next[k] = v
      return next
    })
  }

  const updateMemberText = (id: string, field: MemberTextKey, value: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
    setError(`m_${id}_${field}`, null)
  }

  const updateMemberFile = (id: string, doc: DocSpec, file: File | null) => {
    setError(`m_${id}_${doc.key}`, file ? validateFile(file, doc.regex, doc.pattern, doc.label) : null)
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, files: { ...m.files, [doc.key]: file } } : m)))
  }

  const updatePersoneroText = (field: MemberTextKey, value: string) => {
    setPersonero((prev) => ({ ...prev, [field]: value }))
    setError(`p_${personero.id}_${field}`, null)
  }

  const updatePersoneroFile = (doc: DocSpec, file: File | null) => {
    setError(`p_${personero.id}_${doc.key}`, file ? validateFile(file, doc.regex, doc.pattern, doc.label) : null)
    setPersonero((prev) => ({ ...prev, files: { ...prev.files, [doc.key]: file } }))
  }

  /* ---- Avance ----------------------------------------------------------- */

  const progress = useMemo(() => {
    const general = [
      { key: "nombre", label: "Nombre de la lista", done: nombreLista.trim().length > 0 && !errors.nombreLista },
      { key: "logo", label: "Logotipo de la plancha", done: !!logo && !errors.logo },
      { key: "formato", label: "Formato de inscripción", done: !!formatoInscripcion && !errors.formatoInscripcion },
      { key: "recibo", label: "Recibo de pago", done: !!reciboPago && !errors.reciboPago },
    ].filter((g) => g.key !== "logo" || LOGO_REQUIRED)

    const personeroRow = {
      id: personero.id,
      label: personero.cargo,
      name: `${personero.nombres} ${personero.apellidos}`.trim(),
      ...memberProgress(personero, errors, PERSONERO_DOCS, "p"),
    }
    const memberRows = [personeroRow, ...members.map((m, i) => ({
      id: m.id,
      label: cargoTituloFor(i),
      name: `${m.nombres} ${m.apellidos}`.trim(),
      ...memberProgress(m, errors, MEMBER_DOCS),
    }))]

    const done = general.filter((g) => g.done).length + memberRows.reduce((acc, m) => acc + m.done, 0)
    const total = general.length + ITEMS_PER_PERSONERO + members.length * ITEMS_PER_MEMBER
    return { general, memberRows, done, total, percent: Math.round((done / total) * 100) }
  }, [nombreLista, logo, formatoInscripcion, reciboPago, members, personero, errors])

  const errorCount = Object.keys(errors).length

  /* ---- Envío ------------------------------------------------------------ */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    setAttempted(true)
    setSubmitError(null)

    const found: Errors = { ...validateInscripcion(nombreLista, formatoInscripcion, reciboPago, members, personero) }
    const logoMessage = validateLogo(logo)
    if (logoMessage) found.logo = logoMessage
    setErrors(found)

    if (Object.keys(found).length > 0) {
      const withErrors = members
        .filter((m) => Object.keys(found).some((k) => k.startsWith(`m_${m.id}_`)))
        .map((m) => m.id)
      if (withErrors.length) setOpenIds((prev) => Array.from(new Set([...prev, ...withErrors])))
      if (Object.keys(found).some((key) => key.startsWith(`p_${personero.id}_`))) {
        setOpenIds((prev) => Array.from(new Set([...prev, personero.id])))
      }
      window.setTimeout(() => {
        document
          .querySelector<HTMLElement>('[data-invalid="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 360)
      return
    }

    setSubmitting(true)
    try {
      await uploadAndRegister(nombreLista, logo, formatoInscripcion, reciboPago, members, personero, MEMBER_DOCS, PERSONERO_DOCS, setUploadProgress)
      setReceivedAt(new Date())
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos registrar la lista. Inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
      setUploadProgress(null)
    }
  }

  const documentos = (logo ? 1 : 0) + 2 + DOCS_PER_PERSONERO + members.length * DOCS_PER_MEMBER

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        style={BRAND_THEME}
        className="relative isolate w-full"
      >
        {/* Fondo grilla*/}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden">
          <div className={cn("absolute inset-0", GRID_HERO)} />
          <motion.div
            style={{ left: smoothX, top: smoothY, translateX: "-50%", translateY: "-50%" }}
            className="absolute hidden size-[560px] rounded-full bg-[radial-gradient(circle,rgba(198,162,75,0.22)_0%,rgba(16,31,54,0.06)_45%,transparent_75%)] blur-[90px] sm:block"
          />
        </div>

        <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <PageHeader
            category="Mesa de Partes Virtual"
            icon={Table2Icon}
            title="Inscripción de Lista de Candidatos"
            description="Completa los datos de la lista, adjunta su logotipo y registra a los candidatos y al Personero General con sus requisitos individuales en formato PDF."
            withBorder
          />

          <motion.div
            role="alert"
            aria-atomic="true"
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex items-start gap-3 overflow-hidden rounded-xl border border-[var(--brand-gold)]/45 bg-[var(--brand-gold)]/10 px-4 py-3 text-sm text-[var(--brand-navy)] shadow-sm"
          >
            <Info className="mt-0.5 size-4 shrink-0 text-[var(--brand-gold)]" aria-hidden />
            <p>
              Te recomendamos hacer el proceso de <strong>inscripción</strong> de tu lista en el navegador <strong>Chrome</strong>.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSuccess && receivedAt ? (
              <SuccessView
                key="success"
                nombreLista={nombreLista.trim()}
                logoPreview={logoPreview}
                integrantes={members.length + 1}
                documentos={documentos}
                receivedAt={receivedAt}
                onHome={() => { window.location.href = "/" }}
              />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                  {/* ---------------------- Columna principal ---------------------- */}
                  <motion.div
                    className="min-w-0 space-y-8"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >

                    <AnimatePresence initial={false}>
                      {attempted && errorCount > 0 && (
                        <motion.div
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-xs font-medium text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>
                              Hay {errorCount} {errorCount === 1 ? "campo por corregir" : "campos por corregir"}.
                              Revisa los elementos marcados en rojo; los integrantes con observaciones se abrieron
                              automáticamente.
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* --------------------- Sección 01 ---------------------- */}
                    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--secondary)]/50 px-5 py-5 sm:px-6">
                        <div aria-hidden className={cn("pointer-events-none absolute inset-0", GRID_FADE)} />
                        <div className="relative space-y-1.5">
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">
                            Sección 01
                          </span>
                          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--brand-navy)] sm:text-xl">
                            <FileText className="size-5 shrink-0 text-[var(--brand-gold)]" aria-hidden />
                            Información general de la lista
                          </h2>
                          <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
                            Denominación oficial, símbolo y comprobantes institucionales de la agrupación.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 p-5 sm:p-6">
                        <TextField
                          id="nombreLista"
                          label="Nombre de la lista o plancha postulante"
                          placeholder="Ej. Innovación y Desarrollo EPIS"
                          value={nombreLista}
                          maxLength={80}
                          autoComplete="off"
                          error={errors.nombreLista}
                          onValue={(v) => {
                            setNombreLista(v)
                            setError("nombreLista", null)
                          }}
                        />

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[var(--brand-navy)]">
                              Archivos generales de la plancha
                            </span>
                            <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
                            <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                              {LOGO_REQUIRED ? "3 archivos" : "2 archivos + logotipo opcional"}
                            </span>
                          </div>

                          <LogoUploader file={logo} preview={logoPreview} error={errors.logo} onChange={onLogo} />

                          <div className="grid gap-4 md:grid-cols-2">
                            <FileSlot
                              id="formatoInscripcion"
                              label="Formato de inscripción"
                              icon={FileCheck2}
                              pattern={EXPECTED_PATTERNS.formato}
                              accept=".pdf"
                              badge=".PDF"
                              file={formatoInscripcion}
                              error={errors.formatoInscripcion}
                              onChange={onFormato}
                            />
                            <FileSlot
                              id="reciboPago"
                              label="Recibo de pago / inscripción"
                              icon={Receipt}
                              pattern={EXPECTED_PATTERNS.recibo}
                              accept=".pdf"
                              badge=".PDF"
                              file={reciboPago}
                              error={errors.reciboPago}
                              onChange={onRecibo}
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* --------------------- Sección 02 ---------------------- */}
                    <section className="space-y-4">
                      <div className="flex flex-col items-start justify-between gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end">
                        <div className="space-y-1.5">
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--brand-gold)]">
                            Sección 02
                          </span>
                          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--brand-navy)] sm:text-xl">
                            <Users className="size-5 shrink-0 text-[var(--brand-navy)]" aria-hidden />
                            Integrantes y personero de la lista
                            <motion.span
                              key={members.length + 1}
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 420, damping: 20 }}
                              className="rounded-md bg-[var(--brand-navy)] px-2 py-0.5 font-mono text-xs font-bold text-white"
                            >
                              {members.length + 1}
                            </motion.span>
                          </h2>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Registra al Personero General y a cada integrante con los requisitos documentarios que correspondan.
                          </p>
                        </div>

                        <Button
                          type="button"
                          onClick={addMember}
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5 border-[var(--border)] font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-navy)] hover:bg-[var(--secondary)]"
                        >
                          <UserPlus className="size-4 text-[var(--brand-gold)]" aria-hidden />
                          Agregar integrante
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <AnimatePresence initial={false}>
                          {[...members].reverse().map((member, reversedIndex) => {
                            const index = members.length - reversedIndex - 1
                            return (
                              <MemberCard
                                key={member.id}
                                member={member}
                                index={index}
                                open={openIds.includes(member.id)}
                                canRemove={members.length > 1}
                                errors={errors}
                                onToggle={toggleMember}
                                onRemove={removeMember}
                                onText={updateMemberText}
                                onFile={updateMemberFile}
                              />
                            )
                          })}
                        </AnimatePresence>
                        <MemberCard
                          member={personero}
                          index={0}
                          open={openIds.includes(personero.id)}
                          canRemove={false}
                          errors={errors}
                          docs={PERSONERO_DOCS}
                          errorPrefix="p"
                          badge="PG"
                          onToggle={toggleMember}
                          onRemove={() => undefined}
                          onText={(_, field, value) => updatePersoneroText(field, value)}
                          onFile={(_, doc, file) => updatePersoneroFile(doc, file)}
                        />
                      </div>
                    </section>

                    <AnimatePresence initial={false}>
                      {submitError && (
                        <motion.div
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-xs font-medium text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                            <span>{submitError}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                      {uploadProgress && (
                        <motion.div
                          role="status"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 rounded-xl border border-[var(--brand-gold)]/40 bg-[var(--brand-gold-soft)]/40 p-4">
                            <div className="flex justify-between gap-3 text-xs font-medium text-[var(--brand-navy)]">
                              <span className="truncate">Subiendo: {uploadProgress.fileName}</span>
                              <span className="shrink-0 font-mono">{uploadProgress.completed}/{uploadProgress.total}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white">
                              <motion.div className="h-full bg-[var(--brand-gold)]" initial={false} animate={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* ------------------------ Resumen ------------------------- */}
                  <motion.aside
                    className="lg:sticky lg:top-24 lg:self-start"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.12 }}
                    aria-label="Resumen del expediente"
                  >
                    <SummaryPanel
                      nombreLista={nombreLista}
                      logoPreview={logoPreview}
                      general={progress.general}
                      memberRows={progress.memberRows}
                      done={progress.done}
                      total={progress.total}
                      percent={progress.percent}
                      submitting={submitting}
                      uploadProgress={uploadProgress}
                      onFocusMember={focusMember}
                    />
                  </motion.aside>
                </div>

                {/* Barra de envío para pantallas pequeñas */}
                <div className="sticky bottom-3 z-30 lg:hidden">
                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/90 p-2.5 pl-4 shadow-lg backdrop-blur-md">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                        <AnimatedNumber value={progress.percent} className="font-bold text-[var(--brand-navy)]" />%
                        completado
                      </p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
                        <motion.div
                          className="h-full rounded-full bg-[var(--brand-gold)]"
                          initial={false}
                          animate={{ width: `${progress.percent}%` }}
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      </div>
                    </div>
                    <SubmitButton submitting={submitting} uploadProgress={uploadProgress} label="Registrar lista" className="h-11 w-auto px-5" />
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
