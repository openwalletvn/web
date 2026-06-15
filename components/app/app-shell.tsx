import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import type { ReactNode } from 'react'

interface AppShellProps {
    headerLeft?: ReactNode
    headerRight?: ReactNode
    children: ReactNode
    className?: string
}

export function AppShell({ headerLeft, headerRight, children, className }: AppShellProps) {
    return (
        <SidebarInset className={`flex h-svh flex-col overflow-hidden ${className ?? ''}`}>
            <header className="min-h-12.5 flex justify-between shrink-0 items-center gap-2 border-b px-3 py-1">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    {headerLeft}
                </div>
                <div className="flex items-center gap-2">
                    {headerRight}
                </div>
            </header>
            <div className="min-h-0 flex-1 h-full overflow-y-auto">
                {children}
            </div>
        </SidebarInset>
    )
}
