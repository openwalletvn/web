'use client';

import { useChatContext } from '@/components/chat/chat-provider';
import { OwButton, type OwButtonSize } from '@/components/ow-ui/ow-button';

interface Props {
    label?: string;
    size?: OwButtonSize;
    className?: string;
}

export function OpenOwieButton({ label = 'Hỏi Owie ngay', size = 'md', className }: Props) {
    const { open } = useChatContext();
    return (
        <OwButton onClick={open} size={size} className={className}>
            {label}
        </OwButton>
    );
}
