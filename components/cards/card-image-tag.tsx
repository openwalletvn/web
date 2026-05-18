'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {IconCreditCard} from '@tabler/icons-react';
import {ShimmerLayer} from '@/components/phucbm/shimmer-layer';
import {cn} from '@/lib/utils';

interface Props {
    src: string;
    alt: string;
    width: number;
    height: number;
    lqip?: string;
    tilt?: boolean;
    className?: string;
}

export function CardImageTag({src, alt, width, height, lqip, tilt = false, className}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [tiltState, setTiltState] = useState({x: 0, y: 0});
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setRadius(entry.contentRect.width * 0.037);
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleLoad = () => setLoaded(true);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = containerRef.current;
        if (!el) return;
        const {left, top, width: w, height: h} = el.getBoundingClientRect();
        const nx = (e.clientX - left) / w - 0.5;
        const ny = (e.clientY - top) / h - 0.5;
        setTiltState({x: nx * 10, y: -ny * 10});
    };

    const tiltHandlers = tilt ? {
        onMouseMove: handleMouseMove,
        onMouseEnter: () => setHovering(true),
        onMouseLeave: () => {setHovering(false); setTiltState({x: 0, y: 0});},
    } : {};

    const tiltStyle = tilt ? {
        transform: `perspective(800px) rotateX(${tiltState.y}deg) rotateY(${tiltState.x}deg)`,
        transition: hovering ? 'transform 0.05s linear' : 'transform 0.5s ease',
    } : {};

    return (
        <div
            ref={containerRef}
            className={cn('card-image-tag relative overflow-hidden group/shimmer', className)}
            style={{aspectRatio: `${width} / ${height}`, borderRadius: radius, ...tiltStyle}}
            {...tiltHandlers}
        >
            {!loaded && !lqip && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <IconCreditCard size={24} className="text-slate-300"/>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    'object-cover size-full transition-opacity duration-200',
                    !loaded && !lqip ? 'opacity-0' : 'opacity-100'
                )}
                onLoad={handleLoad}
                {...(lqip ? {placeholder: 'blur' as const, blurDataURL: lqip} : {})}
            />
            <ShimmerLayer/>
        </div>
    );
}
