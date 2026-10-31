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
    href: "/lista-apta",
    icon: ListChecks,
    title: "Lista apta",
    description: "Conoce a los integrantes de Avanza Sistemas PRO.",
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
  { href: "/lista-apta", label: "Integrantes de la lista apta" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/comunicados", label: "Resoluciones" },
]
