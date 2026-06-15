import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app/app-sidebar'
import { UserStoreProvider } from '@/components/auth/user-store-provider'
import { auth } from '@/lib/auth/server'
import { getUserFromDb, getTier, insertUserRow } from '@/lib/neon-db'
import type { AuthUser } from '@/lib/stores/user-store'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await auth.getSession()
    let dbUser = session ? await getUserFromDb(session.user.id) : null
    if (session && !dbUser) {
        await insertUserRow(session.user.id, session.user.email, session.user.name ?? null)
        dbUser = await getUserFromDb(session.user.id)
    }
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
