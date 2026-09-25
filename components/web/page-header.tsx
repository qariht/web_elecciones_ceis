import React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  category?: string
  icon?: LucideIcon  
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  withBorder?: boolean
  className?: string
}

export function PageHeader({
  category,
  icon: Icon,
  title,
  description,
  actions,
  withBorder = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2.5 pb-6",
        withBorder && "border-b border-brand-border",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">

          {(category || Icon) && (
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {Icon && <Icon className="size-3.5 shrink-0 stroke-[2.2]" />}
              <span>{category}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-navy leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-sm sm:text-base text-brand-muted-fg leading-relaxed pt-0.5">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}