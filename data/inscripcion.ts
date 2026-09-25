/**
 * Constantes, tokens de diseño y datos estáticos para la página de inscripción.
 *
 * Ningún valor aquí depende de React ni del DOM: es pura configuración
 * importable tanto desde el cliente como desde el servidor.
 */

import type { CSSProperties } from "react"
import {
  FileCheck2,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  IdCard,
  Receipt,
} from "lucide-react"
import type { DocSpec, MemberFieldSpec } from "@/data/types"
import {
  REGEX_CARTA_COMPROMISO,
  REGEX_DNI_FILE,
  REGEX_REPORTE_NOTAS,
  REGEX_FICHA_MATRICULA,
  REGEX_FORMATO_INSCRIPCION,
  REGEX_RECIBO,
  EXPECTED_PATTERNS,
} from "@/lib/inscripcion"

/* -------------------------------------------------------------------------- */
/*  Tokens de diseño                                                          */
/* -------------------------------------------------------------------------- */

export const BRAND_THEME = {
  "--brand-navy": "#101F36",
  "--brand-gold": "#C6A24B",
  "--brand-gold-soft": "#FAEEC6",
  "--background": "#FFFFFF",
  "--foreground": "#12161D",
  "--secondary": "#F5F7FA",
  "--muted": "#F5F7FA",
  "--muted-foreground": "#566275",
  "--border": "#DCE2EA",
} as CSSProperties

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Fondo de tablero para que las transparencias de un PNG se noten. */
export const CHECKER: CSSProperties = {
  backgroundColor: "#FFFFFF",
  backgroundImage:
    "linear-gradient(45deg,#EEF1F5 25%,transparent 25%,transparent 75%,#EEF1F5 75%),linear-gradient(45deg,#EEF1F5 25%,transparent 25%,transparent 75%,#EEF1F5 75%)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0, 7px 7px",
}

/** Grilla arquitectónica del hero. */
export const GRID_HERO =
  "bg-[linear-gradient(to_right,#101f360a_1px,transparent_1px),linear-gradient(to_bottom,#101f360a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]"

export const GRID_FADE =
  "bg-[linear-gradient(to_right,#101f360a_1px,transparent_1px),linear-gradient(to_bottom,#101f360a_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_left,#000_0%,transparent_75%)]"

/* -------------------------------------------------------------------------- */
/*  Configuración del logotipo                                                */
/* -------------------------------------------------------------------------- */

/** Cambia a `false` si el logotipo debe ser opcional. */
export const LOGO_REQUIRED: boolean = true
export const MAX_LOGO_SIZE = 5 * 1024 * 1024
export const LOGO_TYPES = ["image/png", "image/jpeg", "image/jpg"]
export const LOGO_EXT = /\.(png|jpe?g)$/i

/* -------------------------------------------------------------------------- */
/*  Contadores de progreso                                                    */
/* -------------------------------------------------------------------------- */

export const DOCS_PER_MEMBER = 4
export const DOCS_PER_PERSONERO = 3
export const ITEMS_PER_MEMBER = 4 + DOCS_PER_MEMBER // 4 datos + 4 documentos
export const ITEMS_PER_PERSONERO = 4 + DOCS_PER_PERSONERO

/* -------------------------------------------------------------------------- */
/*  Cargos                                                                    */
/* -------------------------------------------------------------------------- */

export const CARGOS_LISTA = [
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

/* -------------------------------------------------------------------------- */
/*  Especificaciones de documentos                                            */
/* -------------------------------------------------------------------------- */

export const MEMBER_DOCS: DocSpec[] = [
  {
    key: "compromiso",
    label: "Carta de compromiso",
    icon: FileText,
    regex: REGEX_CARTA_COMPROMISO,
    pattern: EXPECTED_PATTERNS.compromiso,
  },
  {
    key: "dniFile",
    label: "Copia de DNI",
    icon: IdCard,
    regex: REGEX_DNI_FILE,
    pattern: EXPECTED_PATTERNS.dni,
  },
  {
    key: "reporteNotas",
    label: "Reporte de notas",
    icon: GraduationCap,
    regex: REGEX_REPORTE_NOTAS,
    pattern: EXPECTED_PATTERNS.reporteNotas,
  },
  {
    key: "fichaMatricula",
    label: "Ficha de matrícula",
    icon: FileSpreadsheet,
    regex: REGEX_FICHA_MATRICULA,
    pattern: EXPECTED_PATTERNS.fichaMatricula,
  },
]

export const PERSONERO_DOCS = MEMBER_DOCS
  .filter((doc) => doc.key === "compromiso" || doc.key === "dniFile" || doc.key === "fichaMatricula")
  .map((doc) => (doc.key === "compromiso" ? { ...doc, label: "Credencial del personero" } : doc))

/* -------------------------------------------------------------------------- */
/*  Definición de campos de texto del integrante                              */
/* -------------------------------------------------------------------------- */

export const MEMBER_FIELDS: MemberFieldSpec[] = [
  { key: "nombres", label: "Nombres", placeholder: "Ej. Steve" },
  { key: "apellidos", label: "Apellidos", placeholder: "Ej. Wozniak" },
  { key: "codigo", label: "Código universitario", placeholder: "8 dígitos", numeric: true },
  { key: "dni", label: "DNI", placeholder: "8 dígitos", numeric: true },
]

/* -------------------------------------------------------------------------- */
/*  Iconos de documentos generales (usados en el form)                        */
/* -------------------------------------------------------------------------- */

export { FileCheck2, Receipt }
