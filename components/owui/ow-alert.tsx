import * as React from 'react';
import {cn} from '@/lib/utils';
import {IconAlertCircle, IconAlertTriangle, IconInfoCircle, IconPackages} from '@tabler/icons-react';

export type OwAlertVariant = 'error' | 'warning' | 'info' | 'package';

const VARIANT_CLS: Record<OwAlertVariant, string> = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    package: 'bg-amber-50 border-amber-200 text-amber-800',
};

const ICON_CLS: Record<OwAlertVariant, string> = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    package: 'text-amber-600',
};

function DefaultIcon({variant}: { variant: OwAlertVariant }) {
    const cls = cn('w-4 h-4 shrink-0', ICON_CLS[variant]);
    if (variant === 'error') return <IconAlertCircle className={cls}/>;
    if (variant === 'warning') return <IconAlertTriangle className={cls}/>;
    if (variant === 'package') return <IconPackages className={cls}/>;
    return <IconInfoCircle className={cls}/>;
}

export type OwAlertProps = {
    variant?: OwAlertVariant;
    icon?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
};

export function OwAlert({variant = 'info', icon, className, children}: OwAlertProps) {
    return (
        <div className={cn(
            'ow-alert flex items-start gap-2 px-3 py-2.5 border rounded text-sm',
            VARIANT_CLS[variant],
            className,
        )}>
            <span className="mt-0.5 shrink-0">
                {icon ?? <DefaultIcon variant={variant}/>}
            </span>
            <span>{children}</span>
        </div>
    );
}
