'use client';

import {IconScale} from '@tabler/icons-react';
import {useCompareList} from '@/lib/use-compare-list';
import {OwButton} from '@/components/owui/ow-button';

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
        <OwButton
            color="outline"
            size="sm"
            active={inList}
            disabled={disabled}
            onClick={handleClick}
            className="ow-compare-button w-full max-w-full"
        >
            <IconScale size={16} className="shrink-0"/>
            {inList ? 'Đang so sánh' : disabled ? 'Đã đủ 3 thẻ' : 'Thêm vào so sánh'}
        </OwButton>
    );
}
