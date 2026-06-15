import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import { getUserFromDb } from '@/lib/neon-db'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const { data: session } = await auth.getSession()
    if (!session) redirect('/auth/sign-in?next=/account')

    const dbUser = await getUserFromDb(session.user.id)

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-xl font-semibold mb-4">Tài khoản</h1>
            <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {session.user.email}</p>
                <p><span className="text-muted-foreground">Tên:</span> {session.user.name ?? '—'}</p>
                <p><span className="text-muted-foreground">Tier:</span> {dbUser?.tier ?? '—'}</p>
                <p><span className="text-muted-foreground">Credits:</span> {dbUser ? Number(dbUser.bonus_credits).toFixed(0) : '—'}</p>
            </div>
        </div>
    )
}
