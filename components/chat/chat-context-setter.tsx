'use client';

import { useEffect } from 'react';
import { useChatContext } from '@/components/chat/chat-provider';
import type { PageContext } from '@/lib/chat/page-context';

export function ChatContextSetter({ context }: { context: NonNullable<PageContext> }) {
    const { setPageContext } = useChatContext();
    const key = context.type === 'card' ? context.cardId : context.bankId;

    useEffect(() => {
        setPageContext(context);
        return () => setPageContext(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return null;
}
