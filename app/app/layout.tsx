import { notFound } from 'next/navigation';
import { AppShell } from './app-shell';

// Wallet app is frozen. Re-enable by setting WALLET_ENABLED=true in environment.
export default function AppLayout({ children }: { children: React.ReactNode }) {
    if (process.env.WALLET_ENABLED !== 'true') {
        notFound();
    }

    return <AppShell>{children}</AppShell>;
}
