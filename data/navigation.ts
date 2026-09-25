import {
  Calendar,
  DownloadCloud,
  Megaphone,
} from "lucide-react"

import type { NavDropdownItem, FooterLink } from "./types"

/* -------------------------------------------------------------------------- */
/*  Navbar — Dropdown items under "Proceso Electoral"                         */
/* -------------------------------------------------------------------------- */

export const NAV_PROCESO_ITEMS: NavDropdownItem[] = [
  {
    href: "/cronograma",
    icon: Calendar,
    title: "Cronograma Oficial",
    description: "Fechas de convocatoria, tachas, debate y sufragio.",
  },
  {
    href: "/kit-electoral",
    icon: DownloadCloud,
    title: "Kit Electoral y Bases",
    description: "Descarga el reglamento, padrón y formatos jurados.",
  },
]

/* -------------------------------------------------------------------------- */
/*  Footer Links                                                              */
/* -------------------------------------------------------------------------- */

export const FOOTER_LINKS: FooterLink[] = [
  { href: "/cronograma", label: "Cronograma" },
  { href: "/kit-electoral", label: "Bases y Formatos" },
  { href: "/comunicados", label: "Resoluciones" },
  { href: "/inscripcion", label: "Mesa de Partes" },
]
