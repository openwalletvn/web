'use client';

import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {CheckIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {OwTrafficLights} from '@/components/ow-ui/ow-traffic-lights';
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
import {useChatContext} from '@/components/chat/chat-provider';
import {ChatRuntime} from '@/components/chat/chat-runtime';
import {getUserId} from '@/lib/chat/anonymous-user';
import {type Conversation, createConversation, listConversations,} from '@/lib/chat/conversation-store';
import {OwLogo} from "@/components/ow-ui/ow-logo";
import {IconArrowsMaximize, IconMinus, IconPlus} from "@tabler/icons-react";

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
    const [userId, setUserId] = useState<string | null>(null);
    const [userIdCopied, setUserIdCopied] = useState(false);

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
        setUserId(getUserId());
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
                'bottom-0 right-0 w-full h-full',
                'sm:bottom-2 sm:right-2 sm:w-[480px] sm:h-[80vh] sm:rounded-lg max-sm:rounded-none',
                'shadow-2xl',
                'flex flex-col sm:border bg-background',
                isOpen
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 translate-y-4 sm:translate-y-2',
            )}
        >
            {/* Header */}
            <div className="ow-chat-panel-header flex justify-between items-center gap-2 border-b px-3 py-2">
                <div className="font-semibold text-sm flex gap-1 items-center">
                    <OwLogo className="w-6" variant="full" color="red" href="/chat" />
                    Owie
                </div>

                <div className="flex gap-3 items-center">
                    {mounted && convos.length > 0 && (
                        <Select value={activeId} onValueChange={setActiveId}>
                            <SelectTrigger className="h-8 w-40 text-xs">
                                <SelectValue placeholder="Chọn cuộc trò chuyện"/>
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
                                {grouped.today.length > 0 && grouped.yesterday.length > 0 && <SelectSeparator/>}
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
                                        <SelectSeparator/>
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

                    <OwTrafficLights
                        buttons={[
                            {
                                id: 'new',
                                color: '#febc2e',
                                label: 'Cuộc trò chuyện mới',
                                icon: <IconPlus stroke={2} className="size-3"/>,
                                onClick: handleNew,
                            },
                            {
                                id: 'expand',
                                color: '#28c840',
                                label: 'Mở rộng',
                                icon: <IconArrowsMaximize stroke={2} className="size-3"/>,
                                onClick: () => {
                                    close();
                                    router.push(`/chat?id=${activeId}`);
                                },
                            },
                            {
                                id: 'close',
                                color: '#ff5f57',
                                label: 'Đóng',
                                icon: <IconMinus stroke={2} className="size-3"/>,
                                onClick: close,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Anonymous user chip */}
            {mounted && userId && (
                <div className="ow-chat-info-bar shrink-0 flex items-center justify-between px-4 py-1 border-b bg-muted/30 text-xs">
                    <div className="">
                        {/* Page context hint badge */}
                        {pageContext && (
                            <>
                                Đang xem:{' '}
                                <strong>
                                    {pageContext.type === 'card' ? pageContext.cardName : pageContext.bankName}
                                </strong>
                            </>
                        )}
                    </div>

                    <div>
                        <button
                            className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            title="Click to copy your anonymous ID"
                            onClick={() => {
                                navigator.clipboard.writeText(userId);
                                setUserIdCopied(true);
                                setTimeout(() => setUserIdCopied(false), 2000);
                            }}
                        >
                            {userIdCopied ? <CheckIcon className="size-3 text-green-500" /> : null}
                            {userId}
                        </button>
                    </div>
                </div>
            )}

            {/* Thread */}
            <div className="ow-chat-thread relative min-h-0 flex-1 overflow-hidden sm:rounded-b-xl">
                {mounted && activeId && (
                    <ChatRuntime
                        key={activeId}
                        convoId={activeId}
                        onSaved={refresh}
                        pageContext={pageContext}
                    />
                )}
            </div>
        </div>
    );
}