import {
  CalendarDays,
  FileCheck,
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react"

import type { FeatureItem, GuaranteeItem, FaseActiva, HeroMetric } from "./types"

/* -------------------------------------------------------------------------- */
/*  Fase Activa (banner en Home)                                              */
/* -------------------------------------------------------------------------- */

export const FASE_ACTIVA: FaseActiva = {
  fase: "Fase 02",
  titulo: "Inscripción de listas",
  vencimiento: "Del miércoles 23 de septiembre al viernes 16 de octubre de 2026",
  href: "/cronograma",
}

/* -------------------------------------------------------------------------- */
/*  Features Grid                                                             */
/* -------------------------------------------------------------------------- */

export const FEATURES: FeatureItem[] = [
  {
    title: "Cronograma Oficial",
    description:
      "Fechas clave de convocatoria, presentación de tachas, debate y acto de sufragio.",
    href: "/cronograma",
    cta: "Ver fechas y plazos",
    icon: CalendarDays,
  },
  {
    title: "Kit y Reglamentos",
    description:
      "Formatos oficiales de inscripción, modelos de plan de trabajo y padrón de sufragio.",
    href: "/kit-electoral",
    cta: "Descargar formatos",
    icon: FileCheck,
  },
  {
    title: "Comunicados Oficiales",
    description:
      "Resoluciones fechadas, acuerdos de mesa y comunicados públicos con trazabilidad.",
    href: "/comunicados",
    cta: "Leer publicaciones",
    icon: Megaphone,
  },
]

/* -------------------------------------------------------------------------- */
/*  Guarantees                                                                */
/* -------------------------------------------------------------------------- */

export const GUARANTEES: GuaranteeItem[] = [
  {
    icon: ShieldCheck,
    label: "Imparcialidad",
    description: "Mismo criterio e información para todas las listas.",
  },
  {
    icon: CheckCircle2,
    label: "Transparencia",
    description: "Documentos verificables foliados por el Comité.",
  },
  {
    icon: FileCheck,
    label: "Normatividad",
    description: "Conforme al estatuto y reglamento electoral.",
  },
  {
    icon: Clock,
    label: "Plazos estrictos",
    description: "Sin prórrogas que afecten la equidad.",
  },
]

/* -------------------------------------------------------------------------- */
/*  Hero Bottom Bar Metrics                                                   */
/* -------------------------------------------------------------------------- */

export const HERO_METRICS: HeroMetric[] = [
  {
    icon: CalendarDays,
    label: "Inscripciones abiertas",
    value: "Cronograma 2027",
  },
  {
    label: "Fase actual",
    value: "Recepción de Tachas y Listas",
    pulse: true,
  },
]
