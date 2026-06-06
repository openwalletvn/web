'use client';

import { useEffect } from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

export function OverlayScrollbarsBody() {
  const [initialize] = useOverlayScrollbars({ defer: true });

  useEffect(() => {
    initialize(document.body);
  }, [initialize]);

  return null;
}
