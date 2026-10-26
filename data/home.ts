import {
  CalendarDays,
  ListChecks,
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
  fase: "Etapa III",
  titulo: "Publicación de lista preliminar",
  vencimiento: "Lunes 26 de octubre de 2026",
  href: "/lista-preliminar",
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
    title: "Lista Preliminar",
    description:
      "Consulta la lista preliminar presentada para el proceso CEIS 2027.",
    href: "/lista-preliminar",
    cta: "Ver lista preliminar",
    icon: ListChecks,
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
    icon: ListChecks,
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
    label: "Etapa actual",
    value: "Lista preliminar",
  },
  {
    label: "Fase actual",
    value: "Publicación preliminar",
    pulse: true,
  },
]
