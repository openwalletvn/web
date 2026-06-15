import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import { getUserFromDb, getTier } from '@/lib/neon-db'
import { AppShell } from '@/components/app/app-shell'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const { data: session } = await auth.getSession()
    if (!session) redirect('/auth/sign-in?next=/account')

    const dbUser = await getUserFromDb(session.user.id)
    const tier = dbUser ? await getTier(dbUser.tier) : null

    return (
        <AppShell headerLeft={<span className="text-sm font-medium">Tài khoản</span>}>
            <div className="p-6 max-w-lg mx-auto space-y-6">
                <section className="space-y-2 text-sm">
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Thông tin</h2>
                    <Row label="Email" value={session.user.email} />
                    <Row label="Tên" value={session.user.name ?? '—'} />
                    <Row label="Số thứ tự" value={dbUser ? `#${dbUser.signup_number}` : '—'} />
                    <Row label="Thành viên từ" value={dbUser ? new Date(dbUser.created_at).toLocaleDateString('vi-VN') : '—'} />
                </section>

                <section className="space-y-2 text-sm">
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Gói & Credits</h2>
                    <Row label="Gói" value={tier?.label ?? dbUser?.tier ?? '—'} />
                    <Row label="Credits" value={dbUser ? Number(dbUser.bonus_credits).toFixed(0) : '—'} />
                    <Row label="Access to paid models" value={tier ? (tier.can_use_paid_model ? 'Có' : 'Không') : '—'} />
                </section>
            </div>
        </AppShell>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    )
}
