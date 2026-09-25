"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { StaggerList, StaggerItem } from "@/components/web/motion-wrapper"
import { FEATURES } from "@/data/home"

export function FeaturesGrid() {
  return (
    <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {FEATURES.map((item) => {
        const Icon = item.icon
        return (
          <StaggerItem key={item.href}>
            <Card className="transition-all hover:border-foreground/30 h-full">
              <CardHeader className="pb-3">
                <Icon className="size-6 text-foreground mb-2" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-foreground inline-flex items-center gap-1.5 hover:underline"
                >
                  {item.cta} <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>
        )
      })}
    </StaggerList>
  )
}