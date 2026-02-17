import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const html = `<!doctype html>
<html>
  <head>
    <title>OpenWallet API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/openapi"
      data-configuration='{
        "theme": "bluePlanet",
        "layout": "modern",
        "showSidebar": true,
        "hideModels": false,
        "hideDownloadButton": false,
        "darkMode": false,
        "searchHotKey": "k",
        "metaData": {
          "title": "OpenWallet API",
          "description": "Vietnamese bank card data API"
        }
      }'></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
