import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/lib/utils';

type OwLogoProps = {
    variant?: 'icon' | 'full';
    color?: 'black' | 'white' | 'red';
    className?: string;
    href?: string | null;
    width?: number;
};

function getSrc(variant: 'icon' | 'full', color: 'black' | 'white' | 'red') {
    if (variant === 'full') {
        if (color === 'red') return '/logo-red.svg';
        if (color === 'white') return '/logo-white.svg';
    }
    return '/icon.svg';
}

export function OwLogo({variant = 'icon', color = 'black', className = '', href = '/', width = 70}: OwLogoProps) {
    const src = getSrc(variant, color);
    // intrinsic dims: full uses 72/58 aspect ratio, icon is square
    const intrinsic = variant === 'full' ? {width: 72, height: 58} : {width: 80, height: 80};
    const img = (
        <Image
            src={src}
            alt="OpenWallet"
            {...intrinsic}
            style={{width, height: 'auto'}}
            className="block"
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
