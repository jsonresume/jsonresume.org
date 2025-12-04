import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isReservedUsername } from './lib/reservedRoutes';

/**
 * Middleware to prevent reserved routes from being accessed as username pages
 * Handles Issue #43 - username collision with system routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.') || // Static files (favicon.ico, etc.)
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Extract potential username from path (first segment after /)
  const segments = pathname.split('/').filter(Boolean);
  const potentialUsername = segments[0];

  // Check if first segment is a reserved route
  if (potentialUsername && isReservedUsername(potentialUsername)) {
    // Let Next.js handle the actual route (it exists as a real page)
    return NextResponse.next();
  }

  // If it looks like a username route but is reserved, show error
  // This catches cases where the route doesn't exist yet but is reserved
  if (
    potentialUsername &&
    isReservedUsername(potentialUsername) &&
    segments.length > 1
  ) {
    // Redirect to error page with message
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('code', 'reserved_username');
    errorUrl.searchParams.set('username', potentialUsername);
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
