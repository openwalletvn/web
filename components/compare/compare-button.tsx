'use client';

import {IconScale} from '@tabler/icons-react';
import {useCompareList} from '@/lib/use-compare-list';
import {cn} from '@/lib/utils';

interface Props {
    card: {
        id: string;
        name: string;
        image_url?: string | null;
    };
}

export function CompareButton({card}: Props) {
    const {addToCompare, removeFromCompare, isInCompare, isFull} = useCompareList();
    const inList = isInCompare(card.id);
    const disabled = !inList && isFull;

    function handleClick() {
        if (inList) {
            removeFromCompare(card.id);
        } else {
            addToCompare(card.id, {name: card.name, image_url: card.image_url ?? null});
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={cn('ow-compare-button flex items-center justify-center gap-2 w-full px-4 py-2 rounded text-body-sm font-medium transition-colors', inList ? 'bg-primary/10 text-primary border border-primary hover:bg-primary/20' : disabled ? 'bg-surface text-text-muted border border-border cursor-not-allowed opacity-60' : 'bg-surface text-text-primary border border-border hover:border-primary hover:text-primary')}
        >
            <IconScale size={16} className="shrink-0"/>
            {inList ? 'Đang so sánh' : disabled ? 'Đã đủ 3 thẻ' : 'Thêm vào so sánh'}
        </button>
    );
}
