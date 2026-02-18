import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect _rsc requests that lack the RSC header (bots/audit tools).
  // Real browser RSC navigation always includes the "RSC: 1" header.
  if (request.nextUrl.searchParams.has('_rsc') && !request.headers.get('RSC')) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete('_rsc');
    return NextResponse.redirect(clean, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.jpg|logo.png).*)'],
};
