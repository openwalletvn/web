'use client';

import {useState} from 'react';
import Masonry from 'react-masonry-css';
import type {Card} from '@/lib/api';
import {CardDisplay} from '@/components/cards/variants/card-display';
import {OwButton} from '@/components/ow-ui/ow-button';

const breakpointCols = { default: 5, 1023: 4, 767: 3, 639: 2 };

export function CardMasonry({ cards, maxDisplay = 12 }: { cards: Card[]; maxDisplay?: number }) {
  const [displayCount, setDisplayCount] = useState(maxDisplay);
  const visible = cards.slice(0, displayCount);
  const hasMore = displayCount < cards.length;

  return (
    <div>
      <Masonry
        breakpointCols={breakpointCols}
        className="ow-card-masonry flex -ml-4 w-auto -mb-8"
        columnClassName="pl-4 bg-clip-padding"
      >
        {visible.map((card) => (
          <div key={card.id} className="mb-8">
            <CardDisplay variant="tile" card={card} />
          </div>
        ))}
      </Masonry>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <OwButton color="outline" size="sm" onClick={() => setDisplayCount(c => Math.min(c + maxDisplay, cards.length))}>
            Xem thêm ({displayCount}/{cards.length})
          </OwButton>
        </div>
      )}
    </div>
  );
}
