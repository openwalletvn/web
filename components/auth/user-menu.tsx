'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { useUserStore } from '@/lib/stores/user-store'
import { Button } from '@/components/ui/button'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

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
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOutIcon className="size-4" />
                Đăng xuất
            </Button>
        </div>
    )
}
