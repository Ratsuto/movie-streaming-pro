import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { ApiSession, SessionUser } from '@/lib/auth/api';
import {
    createSessionToken,
    SESSION_COOKIE,
    verifySessionToken,
    type SessionPayload,
} from '@/lib/auth/token';

/**
 * Reading and writing the signed session cookie, plus the small data access
 * layer every server component and action should go through.
 *
 * The cookie carries everything a page needs about the visitor, so rendering
 * never has to call the API again just to put a name in the header.
 */

export type { SessionUser };

export async function createSession(session: ApiSession): Promise<void> {
    const { token, expiresAt } = createSessionToken({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        createdAt: session.user.createdAt?.getTime(),
    });
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        // Plain http on localhost would drop a `Secure` cookie outright.
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);
}

/** Cached per render pass so a page and its children share one cookie read. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
    const cookieStore = await cookies();

    return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
});

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
    const session = await getSession();

    if (!session) {
        return null;
    }

    return {
        id: session.userId,
        name: session.name,
        email: session.email,
        createdAt:
            session.createdAt === undefined
                ? undefined
                : new Date(session.createdAt),
    };
});

/**
 * The API bearer token for the signed-in visitor, for calls made on their
 * behalf. Server-side only — never hand this to a client component.
 */
export async function getAccessToken(): Promise<string | null> {
    return (await getSession())?.accessToken ?? null;
}

/**
 * For pages and actions that have no meaning signed out. The `proxy.ts` check
 * is only an optimistic first pass — this is the one that actually guards the
 * data, so call it rather than trusting the redirect upstream.
 */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect(
            returnTo ? `/login?from=${encodeURIComponent(returnTo)}` : '/login'
        );
    }

    return user;
}
