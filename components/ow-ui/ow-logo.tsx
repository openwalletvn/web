import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/lib/utils';

type OwLogoProps = {
    variant?: 'icon' | 'full';
    color?: 'black' | 'white' | 'red';
    className?: string;
    href?: string | null;
};

function getSrc(variant: 'icon' | 'full', color: 'black' | 'white' | 'red') {
    if (variant === 'full') {
        if (color === 'red') return '/logo-red.svg';
        if (color === 'white') return '/logo-white.svg';
    }
    return '/icon.svg';
}

export function OwLogo({variant = 'icon', color = 'black', className = '', href = '/'}: OwLogoProps) {
    const src = getSrc(variant, color);
    const intrinsic = variant === 'full' ? {width: 72, height: 58} : {width: 80, height: 80};
    const img = (
        <Image
            src={src}
            alt="OpenWallet"
            {...intrinsic}
            className="block w-[80px] h-auto"
        />
    );

    if (href === null) {
        return <span className={cn('ow-logo flex items-center shrink-0', className)}>{img}</span>;
    }

    return (
        <Link href={href} className={cn('ow-logo flex items-center shrink-0', className)}>
            {img}
        </Link>
    );
}
