'use client';

import {type Card, getCardImageUrl} from '@/lib/api';
import {cn} from '@/lib/utils';
import {CardImageTag} from './card-image-tag';

interface Props {
    card: Card;
    className?: string;
    classNameVertical?: string;
    tilt?: boolean;
}

export function CardImage({card, className, classNameVertical, tilt = false}: Props) {
    const isVertical = card.image?.orientation === 'vertical';
    const imageUrl = getCardImageUrl(card);
    const width = card.image?.width ?? (isVertical ? 2 : 16);
    const height = card.image?.height ?? (isVertical ? 3 : 10);
    const containerClass = cn('card-image w-full', className, isVertical ? classNameVertical : className);

    if (!imageUrl) {
        return <div className={cn(containerClass, 'relative overflow-hidden')} style={{aspectRatio: `${width} / ${height}`}}/>;
    }

    return (
        <CardImageTag
            src={imageUrl}
            alt={card.name}
            width={width}
            height={height}
            lqip={card.image?.lqip}
            tilt={tilt}
            className={containerClass}
        />
    );
}
