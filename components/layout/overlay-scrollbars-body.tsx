'use client';

import { useEffect } from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

export function OverlayScrollbarsBody() {
  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: { scrollbars: { autoHide: 'scroll', autoHideSuspend: true } },
  });

  useEffect(() => {
    initialize(document.body);
  }, [initialize]);

  return (
    <style>{`.os-theme-dark,.os-theme-light{--os-size:6px;--os-padding-perpendicular:1px}`}</style>
  );
}
