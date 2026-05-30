'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, ClipboardCopyIcon, Maximize2Icon, PlusIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useChatContext } from '@/components/chat/chat-provider';
import { ChatRuntime } from '@/components/chat/chat-runtime';
import {
    createConversation,
    getConversation,
    listConversations,
    type Conversation,
} from '@/lib/chat/conversation-store';
import {OwLogo} from "@/components/ow-ui/ow-logo";

function groupConversations(convos: Conversation[]) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const yesterdayStart = todayStart - 86400000;
    return {
        today: convos.filter((c) => c.updatedAt >= todayStart),
        yesterday: convos.filter((c) => c.updatedAt >= yesterdayStart && c.updatedAt < todayStart),
        earlier: convos.filter((c) => c.updatedAt < yesterdayStart),
    };
}

export function ChatPanel() {
    const { isOpen, close, toggle, pageContext } = useChatContext();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const list = listConversations();
        if (list.length > 0) {
            setConvos(list);
            setActiveId(list[0].id);
        } else {
            const fresh = createConversation();
            setConvos([fresh]);
            setActiveId(fresh.id);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [toggle]);

    const refresh = useCallback(() => setConvos(listConversations()), []);

    const handleCopy = useCallback(() => {
        const convo = getConversation(activeId);
        if (!convo) return;
        navigator.clipboard.writeText(JSON.stringify(convo.messages, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [activeId]);

    const handleNew = useCallback(() => {
        const convo = createConversation();
        setConvos(listConversations());
        setActiveId(convo.id);
    }, []);

    const grouped = groupConversations(convos);

    return (
        <div
            className={cn(
                'ow-chat-panel fixed z-50 transition-all duration-300 ease-in-out',
                // Mobile: full-screen bottom sheet
                'bottom-0 right-0 w-full h-full',
                // Desktop: floating bottom-right panel
                'sm:bottom-4 sm:right-4 sm:w-[480px] sm:h-[80vh] sm:rounded-xl',
                'flex flex-col border bg-background shadow-2xl',
                isOpen
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 translate-y-4 sm:translate-y-2',
            )}
        >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3 sm:rounded-t-xl">
                <span className="flex-1 font-semibold text-sm flex gap-1 items-center">
                    <OwLogo className="w-6" variant="full" color="red" href="/chat" />
                    Chat
                </span>

                {mounted && convos.length > 0 && (
                    <Select value={activeId} onValueChange={setActiveId}>
                        <SelectTrigger className="h-8 w-40 text-xs">
                            <SelectValue placeholder="Chọn cuộc trò chuyện" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            {grouped.today.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>Hôm nay</SelectLabel>
                                    {grouped.today.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <span className="block max-w-[140px] truncate">{c.title}</span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}
                            {grouped.today.length > 0 && grouped.yesterday.length > 0 && <SelectSeparator />}
                            {grouped.yesterday.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>Hôm qua</SelectLabel>
                                    {grouped.yesterday.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <span className="block max-w-[140px] truncate">{c.title}</span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}
                            {grouped.earlier.length > 0 &&
                                (grouped.today.length > 0 || grouped.yesterday.length > 0) && (
                                    <SelectSeparator />
                                )}
                            {grouped.earlier.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>Trước đó</SelectLabel>
                                    {grouped.earlier.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            <span className="block max-w-[140px] truncate">{c.title}</span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}
                        </SelectContent>
                    </Select>
                )}

                <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={handleCopy} title="Copy messages (debug)">
                    {copied ? <CheckIcon className="size-4 text-green-500" /> : <ClipboardCopyIcon className="size-4" />}
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0"
                    onClick={() => { close(); router.push(`/chat?id=${activeId}`); }}
                    title="Mở rộng"
                >
                    <Maximize2Icon className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={handleNew} title="Cuộc trò chuyện mới">
                    <PlusIcon className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={close} title="Đóng">
                    <XIcon className="size-4" />
                </Button>
            </div>

            {/* Thread */}
            <div className="relative min-h-0 flex-1 overflow-hidden sm:rounded-b-xl">
                {mounted && activeId && (
                    <ChatRuntime
                        key={activeId}
                        convoId={activeId}
                        onSaved={refresh}
                        pageContext={pageContext}
                    />
                )}

                {/* Page context hint badge */}
                {pageContext && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-[80px]">
                        <span className="pointer-events-auto rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                            Đang xem:{' '}
                            <strong>
                                {pageContext.type === 'card' ? pageContext.cardName : pageContext.bankName}
                            </strong>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}