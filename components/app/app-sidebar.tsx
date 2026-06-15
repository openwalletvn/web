'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { HomeIcon, MailIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { UserMenu } from '@/components/auth/user-menu'
import { useChatSidebarStore } from '@/lib/stores/chat-sidebar-store'
import {
    createConversation,
    deleteConversation,
    listConversations,
} from '@/lib/chat/conversation-store'
import type { Conversation } from '@/lib/chat/conversation-store'
import { setLastActiveId } from '@/lib/chat/conversation-store'

function groupConversations(convos: Conversation[]) {
    const todayStart = new Date().setHours(0, 0, 0, 0)
    const yesterdayStart = todayStart - 86400000
    return {
        today: convos.filter((c) => c.updatedAt >= todayStart),
        yesterday: convos.filter((c) => c.updatedAt >= yesterdayStart && c.updatedAt < todayStart),
        earlier: convos.filter((c) => c.updatedAt < yesterdayStart),
    }
}

export function AppSidebar() {
    const router = useRouter()
    const { convos, activeId, setConvos, setActiveId } = useChatSidebarStore()

    const selectConvo = useCallback(
        (id: string) => {
            setActiveId(id)
            setLastActiveId(id)
            router.replace(`/chat?id=${id}`, { scroll: false })
        },
        [router, setActiveId],
    )

    const handleNew = useCallback(() => {
        const convo = createConversation()
        setConvos(listConversations())
        selectConvo(convo.id)
    }, [selectConvo, setConvos])

    const handleDelete = useCallback(
        (id: string) => {
            const nextId = deleteConversation(id)
            const updated = listConversations()
            if (updated.length === 0) {
                const fresh = createConversation()
                setConvos([fresh])
                selectConvo(fresh.id)
            } else {
                setConvos(updated)
                if (id === activeId) selectConvo(nextId ?? updated[0].id)
            }
        },
        [activeId, selectConvo, setConvos],
    )

    const grouped = groupConversations(convos)

    return (
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

                {convos.length > 0 && grouped.today.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Hôm nay</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.today} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
                {convos.length > 0 && grouped.yesterday.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Hôm qua</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.yesterday} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
                {convos.length > 0 && grouped.earlier.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Trước đó</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.earlier} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <UserMenu />
                <p className="text-center text-muted-foreground text-xs px-2 py-1">
                    Lịch sử lưu trên thiết bị của bạn
                </p>
            </SidebarFooter>
        </Sidebar>
    )
}

function ConvoList({
    convos,
    activeId,
    onSelect,
    onDelete,
}: {
    convos: Conversation[]
    activeId: string
    onSelect: (id: string) => void
    onDelete: (id: string) => void
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
                            e.stopPropagation()
                            onDelete(c.id)
                        }}
                        title="Xóa"
                    >
                        <Trash2Icon className="size-3.5" />
                    </SidebarMenuAction>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}
