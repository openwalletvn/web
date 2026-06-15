'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
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
    SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { HomeIcon, MailIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { UserMenuSidebarFooter } from '@/components/auth/user-menu'
import { useChatSidebarStore } from '@/lib/stores/chat-sidebar-store'
import {
    createConversation,
    deleteConversation,
    listConversations,
    setLastActiveId,
} from '@/lib/chat/conversation-store'
import type { Conversation } from '@/lib/chat/conversation-store'

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
            router.push(`/chat?id=${id}`)
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

    useEffect(() => {
        if (convos.length === 0) setConvos(listConversations())
    }, [])

    const grouped = groupConversations(convos)

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <Image
                                    src="/icon.png"
                                    alt="OpenWallet"
                                    width={28}
                                    height={28}
                                    className="rounded-md"
                                />
                                <span className="font-semibold">Owie</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuAction onClick={handleNew} title="Cuộc trò chuyện mới">
                            <PlusIcon />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                </SidebarMenu>
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

                {grouped.today.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Hôm nay</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.today} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
                {grouped.yesterday.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Hôm qua</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.yesterday} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
                {grouped.earlier.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Trước đó</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <ConvoList convos={grouped.earlier} activeId={activeId} onSelect={selectConvo} onDelete={handleDelete} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <UserMenuSidebarFooter />
            </SidebarFooter>
            <SidebarRail />
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
