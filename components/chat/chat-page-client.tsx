'use client';

import { useRef, useEffect, useState } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime, AssistantChatTransport } from '@assistant-ui/react-ai-sdk';
import { Thread } from '@/components/assistant-ui/thread';
import type { UIMessage } from 'ai';

const STORAGE_KEY = 'ow-chat-history';

function loadMessages(): UIMessage[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as UIMessage[]) : [];
    } catch {
        return [];
    }
}

function saveMessages(messages: UIMessage[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
        // quota exceeded or private browsing — silently ignore
    }
}

export function ChatPageClient() {
    const [initialMessages] = useState<UIMessage[]>(() => loadMessages());
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedSave = (messages: UIMessage[]) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveMessages(messages), 500);
    };

    useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

    const runtime = useChatRuntime({
        transport: new AssistantChatTransport({ api: '/api/chat' }),
        messages: initialMessages,
        onFinish: ({ messages }) => debouncedSave(messages),
    });

    return (
        <div className="ow-chat-page-client flex h-full flex-col">
            <AssistantRuntimeProvider runtime={runtime}>
                <Thread />
            </AssistantRuntimeProvider>
        </div>
    );
}
