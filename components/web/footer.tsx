"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CalendarDays,
  FolderArchive,
  Megaphone,
  UploadCloud,
  Code2,
  Sparkles,
} from "lucide-react"

import { FOOTER_LINKS } from "@/data/navigation"

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#DCE2EA] bg-[#101F36] text-white overflow-hidden">
      {/* FRANJA DECORATIVA DORADA SUPERIOR */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C6A24B] to-transparent opacity-80" />

      {/* CONTENIDO PRINCIPAL */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10">

          {/* COLUMNA 1: IDENTIDAD INSTITUCIONAL */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4"
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex size-11 items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo/logo-ce-epis-principal-clara.svg"
                  alt="Logo CE-EPIS"
                  width={40}
                  height={40}
                  unoptimized
                  className="size-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xl font-bold tracking-tight text-white leading-none">
                    CE-EPIS
                  </span>
                  <span className="rounded bg-[#C6A24B] px-1.5 py-0.5 text-[9px] font-bold text-[#101F36] uppercase tracking-wider">
                    2027
                  </span>
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/70 mt-1">
                  Comité Electoral Universitario
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm mx-auto md:mx-0">
              Órgano electoral autónomo encargado de organizar, conducir y proclamar
              los resultados de las elecciones de representación estudiantil de la Escuela
              Profesional de Ingeniería de Sistemas con neutralidad, transparencia y estricto apego al reglamento.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#C6A24B] font-medium pt-1">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Garantía de autonomía, preclusión y fe pública</span>
            </div>
          </motion.div>

          {/* COLUMNA 2: ACCESOS DIRECTOS AL PROCESO */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A24B]">
              Proceso Electoral
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm flex flex-col items-center md:items-start w-full">
              <li>
                <Link
                  href="/cronograma"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-[#C6A24B] transition-colors"
                >
                  <CalendarDays className="size-3.5 text-[#C6A24B]" />
                  <span>Cronograma Oficial</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kit-electoral"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-[#C6A24B] transition-colors"
                >
                  <FolderArchive className="size-3.5 text-[#C6A24B]" />
                  <span>Kit y Formatos de Postulación</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/comunicados"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-[#C6A24B] transition-colors"
                >
                  <Megaphone className="size-3.5 text-[#C6A24B]" />
                  <span>Resoluciones y Comunicados</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/inscripcion"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-[#C6A24B] transition-colors"
                >
                  <UploadCloud className="size-3.5 text-[#C6A24B]" />
                  <span>Mesa de Partes Virtual</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* COLUMNA 3: ATENCIÓN, CONTACTO Y SEDE */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A24B]">
              Mesa de Partes y Atención Oficial
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-white/80 flex flex-col items-center md:items-start max-w-md mx-auto md:mx-0">
              <li className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-2.5">
                <MapPin className="size-4 text-[#C6A24B] shrink-0 mt-0.5" />
                <span>
                  Pabellón H del campus universitario de la UNSCH.
                </span>
              </li>

              <li className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-2.5">
                <Phone className="size-4 text-[#C6A24B] shrink-0 mt-0.5" />
                <span>
                  WhatsApp: Qariht Leandro H. L. (986 120 831) · Andy Rodrigo C. C. (934 076 869) · Roy Yeferson V. C. (978 682 812)
                </span>
              </li>

              <li className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-2.5">
                <Mail className="size-4 text-[#C6A24B] shrink-0 mt-0.5" />
                <a
                  href="mailto:ceiscomitelectoral01@gmail.com"
                  className="hover:text-[#C6A24B] transition-colors underline-offset-2 hover:underline"
                >
                  ceiscomitelectoral01@gmail.com
                </a>
              </li>

              <li className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-2.5 text-xs text-white/60">
                <Clock className="size-4 text-[#C6A24B] shrink-0 mt-0.5" />
                <span>Lunes a viernes: 9:00 a. m. a 6:00 p. m.</span>
              </li>
            </ul>

            {/* Referencia institucional */}
            <div className="mt-4 w-full max-w-md rounded-xl bg-white/5 p-3.5 border border-white/10 flex flex-col sm:flex-row items-center md:items-start gap-3 text-center sm:text-left mx-auto md:mx-0">
              <Sparkles className="size-4 text-[#C6A24B] shrink-0 mt-0.5" />
              <p className="text-xs text-white/85 leading-relaxed">
                Realizado en la gestión del Comité Electoral de la EPIS - 2026
              </p>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* BARRA INFERIOR / CRÉDITOS Y COPYRIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="border-t border-white/10 bg-[#0c1729] py-5"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
          <div>
            <p>© {currentYear} Comité Electoral Autónomo EPIS. Todos los derechos reservados.</p>
          </div>

          {/* Enlaces de soporte */}
          {FOOTER_LINKS && FOOTER_LINKS.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#C6A24B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Crédito a hectorforge */}
          <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-white/70">
            <Code2 className="size-3.5 text-[#C6A24B]" />
            <span>
              Desarrollado por{" "}
              <span className="font-semibold text-white hover:text-[#C6A24B] transition-colors cursor-default">
                hectorforge
              </span>
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
