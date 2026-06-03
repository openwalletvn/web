"use client";
import React, {useState} from "react";
import {motion} from "motion/react";
import {cn, hexToRgba} from "@/lib/utils";

const WobbleCard = ({
                        children,
                        containerClassName,
                        className,
                        style,
                    }: {
    children: React.ReactNode;
    containerClassName?: string;
    className?: string;
    style?: React.CSSProperties;
}) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        const {clientX, clientY} = event;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (clientX - (rect.left + rect.width / 2)) / 20;
        const y = (clientY - (rect.top + rect.height / 2)) / 20;
        setMousePosition({x, y});
    };

    return (
        <motion.section
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({x: 0, y: 0});
            }}
            style={{
                transform: isHovering
                    ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
                    : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
                transition: "transform 0.1s ease-out",
                ...style,
            }}
            className={cn("mx-auto w-full bg-indigo-800 relative rounded-lg overflow-hidden", containerClassName)}
        >
            <div
                className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-lg overflow-hidden"
                style={{
                    boxShadow:
                        "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
                }}
            >
                <motion.div
                    style={{
                        transform: isHovering
                            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
                            : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
                        transition: "transform 0.1s ease-out",
                    }}
                    className={cn("h-full px-4 py-20 sm:px-10", className)}
                >
                    <Noise/>
                    {children}
                </motion.div>
            </div>
        </motion.section>
    );
};

const Noise = () => (
    <div
        className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
        style={{backgroundImage: "url(/noise.webp)", backgroundSize: "30%"}}
    />
);

// ─── OW wrapper ───────────────────────────────────────────────────────────────

type OwWobbleCardProps = {
    brandColor?: string;
    children?: React.ReactNode;
    renderCondition?: boolean | null;
    asChild?: boolean;
    containerClassName?: string;
    className?: string;
};

const INNER_CLASS = "flex flex-col justify-center items-center text-center gap-4 z-20 relative w-full h-full";

export function OwWobbleCard({children, brandColor = "#e1795d", renderCondition, asChild, containerClassName, className}: OwWobbleCardProps) {
    if (typeof renderCondition === "boolean" && !renderCondition) return null;

    const cardStyle = brandColor ? {backgroundColor: hexToRgba(brandColor, 0.9)} : undefined;

    if (asChild) {
        const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
        const merged = React.cloneElement(child, {
            className: [INNER_CLASS, child.props.className].filter(Boolean).join(" "),
        });
        return (
            <WobbleCard containerClassName={cn("ow-wobble-card col-span-1 h-full", containerClassName)} className={cn("p-8", className)} style={cardStyle}>
                {merged}
            </WobbleCard>
        );
    }

    return (
        <WobbleCard containerClassName={cn("ow-wobble-card col-span-1 h-full", containerClassName)} className={cn("p-8", className)} style={cardStyle}>
            <div className={INNER_CLASS}>{children}</div>
        </WobbleCard>
    );
}
