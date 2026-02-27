'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {IconCreditCard} from '@tabler/icons-react';
import {type Card, getCardImageUrl} from '@/lib/api';
import {ShimmerLayer} from "@/components/phucbm/shimmer-layer";

interface Props {
  card: Card;
  className?: string;
}

export function CardImage({ card, className }: Props) {
  const isVertical = card.image_orientation === 'vertical';
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState<string>(isVertical ? '2/3' : '16/10');

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
      className={`relative w-full overflow-hidden group/shimmer ${className ? className : ''}`}
      style={{ aspectRatio: ratio, borderRadius: radius }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <IconCreditCard size={32} className="text-slate-300" />
        </div>
      )}
      <Image
        src={getCardImageUrl(card)}
        alt=""
        fill
        className={`object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
      />


        <ShimmerLayer/>
    </div>
  );
}
