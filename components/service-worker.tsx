'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker that makes the site installable and lets it
 * open offline.
 *
 * Registration is production-only: a caching worker in front of the dev server
 * serves stale bundles and fights hot reload. In development it instead tears
 * down any worker left behind by a production build on the same origin, so
 * `localhost:3000` doesn't keep answering from a stale cache.
 */
export function ServiceWorker() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        if (process.env.NODE_ENV !== 'production') {
            void navigator.serviceWorker
                .getRegistrations()
                .then((registrations) =>
                    Promise.all(
                        registrations.map((registration) =>
                            registration.unregister()
                        )
                    )
                )
                .catch(() => {});
            return;
        }

        const register = () => {
            void navigator.serviceWorker
                .register('/sw.js', { scope: '/', updateViaCache: 'none' })
                .catch(() => {
                    // An unavailable worker only costs offline support.
                });
        };

        if (document.readyState === 'complete') {
            register();
            return;
        }

        window.addEventListener('load', register);
        return () => window.removeEventListener('load', register);
    }, []);

    return null;
}
