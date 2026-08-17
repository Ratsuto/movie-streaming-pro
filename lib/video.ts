import { seedOf } from '@/lib/media';

/**
 * Where a title's stream comes from.
 *
 * Demo build: the two files in `public/Video/` stand in for the whole
 * catalogue, so playback can be exercised end to end without a backend. The
 * file a title gets is derived from its id, so it never changes between
 * renders, and consecutive episodes alternate — stepping through a season
 * visibly swaps the clip instead of replaying the same one.
 *
 * This is the only module that knows where the bytes live. Pointing the app at
 * a real service means rewriting `videoSource()` to return that service's URL
 * (and making it async, plus awaiting it in the watch page, if the URL has to
 * be fetched). The player consumes `{ src, type }` and needs no change.
 */

export type VideoSource = {
    /** URL the `<video>` element loads. */
    src: string;
    /** MIME type, so a browser that cannot decode the file fails fast. */
    type: string;
};

/** Filenames as they sit on disk, spaces and all — URL-encoded below. */
const DEMO_FILES = [
    'Warhammer 40K Warbond is Actually Here.mp4',
    'Was I Wrong About the Macbook Neo_.mp4',
];

export function videoSource(id: string, episode?: number): VideoSource {
    const file = DEMO_FILES[(seedOf(id) + (episode ?? 0)) % DEMO_FILES.length];

    return {
        // `public/Video` is served from `/Video`; the filename is encoded
        // because these carry spaces.
        src: `/Video/${encodeURIComponent(file)}`,
        type: 'video/mp4',
    };
}
