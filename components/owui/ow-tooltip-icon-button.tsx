"use client";

import {type ComponentPropsWithRef, forwardRef} from "react";
import {Slot} from "radix-ui";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {OwTooltip, type OwTooltipProps} from "./ow-tooltip";

export type OwTooltipIconButtonProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: OwTooltipProps["side"];
};

export const OwTooltipIconButton = forwardRef<HTMLButtonElement, OwTooltipIconButtonProps>(
  ({children, tooltip, side = "top", className, ...rest}, ref) => {
    return (
      <OwTooltip tooltip={tooltip} side={side}>
        <Button
          variant="ghost"
          size="icon"
          {...rest}
          className={cn("aui-button-icon size-6 p-1", className)}
          ref={ref}
        >
          <Slot.Slottable>{children}</Slot.Slottable>
          <span className="aui-sr-only sr-only">{tooltip}</span>
        </Button>
      </OwTooltip>
    );
  }
);

OwTooltipIconButton.displayName = "OwTooltipIconButton";
