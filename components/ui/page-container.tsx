import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const maxWidthClasses = {
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
} as const;

export function PageContainer({
  children,
  maxWidth = '6xl',
  className,
}: {
  children: ReactNode;
  maxWidth?: keyof typeof maxWidthClasses;
  className?: string;
}) {
  return (
    <div className={cn('ow-page-container px-4 py-8 mx-auto', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
