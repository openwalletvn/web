'use client'

import { create } from 'zustand'
import type { Conversation } from '@/lib/chat/conversation-store'

interface ChatSidebarState {
    convos: Conversation[]
    activeId: string
    setConvos: (convos: Conversation[]) => void
    setActiveId: (id: string) => void
}

export const useChatSidebarStore = create<ChatSidebarState>((set) => ({
    convos: [],
    activeId: '',
    setConvos: (convos) => set({ convos }),
    setActiveId: (activeId) => set({ activeId }),
}))
