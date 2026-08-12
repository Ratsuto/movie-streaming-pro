import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * The account store.
 *
 * Everything else in this app runs on the fixtures in `lib/media.ts`, so
 * accounts live in memory too — they reset when the server restarts. The
 * exported functions are the seam: swap their bodies for real queries and
 * nothing above this file has to change.
 */

const scryptAsync = promisify(scrypt) as (
    password: string,
    salt: string,
    keylen: number
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
};

/** What callers outside this module are allowed to see — never the hash. */
export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'createdAt'>;

declare global {
    var __movieGatherUsers: Map<string, User> | undefined;
    var __movieGatherSeed: Promise<void> | undefined;
}

// Hung off `globalThis` so the dev server's hot reload doesn't sign everyone
// out on every save.
const users = (globalThis.__movieGatherUsers ??= new Map<string, User>());

/** Emails are the login handle, so match them case-insensitively. */
function key(email: string): string {
    return email.trim().toLowerCase();
}

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = await scryptAsync(password, salt, KEY_LENGTH);

    return `${salt}:${derived.toString('hex')}`;
}

async function matchesPassword(
    password: string,
    stored: string
): Promise<boolean> {
    const [salt, hash] = stored.split(':');

    if (!salt || !hash) {
        return false;
    }

    const derived = await scryptAsync(password, salt, KEY_LENGTH);
    const expected = Buffer.from(hash, 'hex');

    return (
        expected.length === derived.length && timingSafeEqual(expected, derived)
    );
}

// One account so the login page is usable on a fresh checkout. Its id is fixed
// rather than random so a session minted before a restart still resolves.
const seed = (globalThis.__movieGatherSeed ??= (async () => {
    const email = 'demo@moviegather.app';

    if (users.has(email)) {
        return;
    }

    users.set(email, {
        id: '00000000-0000-4000-8000-000000000001',
        name: 'Lee Phang',
        email,
        passwordHash: await hashPassword('demo1234'),
        createdAt: new Date(),
    });
})());

export function toPublicUser(user: User): PublicUser {
    const { id, name, email, createdAt } = user;

    return { id, name, email, createdAt };
}

export async function findUserByEmail(email: string): Promise<User | null> {
    await seed;

    return users.get(key(email)) ?? null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
    await seed;

    for (const user of users.values()) {
        if (user.id === id) {
            return toPublicUser(user);
        }
    }

    return null;
}

export async function createUser(input: {
    name: string;
    email: string;
    password: string;
}): Promise<PublicUser> {
    await seed;

    const user: User = {
        id: randomUUID(),
        name: input.name.trim(),
        email: key(input.email),
        passwordHash: await hashPassword(input.password),
        createdAt: new Date(),
    };

    users.set(user.email, user);

    return toPublicUser(user);
}

/**
 * Returns the user when the password matches, `null` otherwise. Deliberately
 * gives no hint about which half was wrong — see the caller's error copy.
 */
export async function verifyCredentials(
    email: string,
    password: string
): Promise<PublicUser | null> {
    const user = await findUserByEmail(email);

    if (!user) {
        // Hash anyway so a missing account doesn't answer measurably faster
        // than a wrong password, which would let someone enumerate emails.
        await hashPassword(password);
        return null;
    }

    return (await matchesPassword(password, user.passwordHash))
        ? toPublicUser(user)
        : null;
}
