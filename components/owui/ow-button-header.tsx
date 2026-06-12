import * as React from "react"
import Link from "next/link"
import {cn} from "@/lib/utils"
import {OwLogo} from "@/components/owui/ow-logo"

type Props = React.ComponentProps<"button"> & {
    icon?: React.ReactNode
    kbd?: string
  href?: string
  target?: string
  rel?: string
}

export function OwButtonHeader({icon, kbd, className, children, href, target, rel, ...props}: Props) {
  const sharedClass = cn(
    "ow-button-header cursor-pointer inline-flex items-center gap-2 rounded-[8px] border-2 border-black bg-slate-50 p-0.5 pr-2 transition-colors",
    "hover:border-primary hover:bg-white",
    className,
  )
  const inner = (
    <>
            <span className="bg-primary rounded w-8 h-8 flex justify-center items-center text-white shrink-0">
                {icon ?? <OwLogo variant="full" color="white" href={null} className="w-5"/>}
            </span>
            <span className="flex-1 text-left text-label">{children}</span>
            {kbd && (
                <kbd className="hidden items-center gap-0.5 rounded px-1.5 text-xs md:flex opacity-50">
                    <span className="text-sm">⌘</span>{kbd}
                </kbd>
            )}
    </>
    )
  if (href) {
    return <Link href={href} target={target} rel={rel} className={sharedClass}>{inner}</Link>
  }
  return <button className={sharedClass} {...props}>{inner}</button>
}
