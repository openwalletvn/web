'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime, AssistantChatTransport } from '@assistant-ui/react-ai-sdk';
import { Thread } from '@/components/assistant-ui/thread';
import { listConversations, saveConversation } from '@/lib/chat/conversation-store';
import type { PageContext } from '@/lib/chat/page-context';
import type { UIMessage } from 'ai';

export function ChatRuntime({
    convoId,
    onSaved,
    pageContext,
}: {
    convoId: string;
    onSaved: () => void;
    pageContext?: PageContext;
}) {
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [initialMessages] = useState<UIMessage[]>(
        () => listConversations().find((c) => c.id === convoId)?.messages ?? [],
    );

    const debouncedSave = useCallback(
        (messages: UIMessage[]) => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(() => {
                saveConversation(convoId, messages);
                onSaved();
            }, 500);
        },
        [convoId, onSaved],
    );

    useEffect(
        () => () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
        },
        [],
    );

    const runtime = useChatRuntime({
        transport: new AssistantChatTransport({
            api: '/api/chat',
            body: pageContext ? { pageContext } : undefined,
        }),
        messages: initialMessages,
        onFinish: ({ messages }) => debouncedSave(messages),
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
        </AssistantRuntimeProvider>
    );
}
