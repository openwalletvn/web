import * as React from "react"
import {Slot} from "radix-ui"
import {cn} from "@/lib/utils"

type Props = React.ComponentProps<"span"> & {
  active?: boolean
  asChild?: boolean
}

export function OwChip({ active = false, asChild = false, className, children, ...props }: Props) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-active={active}
      className={cn(
        "ow-chip inline-flex items-center justify-center whitespace-nowrap shrink-0",
        "px-4 py-2 rounded-[52px] border text-[16px] font-medium leading-[1.3]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-primary border-primary text-white"
          : "bg-[#EDEFEC] border-[#D3D3D3] text-foreground",
        "[&:is(button,a)]:cursor-pointer [&:is(button,a)]:hover:bg-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
