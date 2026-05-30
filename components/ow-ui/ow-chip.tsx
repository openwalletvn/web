import * as React from "react"
import {Slot as SlotPrimitive} from "radix-ui"
import {cn} from "@/lib/utils"

type Props = React.ComponentProps<"span"> & {
  active?: boolean
  asChild?: boolean
  size?: "md" | "sm"
}

export function OwChip({ active = false, asChild = false, size = "md", className, children, ...props }: Props) {
  const Comp = asChild ? SlotPrimitive.Root : "span"
  return (
    <Comp
      data-active={active}
      className={cn(
        "ow-chip inline-flex items-center justify-center whitespace-nowrap shrink-0",
          "rounded-[52px] border font-medium leading-[1.3] py-1 min-h-[30px] px-3 text-sm",
          size === "md" && "sm:min-h-[40px] sm:px-4 ",
          size === "sm" && "",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-primary border-primary text-white"
          : "bg-[#EDEFEC] border-[#D3D3D3] text-foreground",
        "[&:is(button,a)]:cursor-pointer [&:is(button,a)]:hover:bg-primary/10 [&:is(button,a)]:hover:border-primary [&:is(button,a)]:hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
