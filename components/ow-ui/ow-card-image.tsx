'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {IconCreditCard} from '@tabler/icons-react';
import {ShimmerLayer} from '@/components/phucbm/shimmer-layer';
import {cn} from '@/lib/utils';
import type {CardModel} from '@/lib/card-model';

type RawProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    lqip?: string;
    card?: never;
    classNameVertical?: never;
};

type CardProps = {
    card: CardModel;
    src?: never;
    alt?: never;
    width?: never;
    height?: never;
    lqip?: never;
    classNameVertical?: string;
};

type Props = (RawProps | CardProps) & {
    tilt?: boolean;
    priority?: boolean;
    className?: string;
};

export function OwCardImage(props: Props) {
    const {tilt = false, priority = false, className} = props;

    const image = props.card ? props.card.getImage() : undefined;
    const isVertical = image?.orientation === 'vertical';
    const src = props.card ? props.card.getCardImageUrl() : props.src;
    const alt = props.card ? props.card.getName() : props.alt;
    const width = props.card ? (image?.width ?? (isVertical ? 2 : 16)) : props.width;
    const height = props.card ? (image?.height ?? (isVertical ? 3 : 10)) : props.height;
    const lqip = props.card ? image?.lqip : props.lqip;
    const containerClass = cn('w-full', className, isVertical ? props.classNameVertical : className);

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

    if (!src) {
        return <div className={cn(containerClass, 'relative overflow-hidden')} style={{aspectRatio: `${width} / ${height}`}}/>;
    }

    return (
        <div
            ref={containerRef}
            className={cn('ow-card-image relative overflow-hidden group/shimmer', containerClass)}
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
                priority={priority}
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
