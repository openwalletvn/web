import * as React from "react"
import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"

type BrandButtonVariant = "primary" | "brand"

const brandVariantClasses: Record<BrandButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-black/90",
  brand:   "bg-primary text-white hover:bg-primary/90",
}

type Props = Omit<React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>, "variant"> & {
  brandVariant?: BrandButtonVariant
  asChild?: boolean
}

export function BrandButton({
  brandVariant = "primary",
  className,
  ...props
}: Props) {
  return (
    <Button
      variant="default"
      className={cn(
        "ow-brand-button rounded-[48px] px-6 py-4 font-[family-name:var(--font-display)] text-[18px] font-normal leading-[1.3]",
        brandVariantClasses[brandVariant],
        className,
      )}
      {...props}
    />
  )
}
