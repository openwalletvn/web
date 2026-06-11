"use client";

import React, {useId, useState} from "react";
import {cn} from "@/lib/utils";

type TooltipAlign = "top" | "bottom";

export interface OwTooltipProps {
  children: React.ReactNode;
  tooltip?: string | React.ReactNode;
  tooltipAlign?: TooltipAlign;
  className?: string;
  classNameTooltip?: string;
}

export function OwTooltip({
                            tooltip,
                            tooltipAlign = "top",
                            className,
                            classNameTooltip,
                            children,
                          }: OwTooltipProps) {
  const id = useId();
  const [rotation] = useState(() => Math.floor(Math.random() * 11) - 5);
  const [hasHovered, setHasHovered] = useState(false);

  return (
    <>
      <div
        className={cn("ow-tooltip group relative inline-block", className)}
        data-tooltip-align={tooltipAlign}
        onMouseEnter={() => setHasHovered(true)}
      >
        <div className="relative z-20" aria-describedby={tooltip ? id : undefined}>
          {children}
        </div>

        {tooltip && hasHovered && (
          <>
            <style>{TOOLTIP_KEYFRAMES}</style>
            <div
              id={id}
              role="tooltip"
              style={{"--tooltip-rotation": `${rotation}deg`} as React.CSSProperties}
              className={cn(
                "ow-tooltip-bubble absolute z-10 left-1/2 -translate-x-1/2 px-1 py-0.5 text-xs font-bold rounded bg-black text-white pointer-events-none whitespace-nowrap origin-center",
                tooltipAlign === "top" && "bottom-full mb-1",
                tooltipAlign === "bottom" && "top-full mt-1",
                classNameTooltip
              )}
            >
              {tooltip}
            </div>
          </>
        )}
      </div>
    </>
  );
}

const TOOLTIP_KEYFRAMES = `
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
  .ow-tooltip-bubble {
    animation: tooltip-exit 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .group:hover .ow-tooltip-bubble {
    animation: tooltip-enter-top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .group[data-tooltip-align="bottom"]:hover .ow-tooltip-bubble {
    animation: tooltip-enter-bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;
