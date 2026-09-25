"use client"

import { type ReactNode } from "react"
import { motion, MotionConfig, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  MotionPageWrapper                                                         */
/*  Envuelve una página con MotionConfig reducedMotion="user"                 */
/* -------------------------------------------------------------------------- */

interface MotionPageWrapperProps {
  children: ReactNode
  className?: string
}

export function MotionPageWrapper({ children, className }: MotionPageWrapperProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("mx-auto w-full max-w-4xl py-10 px-4 sm:px-6 space-y-8", className)}>
        {children}
      </div>
    </MotionConfig>
  )
}

/* -------------------------------------------------------------------------- */
/*  FadeIn                                                                    */
/*  Componente genérico de animación fade-in + slide-up con delay             */
/* -------------------------------------------------------------------------- */

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  y?: number
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.25,
  className,
  y = 12,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  StaggerList                                                               */
/*  Contenedor que aplica animaciones escalonadas a sus hijos                 */
/* -------------------------------------------------------------------------- */

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
}

interface StaggerListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerList({ children, className, staggerDelay = 0.06 }: StaggerListProps) {
  const container: Variants = {
    ...staggerContainer,
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
