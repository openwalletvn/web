'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle('is-home', pathname === '/');
  }, [pathname]);

  return null;
}
