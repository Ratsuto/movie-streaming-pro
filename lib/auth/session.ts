import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { findUserById, type PublicUser } from '@/lib/auth/users';
import {
    createSessionToken,
    SESSION_COOKIE,
    verifySessionToken,
    type SessionPayload,
} from '@/lib/auth/token';

/**
 * Reading and writing the signed session cookie, plus the small data access
 * layer every server component and action should go through.
 */

export async function createSession(userId: string): Promise<void> {
    const { token, expiresAt } = createSessionToken(userId);
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

export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
    const session = await getSession();

    return session ? findUserById(session.userId) : null;
});

/**
 * For pages and actions that have no meaning signed out. The `proxy.ts` check
 * is only an optimistic first pass — this is the one that actually guards the
 * data, so call it rather than trusting the redirect upstream.
 */
export async function requireUser(returnTo?: string): Promise<PublicUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect(
            returnTo ? `/login?from=${encodeURIComponent(returnTo)}` : '/login'
        );
    }

    return user;
}
