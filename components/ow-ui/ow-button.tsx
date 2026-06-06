import * as React from "react"
import {Button, type buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {type VariantProps} from "class-variance-authority"

type OwButtonColor = "default" | "outline"
export type OwButtonSize = "md" | "sm" | "full"

const colorClasses: Record<OwButtonColor, string> = {
    default: "bg-primary !text-white border-2 border-primary hover:bg-black hover:border-black",
    outline: "bg-white !text-black border-2 border-[#ababab] hover:border-primary hover:bg-primary/5 hover:!text-primary",
}

const activeColorClasses: Record<OwButtonColor, string> = {
    default: "bg-primary !text-white border-2 border-black hover:bg-black hover:border-black",
    outline: "bg-white !text-black border-2 border-black hover:border-primary hover:bg-primary/5 hover:!text-primary",
}

const sizeClasses: Record<OwButtonSize, string> = {
    md: "lg:text-[15px] lg:min-h-[52px] lg:min-w-[150px] lg:px-6 lg:py-3",
    full: "w-full max-w-full",
    sm: "text-[14px] min-h-[44px] min-w-[120px] px-4 py-2", // always add
}

type Props = Omit<React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>, "variant" | "size"> & {
    color?: OwButtonColor
    size?: OwButtonSize
    asChild?: boolean
    active?: boolean
}

export function OwButton({
                             color = "default",
                             size = "md",
                             active,
                             className,
                             disabled,
                             ...props
                         }: Props) {
    return (
        <Button
            variant="default"
            disabled={disabled}
            className={cn(
                "ow-button cursor-pointer rounded-[8px] tracking-wide max-w-[320px] w-auto !whitespace-normal h-auto inline-flex items-center justify-center text-center font-display !leading-[1.15] capitalize",
                sizeClasses["sm"],
                sizeClasses[size],
                active ? activeColorClasses[color] : colorClasses[color],
                disabled && "opacity-60 cursor-not-allowed",
                className,
            )}
            {...props}
        />
    )
}
