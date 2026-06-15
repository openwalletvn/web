'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'

type Step = 'email' | 'otp'

export default function SignInPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
            if (error) throw new Error(error.message)
            setStep('otp')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const { error } = await authClient.signIn.emailOtp({ email, otp })
            if (error) throw new Error(error.message)
            router.push('/chat')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Mã không đúng. Vui lòng thử lại.')
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
                    {step === 'email'
                        ? 'Nhập email để nhận mã đăng nhập'
                        : `Nhập mã 6 chữ số đã gửi đến ${email}`}
                </p>
            </div>

            {step === 'email' ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
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
                        {loading ? 'Đang gửi...' : 'Gửi mã đăng nhập'}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={loading}
                        autoFocus
                        className="text-center text-2xl tracking-widest"
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                        {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                    </Button>
                    <button
                        type="button"
                        className="w-full text-sm text-muted-foreground underline underline-offset-4"
                        onClick={() => { setStep('email'); setOtp(''); setError(null) }}
                    >
                        Đổi email hoặc gửi lại
                    </button>
                </form>
            )}
        </div>
    )
}
