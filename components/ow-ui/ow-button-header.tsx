import * as React from "react"
import {Slot as SlotPrimitive} from "radix-ui"
import {cn} from "@/lib/utils"
import {OwLogo} from "@/components/ow-ui/ow-logo"

type Props = React.ComponentProps<"button"> & {
    asChild?: boolean
    icon?: React.ReactNode
    kbd?: string
}

export function OwButtonHeader({asChild = false, icon, kbd, className, children, ...props}: Props) {
    const Comp = asChild ? SlotPrimitive.Root : "button"
    return (
        <Comp
            className={cn(
                "ow-button-header cursor-pointer inline-flex items-center gap-2 rounded-md border-2 border-black bg-slate-50 p-0.5 pr-2 transition-colors",
                "hover:border-primary hover:bg-white",
                className,
            )}
            {...props}
        >
            <span className="bg-primary rounded-sm w-8 h-8 flex justify-center items-center text-white shrink-0">
                {icon ?? <OwLogo variant="full" color="white" href={null} width={20}/>}
            </span>
            <span className="flex-1 text-left">{children}</span>
            {kbd && (
                <kbd className="hidden items-center gap-0.5 rounded px-1.5 text-xs md:flex opacity-50">
                    <span className="text-[16px]">⌘</span>{kbd}
                </kbd>
            )}
        </Comp>
    )
}
