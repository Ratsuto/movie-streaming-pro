import { apiUrl } from '@/lib/base-path';

/**
 * Client for the backend's auth endpoints.
 *
 * Every call here runs on the server: the browser never sees the API address
 * or the access token, and CORS never enters into it.
 *
 * Observed contract (probed against the running service):
 *   POST /api/auth/login     { email, password }
 *   POST /api/auth/register  { fullName, email, password }   password >= 8
 *   Failures: { timestamp, status, error, message } where `message` is either
 *   a sentence ("Invalid email or password") or "field: problem".
 */

export type SessionUser = {
    id: string;
    name: string;
    email: string;
    /** Only set when the API reports it. */
    createdAt?: Date;
};

export type ApiSession = {
    user: SessionUser;
    accessToken: string;
    refreshToken?: string;
};

export type ApiAuthResult =
    | { ok: true; session: ApiSession }
    | {
          ok: false;
          /** Whole-form failure, shown above the fields. */
          message?: string;
          /** Keyed by the form input's `name`. */
          fieldErrors?: Record<string, string[]>;
      };

const FORM_FIELDS = new Set(['email', 'password', 'name', 'fullName']);

type Json = Record<string, unknown>;

function asRecord(value: unknown): Json | undefined {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Json)
        : undefined;
}

function asString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * The API reports validation failures as `"fullName: must not be blank"`.
 * Splitting that back out lets the message sit under the offending input
 * instead of floating above the whole form.
 */
function toFieldError(message: string): Record<string, string[]> | undefined {
    const match = /^([A-Za-z]+):\s*(.+)$/.exec(message);

    if (!match) return undefined;

    const [, field, problem] = match;

    if (!FORM_FIELDS.has(field)) return undefined;

    // `fullName` is what the API calls it; the register form input is `name`.
    const formField = field === 'fullName' ? 'name' : field;

    return { [formField]: [problem] };
}

/** Reads the claims out of a JWT without verifying it — the API already did. */
function jwtClaims(token: string): Json | undefined {
    const body = token.split('.')[1];

    if (!body) return undefined;

    try {
        return asRecord(JSON.parse(Buffer.from(body, 'base64url').toString()));
    } catch {
        return undefined;
    }
}

/**
 * Pulls a session out of whatever the login response looks like.
 *
 * The success shape has not been observed — that would have meant creating an
 * account on the live service — so this accepts the shapes Spring Boot JWT
 * setups commonly return, and falls back to the token's own claims for the
 * user's details. If the API returns something else, this function is the
 * only place that needs changing.
 */
function toSession(
    body: unknown,
    fallbackEmail: string
): ApiSession | undefined {
    const root = asRecord(body);

    if (!root) return undefined;

    const data = asRecord(root.data) ?? root;

    const accessToken =
        asString(data.accessToken) ??
        asString(data.access_token) ??
        asString(data.token) ??
        asString(data.jwt) ??
        asString(root.accessToken) ??
        asString(root.token);

    if (!accessToken) return undefined;

    const refreshToken =
        asString(data.refreshToken) ??
        asString(data.refresh_token) ??
        asString(root.refreshToken);

    const userRecord = asRecord(data.user) ?? asRecord(root.user) ?? data;
    const claims = jwtClaims(accessToken) ?? {};

    const email =
        asString(userRecord.email) ?? asString(claims.email) ?? fallbackEmail;

    const name =
        asString(userRecord.fullName) ??
        asString(userRecord.name) ??
        asString(claims.fullName) ??
        asString(claims.name) ??
        // Better than an empty header: the local part of their address.
        email.split('@')[0];

    const id =
        asString(userRecord.id) ??
        asString(userRecord.userId) ??
        asString(claims.sub) ??
        email;

    const createdRaw =
        asString(userRecord.createdAt) ?? asString(userRecord.created_at);
    const createdAt = createdRaw ? new Date(createdRaw) : undefined;

    return {
        accessToken,
        refreshToken,
        user: {
            id,
            name,
            email,
            createdAt:
                createdAt && !Number.isNaN(createdAt.getTime())
                    ? createdAt
                    : undefined,
        },
    };
}

async function post(
    path: string,
    payload: Json,
    fallbackEmail: string
): Promise<ApiAuthResult> {
    let response: Response;

    try {
        response = await fetch(apiUrl(path), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
            // Credentials must never be answered from a cache.
            cache: 'no-store',
        });
    } catch {
        // A DNS failure, a refused connection, or the service being down. Not
        // the person's fault, so don't phrase it as a rejected sign-in.
        return {
            ok: false,
            message:
                'Could not reach the sign-in service. Check your connection and try again.',
        };
    }

    const body: unknown = await response.json().catch(() => undefined);

    if (!response.ok) {
        const message = asString(asRecord(body)?.message);

        if (response.status === 401 || response.status === 403) {
            return {
                ok: false,
                // One message whichever half was wrong, so the form can't be
                // used to find out which emails are registered.
                message: 'That email and password combination is incorrect.',
            };
        }

        if (message) {
            const fieldErrors = toFieldError(message);

            return fieldErrors
                ? { ok: false, fieldErrors }
                : { ok: false, message };
        }

        return {
            ok: false,
            message: `Sign-in failed (${response.status}). Please try again.`,
        };
    }

    const session = toSession(body, fallbackEmail);

    if (!session) {
        // A 2xx with nothing usable in it. Say so plainly rather than letting
        // the person land in a half-signed-in state.
        return {
            ok: false,
            message:
                'The sign-in service returned an unexpected response. Please try again.',
        };
    }

    return { ok: true, session };
}

export function apiLogin(
    email: string,
    password: string
): Promise<ApiAuthResult> {
    return post('/api/auth/login', { email, password }, email);
}

export function apiRegister(
    fullName: string,
    email: string,
    password: string
): Promise<ApiAuthResult> {
    return post('/api/auth/register', { fullName, email, password }, email);
}
