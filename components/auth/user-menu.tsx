'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { useUserStore } from '@/lib/stores/user-store'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

function getInitials(name?: string | null, email?: string | null) {
    if (name) return name.slice(0, 2).toUpperCase()
    if (email) return email.slice(0, 2).toUpperCase()
    return 'OW'
}

export function UserMenuSidebarFooter() {
    const router = useRouter()
    const user = useUserStore((s) => s.user)
    const bonusCredits = useUserStore((s) => s.bonusCredits)
    const isLoaded = useUserStore((s) => s.isLoaded)
    const { isMobile } = useSidebar()

    if (!isLoaded) return null

    if (!user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/auth/sign-in">
                            <UserIcon />
                            Đăng nhập
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push('/')
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="size-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">
                                    {getInitials(user.name, user.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name ?? user.email}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {bonusCredits.toFixed(0)} credits
                                </span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">
                                        {getInitials(user.name, user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name ?? user.email}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/account">
                                    <SettingsIcon />
                                    Tài khoản
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOutIcon />
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

/** @deprecated Use UserMenuSidebarFooter inside sidebar contexts */
export function UserMenu() {
    const router = useRouter()
    const user = useUserStore((s) => s.user)
    const bonusCredits = useUserStore((s) => s.bonusCredits)
    const isLoaded = useUserStore((s) => s.isLoaded)

    if (!isLoaded) return null

    if (!user) {
        return (
            <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/auth/sign-in">Đăng nhập</Link>
            </Button>
        )
    }

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push('/')
    }

    return (
        <div className="flex flex-col gap-2 px-2 py-1">
            <div className="flex items-center gap-2 min-w-0">
                <UserIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{user.name ?? user.email}</span>
            </div>
            <div className="text-xs text-muted-foreground">
                {bonusCredits.toFixed(0)} credits
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Link href="/account">
                    <SettingsIcon className="size-4" />
                    Tài khoản
                </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOutIcon className="size-4" />
                Đăng xuất
            </Button>
        </div>
    )
}
