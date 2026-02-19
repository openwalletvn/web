import Link from 'next/link';
import {IconCards} from '@tabler/icons-react';

export function WalletNavButton() {
  return (
    <Link
      href="/app"
      className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-brand-blue text-brand-blue rounded-sm text-sm font-medium hover:bg-blue-50/60 transition-colors"
    >
        <IconCards size={15}/>
        <span>Ví thẻ</span>
    </Link>
  );
}
