import { notFound } from 'next/navigation'

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    notFound()
    return <>{children}</>
}
