import Image from 'next/image';
import type { ContactlessMethod } from '@/lib/api';
import { getWalletImageUrl } from '@/lib/api';

interface Props {
    method: ContactlessMethod;
    showName?: boolean;
}

export function ContactlessBadge({ method, showName = true }: Props) {
    return (
        <div className="ow-contactless-badge flex items-center gap-1.5 px-2.5 py-1.5 border border-dashed border-slate-200 rounded-sm">
            <div className="relative w-5 h-5">
                <Image src={getWalletImageUrl(method.logo_url)} alt="" fill className="object-contain" />
            </div>
            {showName && <span className="text-xs text-slate-600">{method.name}</span>}
        </div>
    );
}
