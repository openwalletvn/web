import * as React from "react"
import {Button, type buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {type VariantProps} from "class-variance-authority"

type OwButtonColor = "default" | "primary"
type OwButtonSize = "md" | "sm"

const colorClasses: Record<OwButtonColor, string> = {
    default: "bg-black !text-white border-2 border-black hover:bg-primary",
    primary: "bg-primary !text-white border-2 border-primary hover:bg-black",
}

const activeColorClasses: Record<OwButtonColor, string> = {
    default: "bg-black/10 !text-black border-2 border-black hover:bg-black/20",
    primary: "bg-primary/10 !text-primary border-2 border-primary hover:bg-primary/20",
}

const sizeClasses: Record<OwButtonSize, string> = {
    md: "text-[18px] min-h-[55px]",
    sm: "text-[14px] min-h-[40px]",
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
                "ow-button cursor-pointer rounded-full max-w-[320px] w-auto !whitespace-normal h-auto px-6 py-3 inline-flex items-center justify-center text-center font-display !leading-[1.15] capitalize",
                sizeClasses[size],
                active ? activeColorClasses[color] : colorClasses[color],
                disabled && "opacity-60 cursor-not-allowed",
                className,
            )}
            {...props}
        />
    )
}
