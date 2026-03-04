'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {IconCreditCard} from '@tabler/icons-react';
import {type Card, getCardImageUrl} from '@/lib/api';
import {ShimmerLayer} from "@/components/phucbm/shimmer-layer";
import {cn} from "@/lib/utils";

interface Props {
    card: Card;
    className?: string;
    classNameVertical?: string;
}

export function CardImage({card, className, classNameVertical}: Props) {
    const isVertical = card.image?.orientation === 'vertical';
    const containerRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const defaultRatio = isVertical ? '2/3' : '16/10';
    const initialRatio = card.image?.width && card.image?.height
        ? `${card.image.width} / ${card.image.height}`
        : defaultRatio;
    const [ratio, setRatio] = useState<string>(initialRatio);

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

    const imageUrl = getCardImageUrl(card);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth && img.naturalHeight) {
            setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
        }
        setLoaded(true);
    };

    return (
        <div
            ref={containerRef}
            className={cn("card-image relative w-full overflow-hidden group/shimmer", className, isVertical ? classNameVertical : className)}
            style={{aspectRatio: ratio, borderRadius: radius}}
        >
            {!loaded && !card.image?.lqip && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <IconCreditCard size={32} className="text-slate-300"/>
                </div>
            )}
            {imageUrl && (
                card.image?.width && card.image?.height ? (
                    <Image
                        src={imageUrl}
                        alt={card.name}
                        title={card.name}
                        width={card.image.width}
                        height={card.image.height}
                        className={cn(
                            'object-cover size-full transition-opacity duration-200',
                            !loaded && !card.image?.lqip ? 'opacity-0' : 'opacity-100'
                        )}
                        onLoad={handleLoad}
                        {...(card.image?.lqip ? {placeholder: 'blur' as const, blurDataURL: card.image.lqip} : {})}
                    />
                ) : (
                    <Image
                        src={imageUrl}
                        alt={card.name}
                        title={card.name}
                        fill
                        className={cn(
                            'object-cover size-full transition-opacity duration-200',
                            !loaded && !card.image?.lqip ? 'opacity-0' : 'opacity-100'
                        )}
                        onLoad={handleLoad}
                        {...(card.image?.lqip ? {placeholder: 'blur' as const, blurDataURL: card.image.lqip} : {})}
                    />
                )
            )}

            <ShimmerLayer/>
        </div>
    );
}
