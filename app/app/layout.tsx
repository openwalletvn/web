import type {Metadata} from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from './app-shell';

export const metadata: Metadata = {
    robots: {index: false, follow: false},
};

// Wallet app is frozen. Re-enable by setting WALLET_ENABLED=true in environment.
export default function AppLayout({ children }: { children: React.ReactNode }) {
    if (process.env.WALLET_ENABLED !== 'true') {
        notFound();
    }

    return <AppShell>{children}</AppShell>;
}
