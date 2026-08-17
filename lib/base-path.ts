/**
 * Where the backend API lives.
 *
 * `API_URL` is preferred over `NEXT_PUBLIC_API_URL`: every call to it is made
 * from the server (Server Actions), so the address does not need to ship in
 * the browser bundle. The public name is still read as a fallback because
 * that is what `.env` currently sets.
 */
const RAW_API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

/**
 * `.env` holds a bare `host:port`. `fetch` cannot use that — a URL with no
 * scheme parses as a relative path — so the scheme is filled in here rather
 * than relying on everyone remembering to type it.
 */
export function apiBaseUrl(): string {
    const raw = RAW_API_URL?.trim();

    if (!raw) {
        throw new Error(
            'API_URL is not set. Add it to .env, e.g. API_URL=http://3.107.247.137:8081'
        );
    }

    const withoutTrailingSlash = raw.replace(/\/+$/, '');

    return /^https?:\/\//i.test(withoutTrailingSlash)
        ? withoutTrailingSlash
        : `http://${withoutTrailingSlash}`;
}

export function apiUrl(path: string): string {
    return `${apiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
