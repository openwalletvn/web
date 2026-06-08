'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChatRuntime } from '@/components/chat/chat-runtime';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarInset,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import {
    listConversations,
    createConversation,
    deleteConversation,
    type Conversation,
} from '@/lib/chat/conversation-store';

function groupConversations(convos: Conversation[]) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const yesterdayStart = todayStart - 86400000;
    return {
        today: convos.filter((c) => c.updatedAt >= todayStart),
        yesterday: convos.filter((c) => c.updatedAt >= yesterdayStart && c.updatedAt < todayStart),
        earlier: convos.filter((c) => c.updatedAt < yesterdayStart),
    };
}

export function ChatPageClient() {
    const [mounted, setMounted] = useState(false);
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string>('');

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

    const refresh = useCallback(() => setConvos(listConversations()), []);

    const handleNew = useCallback(() => {
        const convo = createConversation();
        setConvos(listConversations());
        setActiveId(convo.id);
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            const nextId = deleteConversation(id);
            const updated = listConversations();
            if (updated.length === 0) {
                const fresh = createConversation();
                setConvos([fresh]);
                setActiveId(fresh.id);
            } else {
                setConvos(updated);
                if (id === activeId) setActiveId(nextId ?? updated[0].id);
            }
        },
        [activeId],
    );

    const grouped = groupConversations(convos);

    return (
        <div className="ow-chat-page-client">
            <SidebarProvider defaultOpen>
                <Sidebar collapsible="offcanvas">
                    <SidebarHeader className="border-b border-sidebar-border">
                        <div className="flex items-center justify-between gap-2 px-2 py-2">
                            <Link href="/" className="flex items-center gap-2 min-w-0">
                                <Image
                                    src="/icon.png"
                                    alt="OpenWallet"
                                    width={28}
                                    height={28}
                                    className="shrink-0 rounded-2xl"
                                />
                                <span className="truncate font-semibold text-sm">Owie</span>
                            </Link>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-7 shrink-0"
                                onClick={handleNew}
                                title="Cuộc trò chuyện mới"
                            >
                                <PlusIcon className="size-4" />
                            </Button>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        {mounted && convos.length === 0 && (
                            <p className="px-4 py-6 text-center text-muted-foreground text-xs">
                                Chưa có cuộc trò chuyện nào
                            </p>
                        )}
                        {grouped.today.length > 0 && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Hôm nay</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <ConvoList
                                        convos={grouped.today}
                                        activeId={activeId}
                                        onSelect={setActiveId}
                                        onDelete={handleDelete}
                                    />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                        {grouped.yesterday.length > 0 && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Hôm qua</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <ConvoList
                                        convos={grouped.yesterday}
                                        activeId={activeId}
                                        onSelect={setActiveId}
                                        onDelete={handleDelete}
                                    />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                        {grouped.earlier.length > 0 && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Trước đó</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <ConvoList
                                        convos={grouped.earlier}
                                        activeId={activeId}
                                        onSelect={setActiveId}
                                        onDelete={handleDelete}
                                    />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>

                    <SidebarFooter className="border-t border-sidebar-border p-3">
                        <p className="text-center text-muted-foreground text-xs">
                            Lịch sử lưu trên thiết bị của bạn
                        </p>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex h-svh flex-col overflow-hidden">
                    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
                        <SidebarTrigger />
                    </header>
                    <div className="min-h-0 flex-1 h-full">
                        {mounted && activeId && (
                            <ChatRuntime key={activeId} convoId={activeId} onSaved={refresh} />
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}

function ConvoList({
    convos,
    activeId,
    onSelect,
    onDelete,
}: {
    convos: Conversation[];
    activeId: string;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <SidebarMenu>
            {convos.map((c) => (
                <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton
                        isActive={c.id === activeId}
                        onClick={() => onSelect(c.id)}
                        className="pr-8"
                        title={c.title}
                    >
                        <span className="truncate">{c.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                        showOnHover
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                        }}
                        title="Xóa"
                    >
                        <Trash2Icon className="size-3.5" />
                    </SidebarMenuAction>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
