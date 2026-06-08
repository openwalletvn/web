'use client';

import { useChatContext } from '@/components/chat/chat-provider';
import { OwButton, type OwButtonSize } from '@/components/ow-ui/ow-button';
import type { OwButtonColor } from '@/components/ow-ui/ow-button';

interface Props {
    label?: string;
    size?: OwButtonSize;
    color?: OwButtonColor;
    className?: string;
}

export function OpenOwieButton({ label = 'Hỏi Owie ngay', size = 'md', color = 'default', className }: Props) {
    const { open } = useChatContext();
    return (
        <OwButton onClick={open} size={size} color={color} className={className}>
            {label}
        </OwButton>
    );
}
