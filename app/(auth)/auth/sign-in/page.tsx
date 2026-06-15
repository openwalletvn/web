'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await authClient.signIn.magicLink({
                email,
                callbackURL: '/chat',
            })
            router.push('/auth/verify')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm space-y-6">
            <div className="flex flex-col items-center gap-2">
                <Link href="/">
                    <Image src="/icon.png" alt="OpenWallet" width={40} height={40} className="rounded-xl" />
                </Link>
                <h1 className="text-xl font-semibold">Đăng nhập</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Nhập email để nhận link đăng nhập
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading || !email}>
                    {loading ? 'Đang gửi...' : 'Gửi link đăng nhập'}
                </Button>
            </form>
        </div>
    )
}
