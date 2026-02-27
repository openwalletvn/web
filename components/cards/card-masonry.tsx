'use client';

import Masonry from 'react-masonry-css';
import type { Card } from '@/lib/api';
import { CardItem } from '@/app/(marketing)/_components/card-item';

const breakpointCols = { default: 5, 1023: 4, 767: 3, 639: 2 };

export function CardMasonry({ cards }: { cards: Card[] }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {cards.map((card) => (
        <div key={card.id} className="mb-4">
          <CardItem card={card} />
        </div>
      ))}
    </Masonry>
  );
}
