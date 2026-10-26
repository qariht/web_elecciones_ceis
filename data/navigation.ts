import {
  Calendar,
  ListChecks,
} from "lucide-react"

import type { NavDropdownItem, FooterLink } from "./types"

/* -------------------------------------------------------------------------- */
/*  Navbar — Dropdown items under "Proceso Electoral"                         */
/* -------------------------------------------------------------------------- */

export const NAV_PROCESO_ITEMS: NavDropdownItem[] = [
  {
    href: "/lista-preliminar",
    icon: ListChecks,
    title: "Lista preliminar",
    description: "Conoce la lista publicada para el proceso CEIS 2027.",
  },
  {
    href: "/cronograma",
    icon: Calendar,
    title: "Cronograma Oficial",
    description: "Fechas de convocatoria, tachas, debate y sufragio.",
  },
]

/* -------------------------------------------------------------------------- */
/*  Footer Links                                                              */
/* -------------------------------------------------------------------------- */

export const FOOTER_LINKS: FooterLink[] = [
  { href: "/lista-preliminar", label: "Lista preliminar" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/comunicados", label: "Resoluciones" },
]
