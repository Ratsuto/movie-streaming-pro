/**
 * Movie Gather service worker.
 *
 * Bump VERSION whenever this file changes — the old caches are dropped on
 * activate, so a new version never serves stale assets.
 */
const VERSION = 'v1';
const SHELL_CACHE = `mg-shell-${VERSION}`;
const RUNTIME_CACHE = `mg-runtime-${VERSION}`;
const OFFLINE_URL = '/offline';

const SHELL_ASSETS = [
    OFFLINE_URL,
    '/home',
    '/new',
    '/movies',
    '/series',
    '/manifest.webmanifest',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(SHELL_CACHE);
            // Settled, not all: one unreachable URL must not fail the install.
            await Promise.allSettled(
                SHELL_ASSETS.map((url) => cache.add(new Request(url)))
            );
            await self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter(
                        (key) =>
                            key.startsWith('mg-') &&
                            key !== SHELL_CACHE &&
                            key !== RUNTIME_CACHE
                    )
                    .map((key) => caches.delete(key))
            );
            await self.clients.claim();
        })()
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/** Content-hashed build output: safe to serve from cache forever. */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
    }
    return response;
}

/** Pages: fresh when online, cached copy when not, offline page as the floor. */
async function navigationHandler(request) {
    try {
        const response = await fetch(request);
        // Navigation requests carry redirect: 'manual', so `/` -> `/home` comes
        // back as an opaqueredirect with status 0. Returning it lets the
        // browser follow the redirect; caching it would throw, which is why
        // this is guarded on `ok` rather than cached unconditionally.
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached =
            (await caches.match(request, { ignoreSearch: true })) ??
            (await caches.match(OFFLINE_URL));
        return cached ?? Response.error();
    }
}

/**
 * Everything else — including React Server Component payloads. Falls back only
 * to a cached copy of the *same* URL, never to an HTML document, which would
 * corrupt an RSC navigation.
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached ?? Response.error();
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(navigationHandler(request));
        return;
    }

    event.respondWith(networkFirst(request));
});
