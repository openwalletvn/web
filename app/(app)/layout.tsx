import { headers } from 'next/headers'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app/app-sidebar'
import { UserStoreProvider } from '@/components/auth/user-store-provider'
import { auth } from '@/lib/auth/server'
import { getUserFromDb, getTier } from '@/lib/neon-db'
import type { AuthUser } from '@/lib/stores/user-store'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })
    const dbUser = session ? await getUserFromDb(session.user.id) : null
    const tierData = dbUser ? await getTier(dbUser.tier) : null

    const authUser: AuthUser | null = session
        ? { id: session.user.id, email: session.user.email, name: session.user.name }
        : null

    return (
        <UserStoreProvider initialUser={authUser} initialDbUser={dbUser} initialTier={tierData}>
            <SidebarProvider defaultOpen>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </UserStoreProvider>
    )
}
