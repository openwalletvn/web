'use client';

import Masonry from 'react-masonry-css';
import type { Card } from '@/lib/api';
import { CardTile } from '@/components/cards/variants/card-tile';

const breakpointCols = { default: 5, 1023: 4, 767: 3, 639: 2 };

export function CardMasonry({ cards }: { cards: Card[] }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="ow-card-masonry flex -ml-4 w-auto -mb-8"
      columnClassName="pl-4 bg-clip-padding"
    >
      {cards.map((card) => (
        <div key={card.id} className="mb-8">
          <CardTile card={card} />
        </div>
      ))}
    </Masonry>
  );
}
