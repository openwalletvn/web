'use client';

import Masonry from 'react-masonry-css';
import type {CardModel} from '@/lib/card-model';
import {CardDisplay} from '@/components/cards/variants/card-display';

const breakpointCols = { default: 5, 1023: 4, 767: 3, 639: 2 };

export function CardMasonry({ cards }: { cards: CardModel[] }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="ow-card-masonry flex -ml-4 w-auto -mb-8"
      columnClassName="pl-4 bg-clip-padding"
    >
      {cards.map((card) => (
        <div key={card.getId()} className="mb-8">
          <CardDisplay variant="tile" card={card} />
        </div>
      ))}
    </Masonry>
  );
}
