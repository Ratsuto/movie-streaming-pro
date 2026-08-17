import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signing and verification for the session cookie.
 *
 * Kept free of `next/headers` on purpose: `proxy.ts` reads the cookie off the
 * incoming request and must not pull render-time APIs into that module.
 */

export type SessionPayload = {
    userId: string;
    name: string;
    email: string;
    /**
     * The API's bearer token, kept here so rendering a page costs no round
     * trip to the backend. The cookie is signed rather than encrypted, so
     * treat this as readable by anyone holding the cookie — `httpOnly` keeps
     * it away from page scripts, which is what matters for XSS.
     */
    accessToken: string;
    refreshToken?: string;
    /** Unix milliseconds, when the API reports an account creation date. */
    createdAt?: number;
    /** Unix milliseconds. Checked on every verify, so an expired cookie that
        survives in the browser still fails closed. */
    expiresAt: number;
};

export const SESSION_COOKIE = 'session';

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const DEV_SECRET = 'movie-gather-insecure-development-secret';

function signingKey(): string {
    const secret = process.env.SESSION_SECRET;

    if (secret) {
        return secret;
    }

    // Falling back in production would let anyone who has read this file mint
    // their own sessions, so refuse to start instead of failing quietly.
    if (process.env.NODE_ENV === 'production') {
        throw new Error(
            'SESSION_SECRET is not set. Generate one with `openssl rand -base64 32`.'
        );
    }

    return DEV_SECRET;
}

function sign(body: string): string {
    return createHmac('sha256', signingKey()).update(body).digest('base64url');
}

export function createSessionToken(
    payload: Omit<SessionPayload, 'expiresAt'>
): {
    token: string;
    expiresAt: Date;
} {
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
    const body = Buffer.from(
        JSON.stringify({ ...payload, expiresAt: expiresAt.getTime() })
    ).toString('base64url');

    return { token: `${body}.${sign(body)}`, expiresAt };
}

export function verifySessionToken(
    token: string | undefined
): SessionPayload | null {
    if (!token) {
        return null;
    }

    const [body, signature] = token.split('.');

    if (!body || !signature) {
        return null;
    }

    const expected = Buffer.from(sign(body));
    const received = Buffer.from(signature);

    // `timingSafeEqual` throws on a length mismatch, so guard it first.
    if (
        received.length !== expected.length ||
        !timingSafeEqual(received, expected)
    ) {
        return null;
    }

    try {
        const payload: unknown = JSON.parse(
            Buffer.from(body, 'base64url').toString()
        );

        const session = payload as SessionPayload;

        // A cookie minted before the payload gained these fields fails here
        // and the visitor simply signs in again.
        if (
            typeof payload !== 'object' ||
            payload === null ||
            typeof session.userId !== 'string' ||
            typeof session.email !== 'string' ||
            typeof session.name !== 'string' ||
            typeof session.accessToken !== 'string' ||
            typeof session.expiresAt !== 'number'
        ) {
            return null;
        }

        if (session.expiresAt < Date.now()) {
            return null;
        }

        return session;
    } catch {
        return null;
    }
}
