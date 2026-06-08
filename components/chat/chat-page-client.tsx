'use client';

import {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ChatRuntime} from '@/components/chat/chat-runtime';
import {SearchDialog} from '@/components/search/search-dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {HomeIcon, MailIcon, PlusIcon, Trash2Icon} from 'lucide-react';
import {
    type Conversation,
    createConversation,
    deleteConversation,
    getLastActiveId,
    listConversations,
    setLastActiveId,
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

export function ChatPageClient({ initialId }: { initialId?: string } = {}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const list = listConversations();
        let resolvedId: string;
        if (list.length > 0) {
            setConvos(list);
            const lastId = initialId ?? getLastActiveId();
            resolvedId = (lastId && list.find((c) => c.id === lastId)) ? lastId : list[0].id;
        } else {
            const fresh = createConversation();
            setConvos([fresh]);
            resolvedId = fresh.id;
        }
        setActiveId(resolvedId);
        setLastActiveId(resolvedId);
        router.replace(`/chat?id=${resolvedId}`, { scroll: false });
        setMounted(true);
    }, [initialId]); // eslint-disable-line react-hooks/exhaustive-deps

    const refresh = useCallback(() => setConvos(listConversations()), []);

    const selectConvo = useCallback((id: string) => {
        setActiveId(id);
        setLastActiveId(id);
        router.replace(`/chat?id=${id}`, { scroll: false });
    }, [router]);

    const handleNew = useCallback(() => {
        const convo = createConversation();
        setConvos(listConversations());
        selectConvo(convo.id);
    }, [selectConvo]);

    const handleDelete = useCallback(
        (id: string) => {
            const nextId = deleteConversation(id);
            const updated = listConversations();
            if (updated.length === 0) {
                const fresh = createConversation();
                setConvos([fresh]);
                selectConvo(fresh.id);
            } else {
                setConvos(updated);
                if (id === activeId) selectConvo(nextId ?? updated[0].id);
            }
        },
        [activeId, selectConvo],
    );

    const grouped = groupConversations(convos);

    return (
        <div className="ow-chat-page-client">
            <SidebarProvider defaultOpen>
                <Sidebar collapsible="offcanvas">
                    <SidebarHeader className="ow-chat-page-sidebar-header border-b border-sidebar-border min-h-12.5 flex items-center justify-center">
                        <div className="w-full flex items-center justify-between gap-2 px-2">
                            <Link href="/" className="flex items-center gap-2 min-w-0">
                                <Image
                                    src="/icon.png"
                                    alt="OpenWallet"
                                    width={28}
                                    height={28}
                                    className="shrink-0 rounded-md"
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
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/"><HomeIcon />Trang chủ</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/lien-he"><MailIcon />Liên hệ</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
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
                                        onSelect={selectConvo}
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
                                        onSelect={selectConvo}
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
                                        onSelect={selectConvo}
                                        onDelete={handleDelete}
                                    />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>

                    <SidebarFooter className="border-t border-sidebar-border">
                        <p className="text-center text-muted-foreground text-xs px-2 py-1">
                            Lịch sử lưu trên thiết bị của bạn
                        </p>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="ow-chat-sidebar-inset flex h-svh flex-col overflow-hidden">
                    <header className="ow-chat-sidebar-header min-h-12.5 flex justify-between shrink-0 items-center gap-2 border-b px-3 py-1">
                        <div>
                            <SidebarTrigger/>
                        </div>
                        <div>
                            <div className="hidden sm:flex"><SearchDialog/></div>
                            <div className="flex sm:hidden"><SearchDialog mobileOnly/></div>
                        </div>
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
