import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
    variant?: 'icon' | 'full';
    color?: 'black' | 'white' | 'red';
    className?: string;
};

function getSrc(variant: 'icon' | 'full', color: 'black' | 'white' | 'red') {
    if (variant === 'full') {
        if (color === 'red') {
            return '/logo-red.svg';
        }
        return color === 'white' ? '/logo-white.svg' : '/logo.png';
    }
    return '/icon.svg';
}

export function Logo({ variant = 'icon', color = 'black', className = '' }: LogoProps) {
    const src = getSrc(variant, color);
    const dims = variant === 'full' ? { width: 232, height: 186 } : { width: 80, height: 80 };

    return (
        <Link href="/" className={`ow-logo flex items-center shrink-0 ${className}`}>
            <Image src={src} alt="OpenWallet" {...dims} className="h-auto w-full" />
        </Link>
    );
}
