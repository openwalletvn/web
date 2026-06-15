'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatRuntime } from '@/components/chat/chat-runtime';
import { SearchDialog } from '@/components/search/search-dialog';
import { AppShell } from '@/components/app/app-shell';
import {
    type Conversation,
    createConversation,
    getLastActiveId,
    listConversations,
    setLastActiveId,
} from '@/lib/chat/conversation-store';
import { useChatSidebarStore } from '@/lib/stores/chat-sidebar-store';

export function ChatPageClient({ initialId }: { initialId?: string } = {}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { setConvos, setActiveId, activeId } = useChatSidebarStore();

    const selectConvo = useCallback(
        (id: string) => {
            setActiveId(id);
            setLastActiveId(id);
            router.replace(`/chat?id=${id}`, { scroll: false });
        },
        [router, setActiveId],
    );

    useEffect(() => {
        const list = listConversations();
        let resolvedId: string;
        if (list.length > 0) {
            setConvos(list);
            const lastId = initialId ?? getLastActiveId();
            resolvedId = lastId && list.find((c: Conversation) => c.id === lastId) ? lastId : list[0].id;
        } else {
            const fresh = createConversation();
            setConvos([fresh]);
            resolvedId = fresh.id;
        }
        selectConvo(resolvedId);
        setMounted(true);
    }, [initialId]); // eslint-disable-line react-hooks/exhaustive-deps

    const refresh = useCallback(() => setConvos(listConversations()), [setConvos]);

    return (
        <AppShell
            className="ow-chat-sidebar-inset"
            headerRight={
                <>
                    <div className="hidden sm:flex"><SearchDialog /></div>
                    <div className="flex sm:hidden"><SearchDialog mobileOnly /></div>
                </>
            }
        >
            <div className="h-full">
                {mounted && activeId && (
                    <ChatRuntime key={activeId} convoId={activeId} onSaved={refresh} />
                )}
            </div>
        </AppShell>
    );
}
