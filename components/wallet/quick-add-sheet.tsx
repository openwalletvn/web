'use client';

import { CardFormDialog } from './card-form-dialog';
import type { Card } from '@/lib/api';

interface Props {
  card: Card;
  open: boolean;
  onClose: () => void;
  onAfterSave?: () => void;
}

export function QuickAddSheet({ card, open, onClose, onAfterSave }: Props) {
  return (
    <CardFormDialog card={card} open={open} onClose={onClose} onAfterSave={onAfterSave} />
  );
}
