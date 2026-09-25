"use client"

import { StaggerList, StaggerItem } from "@/components/web/motion-wrapper"
import { GUARANTEES } from "@/data/home"

export function GuaranteesSection() {
  return (
    <StaggerList className="border-t pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-muted-foreground">
      {GUARANTEES.map((item) => {
        const Icon = item.icon
        return (
          <StaggerItem key={item.label}>
            <div className="flex gap-2.5">
              <Icon className="size-5 text-foreground shrink-0" />
              <span>
                <strong>{item.label}:</strong> {item.description}
              </span>
            </div>
          </StaggerItem>
        )
      })}
    </StaggerList>
  )
}