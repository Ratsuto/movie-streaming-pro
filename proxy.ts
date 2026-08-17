import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/token';
import { safeRedirectPath } from '@/lib/auth/validation';

/**
 * Optimistic auth routing. This only reads the signed cookie — no account
 * lookup — because Proxy runs on every request including prefetches.
 *
 * It is not a security boundary. `requireUser()` in lib/auth/session.ts is the
 * check that actually protects data, and every Server Action verifies the
 * session itself; a Proxy matcher change must never be able to open a hole.
 */

const protectedRoutes = ['/profile'];

const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = verifySessionToken(
        request.cookies.get(SESSION_COOKIE)?.value
    );

    if (!session && protectedRoutes.some((route) => pathname === route)) {
        const url = new URL('/login', request.nextUrl);
        // Send them back where they were headed once they're signed in.
        url.searchParams.set('from', pathname);

        return NextResponse.redirect(url);
    }

    if (session && authRoutes.includes(pathname)) {
        // Honour `?from=` here too, or signing in from a guarded page would
        // dump them on the board instead of where they were going.
        const destination = safeRedirectPath(
            request.nextUrl.searchParams.get('from'),
            '/home'
        );

        return NextResponse.redirect(new URL(destination, request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip static assets, image optimisation and media; everything else is
        // cheap enough since this only verifies an HMAC. `Video` is listed
        // because playback issues a request per range seek, none of which
        // should pay for it.
        '/((?!api|_next/static|_next/image|favicon.ico|icons|Video|sw.js|manifest.webmanifest).*)',
    ],
};
