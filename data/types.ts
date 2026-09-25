import type { LucideIcon } from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  Cronograma / Etapas Electorales                                           */
/* -------------------------------------------------------------------------- */

export type EstadoEtapa = "Finalizado" | "En curso" | "Pendiente"

export interface EtapaElectoral {
  id: number
  fase: string
  titulo: string
  fechaInicio: Date
  fechaFin: Date
  detalle: string
  obligatorio?: boolean
  nota?: string
}

/* -------------------------------------------------------------------------- */
/*  Comunicados y Resoluciones                                                */
/* -------------------------------------------------------------------------- */

export type TipoPublicacion = "Resolución" | "Comunicado" | "Aviso"

export interface Publicacion {
  id: string
  tipo: TipoPublicacion
  numero: string
  fecha: string
  titulo: string
  resumen: string
  archivoUrl?: string
  imagenUrl?: string
}

/* -------------------------------------------------------------------------- */
/*  Kit Electoral                                                             */
/* -------------------------------------------------------------------------- */

export type TipoDocumento = "PDF" | "DOCX"

export interface DocumentoKit {
  codigo?: string
  tipo: TipoDocumento
  titulo: string
  descripcion: string
  archivo: string
  tamano: string
  obligatorio?: boolean
}

export interface KitDestacado {
  version: string
  actualizacion: string
  tamano: string
  archivo: string
}

/* -------------------------------------------------------------------------- */
/*  Home                                                                      */
/* -------------------------------------------------------------------------- */

export interface FeatureItem {
  title: string
  description: string
  href: string
  cta: string
  icon: LucideIcon
}

export interface GuaranteeItem {
  icon: LucideIcon
  label: string
  description: string
}

export interface FaseActiva {
  fase: string
  titulo: string
  vencimiento: string
  href: string
}

export interface HeroMetric {
  icon?: LucideIcon
  label: string
  value: string
  href?: string
  pulse?: boolean
}

/* -------------------------------------------------------------------------- */
/*  Navegación                                                                */
/* -------------------------------------------------------------------------- */

export interface NavDropdownItem {
  href: string
  icon: LucideIcon
  title: string
  description: string
}

export interface FooterLink {
  href: string
  label: string
}

/* -------------------------------------------------------------------------- */
/*  Avisos Legales                                                            */
/* -------------------------------------------------------------------------- */

export interface LegalNotice {
  titulo: string
  texto: string
}

/* -------------------------------------------------------------------------- */
/*  Inscripción de Listas                                                     */
/* -------------------------------------------------------------------------- */

/** Re-exporta tipos base desde la capa de reglas de negocio. */
export type { Member, MemberFiles } from "@/lib/inscripcion"

/** Mapa genérico de errores de validación (clave → mensaje). */
export type Errors = Record<string, string>

/** Campos de texto editables de un integrante. */
export type MemberTextKey = "nombres" | "apellidos" | "codigo" | "dni"

/** Especificación de un documento reglamentario. */
export type DocSpec = {
  key: "compromiso" | "dniFile" | "reporteNotas" | "fichaMatricula"
  label: string
  icon: LucideIcon
  regex: RegExp
  pattern: string
}

/** Definición de un campo de texto dentro de la tarjeta del integrante. */
export type MemberFieldSpec = {
  key: MemberTextKey
  label: string
  placeholder: string
  numeric?: boolean
}
