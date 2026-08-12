import type { MetadataRoute } from 'next';

/** Matches --background in app/globals.css, converted to sRGB. */
export const THEME_COLOR = '#050b09';

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: '/home',
        name: 'Movie Gather',
        short_name: 'Movie Gather',
        description:
            'Watch new releases, follow what everyone is streaming right now, and pick up your series where you left off.',
        // `/` only redirects here, so launching straight at /home skips a hop.
        start_url: '/home',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: THEME_COLOR,
        theme_color: THEME_COLOR,
        categories: ['entertainment', 'video'],
        lang: 'en',
        dir: 'ltr',
        icons: [
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            // Android crops icons to the launcher's shape; these keep the mark
            // inside the safe zone so nothing important gets clipped.
            {
                src: '/icons/icon-192-maskable.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icons/icon-512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: 'New this fortnight',
                short_name: 'New',
                url: '/new',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
            },
            {
                name: 'Movies',
                short_name: 'Movies',
                url: '/movies',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
            },
            {
                name: 'Series',
                short_name: 'Series',
                url: '/series',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
            },
        ],
    };
}
