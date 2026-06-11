"use client";

import React, {useId, useState} from "react";
import {cn} from "@/lib/utils";

type TooltipAlign = "top" | "bottom";

export interface OwTooltipProps {
  children: React.ReactNode;
  tooltip?: string | React.ReactNode;
  side?: TooltipAlign;
  className?: string;
  classNameTooltip?: string;
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
  .ow-tooltip-trigger:hover .ow-tooltip-bubble,
  .ow-tooltip-trigger:focus-within .ow-tooltip-bubble {
    animation: tooltip-enter-top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .ow-tooltip-trigger[data-tooltip-align="bottom"]:hover .ow-tooltip-bubble,
  .ow-tooltip-trigger[data-tooltip-align="bottom"]:focus-within .ow-tooltip-bubble {
    animation: tooltip-enter-bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

export function OwTooltip({
                            tooltip,
                            side = "top",
                            className,
                            classNameTooltip,
                            children,
                          }: OwTooltipProps) {
  const id = useId();
  const [rotation] = useState(() => Math.floor(Math.random() * 11) - 5);
  const [hasInteracted, setHasInteracted] = useState(false);

  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

  const trigger = React.cloneElement(child, {
    ...child.props,
    className: cn("ow-tooltip-trigger relative", child.props.className, className),
    "aria-describedby": tooltip ? id : undefined,
    "data-tooltip-align": side,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      setHasInteracted(true);
      child.props.onMouseEnter?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      setHasInteracted(true);
      child.props.onFocus?.(e);
    },
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <>
      {React.cloneElement(trigger, {}, [
        ...React.Children.toArray(trigger.props.children),
        tooltip && hasInteracted ? (
          <React.Fragment key="ow-bubble">
            <style>{TOOLTIP_KEYFRAMES}</style>
            <div
              id={id}
              role="tooltip"
              style={{"--tooltip-rotation": `${rotation}deg`} as React.CSSProperties}
              className={cn(
                "ow-tooltip-bubble absolute z-10 left-1/2 -translate-x-1/2 px-1 py-0.5 text-xs font-bold rounded bg-black text-white pointer-events-none whitespace-nowrap origin-center",
                side === "top" && "bottom-full mb-1",
                side === "bottom" && "top-full mt-1",
                classNameTooltip
              )}
            >
              {tooltip}
            </div>
          </React.Fragment>
        ) : null,
      ])}
    </>
  );
}
