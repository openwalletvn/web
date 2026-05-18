import * as React from "react"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<"button"> & {
  active?: boolean
  asChild?: boolean
}

export function Chip({ active = false, className, children, ...props }: Props) {
  return (
    <button
      data-active={active}
      className={cn(
        "ow-chip inline-flex items-center justify-center whitespace-nowrap shrink-0",
        "px-4 py-2 rounded-[52px] border text-[16px] font-medium leading-[1.3]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-primary border-primary text-white"
          : "bg-[#EDEFEC] border-[#D3D3D3] text-foreground hover:bg-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
