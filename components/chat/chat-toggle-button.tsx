'use client';

import { MessageCircleIcon } from 'lucide-react';
import { useChatContext } from '@/components/chat/chat-provider';

export function ChatToggleButton() {
    const { toggle, isOpen } = useChatContext();
    return (
        <button
            type="button"
            aria-pressed={isOpen}
            aria-label="Mở tư vấn AI"
            onClick={toggle}
            className="ow-chat-toggle-button cursor-pointer flex items-center gap-2 rounded-md border-2 border-black bg-slate-50 p-0.5 transition-colors hover:border-primary hover:bg-white"
        >
            <span className="bg-primary rounded-sm w-8 h-8 flex justify-center items-center text-white">
                <MessageCircleIcon className="size-4 shrink-0" />
            </span>
            <span className="pr-2 text-sm">Owie</span>
            <kbd className="hidden items-center gap-0.5 rounded px-1.5 text-xs md:flex opacity-50 mr-1">
                <span className="text-[16px]">⌘</span>/
            </kbd>
        </button>
    );
}
