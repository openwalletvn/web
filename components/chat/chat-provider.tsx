'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PageContext } from '@/lib/chat/page-context';

type ChatContextValue = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    pageContext: PageContext;
    setPageContext: (ctx: PageContext) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pageContext, setPageContext] = useState<PageContext>(null);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((v) => !v), []);

    return (
        <ChatContext.Provider value={{ isOpen, open, close, toggle, pageContext, setPageContext }}>
            {children}
        </ChatContext.Provider>
    );
}

const NO_OP_CONTEXT: ChatContextValue = {
    isOpen: false,
    open: () => {},
    close: () => {},
    toggle: () => {},
    pageContext: null,
    setPageContext: () => {},
};

export function useChatContext() {
    return useContext(ChatContext) ?? NO_OP_CONTEXT;
}
