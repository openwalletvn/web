import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BrandBadgeVariant = "default" | "primary" | "muted"

const variantClasses: Record<BrandBadgeVariant, string> = {
  default: "bg-[#EDEFEC] border-[#D3D3D3] text-foreground",
  primary: "bg-primary border-primary text-white",
  muted:   "bg-muted border-border text-muted-foreground",
}

type Props = Omit<React.ComponentProps<"span">, "color"> & {
  brandVariant?: BrandBadgeVariant
}

export function BrandBadge({ brandVariant = "default", className, ...props }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[52px] px-4 py-1 text-[12px] font-semibold leading-[1.3] tracking-[0.0625rem] uppercase",
        variantClasses[brandVariant],
        className,
      )}
      {...props}
    />
  )
}
