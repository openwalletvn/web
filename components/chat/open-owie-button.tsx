'use client';

import { useRouter } from 'next/navigation';
import { useChatContext } from '@/components/chat/chat-provider';
import { OwButton, type OwButtonSize } from '@/components/owui/ow-button';
import type { OwButtonColor } from '@/components/owui/ow-button';

interface Props {
    label?: string;
    size?: OwButtonSize;
    color?: OwButtonColor;
    className?: string;
}

export function OpenOwieButton({ label = 'Hỏi Owie ngay', size = 'md', color = 'default', className }: Props) {
    const { open } = useChatContext();
    const router = useRouter();

    function handleClick() {
        if (window.innerWidth <= 1024) {
            router.push('/chat');
        } else {
            open();
        }
    }

    return (
        <OwButton onClick={handleClick} size={size} color={color} className={className}>
            {label}
        </OwButton>
    );
}
