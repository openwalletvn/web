'use client';

import dynamic from 'next/dynamic';
import '@scalar/api-reference-react/style.css';

const ApiReferenceReact = dynamic(
  () => import('@scalar/api-reference-react').then((m) => m.ApiReferenceReact),
  { ssr: false },
);

export function ScalarRef() {
  return (
    <ApiReferenceReact
      configuration={{
        // url: `${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.openwallet.vn'}/api/v1/openapi.json`,
        url: `http://localhost:3002/api/v1/openapi.json`,
        theme: 'bluePlanet',
        layout: 'modern',
        darkMode: false,
        showSidebar: true,
        hideDownloadButton: false,
        searchHotKey: 'k',
        metaData: {
          title: 'OpenWallet API',
          description: 'Vietnamese bank card data API',
        },
      }}
    />
  );
}
