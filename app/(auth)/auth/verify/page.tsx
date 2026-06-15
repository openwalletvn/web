import Link from 'next/link'
import { MailIcon } from 'lucide-react'

export default function VerifyPage() {
    return (
        <div className="w-full max-w-sm text-center space-y-4">
            <div className="flex justify-center">
                <MailIcon className="size-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Kiểm tra email của bạn</h1>
            <p className="text-sm text-muted-foreground">
                Chúng tôi đã gửi link đăng nhập đến email của bạn. Link có hiệu lực trong 15 phút.
            </p>
            <p className="text-xs text-muted-foreground">
                <Link href="/auth/sign-in" className="underline underline-offset-4">Gửi lại</Link>
                {' '}hoặc{' '}
                <Link href="/" className="underline underline-offset-4">Về trang chủ</Link>
            </p>
        </div>
    )
}
