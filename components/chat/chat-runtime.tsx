'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime, AssistantChatTransport } from '@assistant-ui/react-ai-sdk';
import { jsonSchema } from 'ai';
import { Thread } from '@/components/assistant-ui/thread';
import { listConversations, saveConversation } from '@/lib/chat/conversation-store';
import { getUserId, getSessionId } from '@/lib/chat/anonymous-user';
import type { PageContext } from '@/lib/chat/page-context';
import type { UIMessage } from 'ai';

const chatMessageMetadataSchema = jsonSchema<{ usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number; reasoningTokens?: number; cachedInputTokens?: number }; modelId?: string }>({
    type: 'object',
    properties: {
        usage: {
            type: 'object',
            properties: {
                inputTokens: { type: 'number' },
                outputTokens: { type: 'number' },
                totalTokens: { type: 'number' },
                reasoningTokens: { type: 'number' },
                cachedInputTokens: { type: 'number' },
            },
        },
        modelId: { type: 'string' },
    },
});

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

    const [chatError, setChatError] = useState<string | null>(null);

    const runtime = useChatRuntime({
        transport: new AssistantChatTransport({
            api: '/api/chat',
            body: {
                ...(pageContext ? { pageContext } : {}),
                userId: getUserId(),
                sessionId: getSessionId(),
            },
        }),
        messageMetadataSchema: chatMessageMetadataSchema,
        messages: initialMessages,
        onFinish: ({ messages }) => {
            setChatError(null);
            debouncedSave(messages);
        },
        onError: (err) => {
            console.error('[chat] runtime error:', err);
            setChatError(err instanceof Error ? err.message : String(err));
        },
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {chatError && (
                <div className="ow-chat-error px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
                    Lỗi: {chatError}
                </div>
            )}
            <Thread />
        </AssistantRuntimeProvider>
    );
}
