import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  try {
    const response = await fetch(`${apiUrl}/api/v1/openapi.json`);
    const data = await response.json();

    // Update server URLs in the OpenAPI spec to match the environment
    if (data.servers && Array.isArray(data.servers)) {
      data.servers = [
        {
          url: `${apiUrl}/api/v1`,
          description: apiUrl.includes('localhost')
            ? 'Local Development Server'
            : 'Production Server'
        }
      ];
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch OpenAPI spec' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
