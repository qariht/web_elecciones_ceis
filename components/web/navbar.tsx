"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ListChecks,
  Megaphone,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Home,
  Layers,
  ArrowRight,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { buttonVariants } from "@/components/ui/button"
import { NAV_PROCESO_ITEMS } from "@/data/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [procesoOpen, setProcesoOpen] = useState(true)
  const pathname = usePathname()
  const procesoItems = NAV_PROCESO_ITEMS

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 transition-all">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO INSTITUCIONAL */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex size-10 items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo/logo-ce-epis-principal-clara.svg"
                alt="Logo CE-EPIS"
                width={36}
                height={36}
                unoptimized
                className="size-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-[var(--brand-ink)] leading-none">
                  CE-EPIS
                </span>
              </div>

              {/*  
              <span className="text-[10px] font-medium tracking-wider text-brand-muted-fg uppercase mt-0.5">
                Comité Electoral
              </span>
              */}
            </div>
          </Link>

          {/* MENÚ CENTRAL DE ESCRITORIO */}
          <nav className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">

                {/* 1. Inicio con icono */}
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 text-sm font-medium text-[var(--brand-ink)] hover:text-[#C6A24B] hover:bg-secondary transition-colors"
                    )}
                  >
                    <Home className="size-4 text-[#C6A24B]" />
                    <span>Inicio</span>
                  </Link>
                </NavigationMenuItem>

                {/* 2. Proceso Electoral Dropdown con icono */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2 text-sm font-medium text-[var(--brand-ink)] hover:text-[#C6A24B] hover:bg-secondary data-[state=open]:bg-secondary">
                    <Layers className="size-4 text-[#C6A24B]" />
                    <span>Proceso Electoral</span>
                  </NavigationMenuTrigger>

                  {/* Se retiraron los bordes duplicados y sombras conflictivas */}
                  <NavigationMenuContent className="w-[380px] sm:w-[410px] p-2 bg-card">
                    <div className="flex flex-col gap-1">
                      {procesoItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-start gap-3.5 rounded-lg p-2.5 transition-colors hover:bg-secondary"
                          >
                            {/* Icono suelto y orgánico sin recuadro */}
                            <Icon className="size-5 text-[#C6A24B] shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />

                            <div className="space-y-0.5">
                              <p className="text-sm font-semibold text-[var(--brand-ink)] group-hover:text-[#C6A24B] transition-colors leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-brand-muted-fg leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Comunicados con icono */}
                <NavigationMenuItem>
                  <Link
                    href="/comunicados"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 text-sm font-medium text-[var(--brand-ink)] hover:text-[#C6A24B] hover:bg-secondary transition-colors"
                    )}
                  >
                    <Megaphone className="size-4 text-[#C6A24B]" />
                    <span>Comunicados</span>
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* ACCIONES Y BOTÓN HAMBURGUESA */}
          <div className="flex items-center gap-3">
            <Link
                href="/lista-apta"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden sm:inline-flex bg-[#101F36] hover:bg-[#182c4d] text-white font-medium shadow-sm transition-transform active:scale-95 gap-2"
                )}
              >
                <ListChecks className="size-4 text-[#C6A24B]" />
                <span>Ver lista apta</span>
              </Link>
            {/* Disparador Menú Móvil */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex size-9 items-center justify-center rounded-lg border border-brand-border bg-card text-[var(--brand-ink)] hover:bg-secondary transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" />
            </button>
          </div>

        </div>
      </header>

      {/* BARRA LATERAL MÓVIL (DRAWER) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">

            {/* Backdrop con Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#101F36]/60 backdrop-blur-sm"
            />

            {/* Panel Lateral Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative z-10 flex h-full w-[85%] max-w-sm flex-col bg-card border-l border-brand-border shadow-2xl"
            >

              {/* Header Drawer */}
              <div className="flex items-center justify-between border-b border-brand-border p-4 sm:p-5">
                <div className="flex items-center gap-2.5">
                  <div className="size-9">
                    <Image
                      src="/logo/logo-ce-epis-principal-clara.svg"
                      alt="Logo CE-EPIS"
                      width={32}
                      height={32}
                      unoptimized
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-heading text-base font-bold text-[var(--brand-ink)] block leading-none">
                      CE-EPIS
                    </span>
                    <span className="text-[10px] text-brand-muted-fg uppercase font-medium">
                      Portal Oficial 2027
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex size-8 items-center justify-center rounded-md border border-brand-border text-brand-muted-fg hover:bg-secondary hover:text-[var(--brand-ink)] transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Contenido de navegación con scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Inicio */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    pathname === "/"
                      ? "bg-[#101F36] text-white"
                      : "text-[var(--brand-ink)] hover:bg-secondary"
                  )}
                >
                  <Home className={cn("size-4", pathname === "/" ? "text-[#C6A24B]" : "text-[#C6A24B]")} />
                  <span>Inicio</span>
                </Link>

                {/* Sección Acordeón: Proceso Electoral */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setProcesoOpen(!procesoOpen)}
                    className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-muted-fg hover:text-[var(--brand-ink)]"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="size-3.5 text-[#C6A24B]" />
                      Proceso Electoral
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        procesoOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {procesoOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 pl-1"
                      >
                        {procesoItems.map((item) => {
                          const Icon = item.icon
                          const isActive = pathname === item.href

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors",
                                isActive
                                  ? "bg-[var(--brand-gold-soft)] text-[var(--brand-ink)] font-semibold"
                                  : "text-[var(--brand-ink)] hover:bg-secondary"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="size-4 text-[#C6A24B] shrink-0" />
                                <span>{item.title}</span>
                              </div>
                              <ArrowRight className="size-3 text-brand-muted-fg/50" />
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comunicados */}
                <Link
                  href="/comunicados"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    pathname === "/comunicados"
                      ? "bg-[#101F36] text-white"
                      : "text-[var(--brand-ink)] hover:bg-secondary"
                  )}
                >
                  <Megaphone className="size-4 text-[#C6A24B]" />
                  <span>Comunicados y Resoluciones</span>
                </Link>

              </div>

              {/* Footer Drawer con CTA */}
              <div className="border-t border-brand-border p-4 bg-secondary space-y-3">
                <Link
                    href="/lista-apta"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants(),
                      "w-full bg-[#101F36] hover:bg-[#182c4d] text-white font-semibold justify-center gap-2 h-11 shadow-sm"
                    )}
                  >
                    <ListChecks className="size-4 text-[#C6A24B]" />
                    <span>Ver integrantes</span>
                  </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted-fg font-mono">
                  <ShieldCheck className="size-3.5 text-[#C6A24B]" />
                  <span>Comité Electoral · EPIS 2027</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
