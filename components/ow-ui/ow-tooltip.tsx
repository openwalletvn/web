"use client";

import React, {useId} from "react";
import {cn} from "@/lib/utils";

type TooltipAlign = "top" | "bottom";

export interface OwTooltipProps {
    children: React.ReactNode;
    tooltip?: string | React.ReactNode;
    tooltipAlign?: TooltipAlign;
    className?: string;
    classNameTooltip?: string;
}

const TOOLTIP_STYLES = `
  @keyframes tooltip-enter-top {
    from { opacity: 0; transform: translateY(10px) scale(0.9) rotate(0deg); }
    to   { opacity: 1; transform: translateY(0) scale(1) rotate(var(--tooltip-rotation)); }
  }
  @keyframes tooltip-enter-bottom {
    from { opacity: 0; transform: translateY(-10px) scale(0.9) rotate(0deg); }
    to   { opacity: 1; transform: translateY(0) scale(1) rotate(var(--tooltip-rotation)); }
  }
  @keyframes tooltip-exit {
    from { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
    to   { opacity: 0; transform: translateY(-8px) scale(0.95); }
  }
  .tooltip {
    opacity: 0;
    animation: tooltip-exit 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .tooltip-wrapper:hover .tooltip {
    opacity: 1;
    animation: tooltip-enter-top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .tooltip-wrapper[data-tooltip-align="bottom"]:hover .tooltip {
    animation: tooltip-enter-bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

export function OwTooltip({
    tooltip,
    tooltipAlign = "top",
    className,
    classNameTooltip,
    children,
}: OwTooltipProps) {
    const id = useId();

    const rotation = React.useMemo(
        () => Math.floor(Math.random() * 11) - 5,
        []
    );

    const tooltipStyle = React.useMemo(
        () => ({"--tooltip-rotation": `${rotation}deg`} as React.CSSProperties),
        [rotation]
    );

    return (
        <>
            <style>{TOOLTIP_STYLES}</style>
            <div
                className={cn("ow-tooltip tooltip-wrapper relative inline-block", className)}
                data-tooltip-align={tooltipAlign}
            >
                <div className="relative z-20" aria-describedby={tooltip ? id : undefined}>
                    {children}
                </div>

                {tooltip && (
                    <div
                        id={id}
                        suppressHydrationWarning
                        role="tooltip"
                        style={tooltipStyle}
                        className={cn(
                            "tooltip absolute z-10 left-1/2 -translate-x-1/2 px-1 py-0.5 text-xs font-bold rounded bg-black text-white pointer-events-none whitespace-nowrap origin-center",
                            tooltipAlign === "top" && "bottom-full mb-1",
                            tooltipAlign === "bottom" && "top-full mt-1",
                            classNameTooltip
                        )}
                    >
                        {tooltip}
                    </div>
                )}
            </div>
        </>
    );
}
