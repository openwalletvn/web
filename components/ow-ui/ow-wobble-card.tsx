import {hexToRgba} from "@/lib/utils";
import {WobbleCard} from "@/components/ui/wobble-card";
import Link from "next/link";
import React from "react";

type Props = {
    brandColor?: string;
    children?: React.ReactNode;
    renderCondition?: boolean | null;
    href?: string;
};

export function OwWobbleCard({children, brandColor = "#e1795d", renderCondition, href}: Props) {
    if (typeof renderCondition === "boolean" && !renderCondition) return null;

    const inner = (
        <WobbleCard
            containerClassName="ow-wobble-card col-span-1 h-full"
            className="p-8"
            style={{backgroundColor: hexToRgba(brandColor, 0.8)}}
        >
            <div className="flex flex-col justify-center items-center text-center gap-4 z-20 relative">
                {children}
            </div>
        </WobbleCard>
    );

    if (href) {
        return <Link href={href} className="block">{inner}</Link>;
    }

    return inner;
}
