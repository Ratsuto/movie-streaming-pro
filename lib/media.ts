export type MediaKind = 'movie' | 'series';

export type Genre =
    | 'action'
    | 'anime'
    | 'comedy'
    | 'documentary'
    | 'drama'
    | 'horror'
    | 'romance'
    | 'sci-fi'
    | 'thriller';

export type Media = {
    id: string;
    title: string;
    year: number;
    /** iMDB score, 0–10. */
    rating: number;
    comments: number;
    /**
     * Base hue (deg) used to generate the placeholder artwork. Swap the art for
     * real stills by adding a `poster` field and rendering it in `<Artwork />`.
     */
    hue: number;
    kind: MediaKind;
    genres: Genre[];
    /** Days since it landed in the catalog — drives the "New" ordering. */
    addedDaysAgo: number;
};

export type LiveMedia = Media & {
    /** People watching right now. */
    viewers: number;
};

export const GENRE_LABELS: Record<Genre, string> = {
    action: 'Action',
    anime: 'Anime',
    comedy: 'Comedy',
    documentary: 'Documentary',
    drama: 'Drama',
    horror: 'Horror',
    romance: 'Romance',
    'sci-fi': 'Sci-Fi',
    thriller: 'Thriller',
};

export const KIND_LABELS: Record<MediaKind, string> = {
    movie: 'Movie',
    series: 'Series',
};

export const catalog: Media[] = [
    // Movies
    {
        id: 'mission-impossible',
        title: 'Mission Impossible',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 152,
        kind: 'movie',
        genres: ['action', 'thriller'],
        addedDaysAgo: 2,
    },
    {
        id: 'tron-ares',
        title: 'Tron. Ares',
        year: 2026,
        rating: 4.6,
        comments: 24,
        hue: 25,
        kind: 'movie',
        genres: ['sci-fi', 'action'],
        addedDaysAgo: 4,
    },
    {
        id: 'greenland-2',
        title: 'Greenland 2',
        year: 2026,
        rating: 4.3,
        comments: 12,
        hue: 240,
        kind: 'movie',
        genres: ['action', 'thriller'],
        addedDaysAgo: 6,
    },
    {
        id: 'marty-supreme',
        title: 'Marty Supreme',
        year: 2026,
        rating: 3.1,
        comments: 18,
        hue: 58,
        kind: 'movie',
        genres: ['drama'],
        addedDaysAgo: 1,
    },
    {
        id: 'pillon',
        title: 'Pillon',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 28,
        kind: 'movie',
        genres: ['action', 'thriller'],
        addedDaysAgo: 3,
    },
    {
        id: 'avatar',
        title: 'Avatar',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 42,
        kind: 'movie',
        genres: ['sci-fi', 'action'],
        addedDaysAgo: 20,
    },
    {
        id: 'xxx',
        title: 'XXX',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 18,
        kind: 'movie',
        genres: ['action'],
        addedDaysAgo: 24,
    },
    {
        id: 'people-we-meet-on-vacation',
        title: 'People we meet on vacation',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 198,
        kind: 'movie',
        genres: ['romance', 'comedy'],
        addedDaysAgo: 9,
    },
    {
        id: 'the-internship',
        title: 'The Internship',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 245,
        kind: 'movie',
        genres: ['comedy'],
        addedDaysAgo: 7,
    },
    {
        id: 'weapons',
        title: 'Weapons',
        year: 2026,
        rating: 4.2,
        comments: 22,
        hue: 350,
        kind: 'movie',
        genres: ['horror', 'thriller'],
        addedDaysAgo: 11,
    },
    {
        id: 'the-substance',
        title: 'The Substance',
        year: 2026,
        rating: 4.5,
        comments: 33,
        hue: 320,
        kind: 'movie',
        genres: ['horror', 'drama'],
        addedDaysAgo: 14,
    },
    {
        id: 'sinners',
        title: 'Sinners',
        year: 2026,
        rating: 4.7,
        comments: 29,
        hue: 12,
        kind: 'movie',
        genres: ['horror'],
        addedDaysAgo: 16,
    },
    {
        id: 'dune-part-three',
        title: 'Dune: Part Three',
        year: 2026,
        rating: 4.9,
        comments: 41,
        hue: 62,
        kind: 'movie',
        genres: ['sci-fi', 'drama'],
        addedDaysAgo: 18,
    },
    {
        id: 'suzume',
        title: 'Suzume',
        year: 2026,
        rating: 4.6,
        comments: 26,
        hue: 210,
        kind: 'movie',
        genres: ['anime', 'drama'],
        addedDaysAgo: 21,
    },
    {
        id: 'a-silent-sky',
        title: 'A Silent Sky',
        year: 2026,
        rating: 4.4,
        comments: 19,
        hue: 265,
        kind: 'movie',
        genres: ['anime', 'romance'],
        addedDaysAgo: 26,
    },
    {
        id: 'deep-blue-planet',
        title: 'Deep Blue Planet',
        year: 2026,
        rating: 4.5,
        comments: 8,
        hue: 190,
        kind: 'movie',
        genres: ['documentary'],
        addedDaysAgo: 28,
    },
    {
        id: 'the-last-lap',
        title: 'The Last Lap',
        year: 2026,
        rating: 4.1,
        comments: 11,
        hue: 105,
        kind: 'movie',
        genres: ['documentary', 'drama'],
        addedDaysAgo: 30,
    },

    // Series
    {
        id: 'the-pitt',
        title: 'The Pitt',
        year: 2026,
        rating: 4.1,
        comments: 18,
        hue: 85,
        kind: 'series',
        genres: ['drama'],
        addedDaysAgo: 1,
    },
    {
        id: 'the-night-manager',
        title: 'The Night Manager',
        year: 2026,
        rating: 3.2,
        comments: 18,
        hue: 228,
        kind: 'series',
        genres: ['thriller', 'drama'],
        addedDaysAgo: 2,
    },
    {
        id: 'fallout',
        title: 'Fallout',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 72,
        kind: 'series',
        genres: ['sci-fi', 'action'],
        addedDaysAgo: 3,
    },
    {
        id: 'pluribus',
        title: 'Pluribus',
        year: 2026,
        rating: 4.9,
        comments: 31,
        hue: 95,
        kind: 'series',
        genres: ['sci-fi', 'drama'],
        addedDaysAgo: 4,
    },
    {
        id: 'tell-me-lies',
        title: 'Tell me lies',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 252,
        kind: 'series',
        genres: ['drama', 'romance'],
        addedDaysAgo: 5,
    },
    {
        id: 'jujutsu-kaisen',
        title: 'Jujutsu Kaisen',
        year: 2026,
        rating: 4.9,
        comments: 52,
        hue: 285,
        kind: 'series',
        genres: ['anime', 'action'],
        addedDaysAgo: 6,
    },
    {
        id: 'his-and-hers',
        title: 'His & Hers',
        year: 2026,
        rating: 4.8,
        comments: 18,
        hue: 275,
        kind: 'series',
        genres: ['thriller', 'drama'],
        addedDaysAgo: 8,
    },
    {
        id: 'chainsaw-man',
        title: 'Chainsaw Man',
        year: 2026,
        rating: 4.7,
        comments: 44,
        hue: 8,
        kind: 'series',
        genres: ['anime', 'horror'],
        addedDaysAgo: 10,
    },
    {
        id: 'frieren',
        title: 'Frieren',
        year: 2026,
        rating: 4.9,
        comments: 37,
        hue: 168,
        kind: 'series',
        genres: ['anime', 'drama'],
        addedDaysAgo: 12,
    },
    {
        id: 'solo-leveling',
        title: 'Solo Leveling',
        year: 2026,
        rating: 4.6,
        comments: 48,
        hue: 230,
        kind: 'series',
        genres: ['anime', 'action'],
        addedDaysAgo: 13,
    },
    {
        id: 'the-bear',
        title: 'The Bear',
        year: 2026,
        rating: 4.7,
        comments: 27,
        hue: 88,
        kind: 'series',
        genres: ['comedy', 'drama'],
        addedDaysAgo: 15,
    },
    {
        id: 'midnight-mass-ii',
        title: 'Midnight Mass II',
        year: 2026,
        rating: 4.3,
        comments: 21,
        hue: 300,
        kind: 'series',
        genres: ['horror', 'thriller'],
        addedDaysAgo: 17,
    },
    {
        id: 'wednesday',
        title: 'Wednesday',
        year: 2026,
        rating: 4.4,
        comments: 35,
        hue: 128,
        kind: 'series',
        genres: ['horror', 'comedy'],
        addedDaysAgo: 19,
    },
    {
        id: 'one-piece-live',
        title: 'One Piece',
        year: 2026,
        rating: 4.2,
        comments: 30,
        hue: 40,
        kind: 'series',
        genres: ['action', 'comedy'],
        addedDaysAgo: 22,
    },
    {
        id: 'severance',
        title: 'Severance',
        year: 2026,
        rating: 4.9,
        comments: 46,
        hue: 200,
        kind: 'series',
        genres: ['sci-fi', 'thriller'],
        addedDaysAgo: 25,
    },
];

const byId = new Map(catalog.map((item) => [item.id, item]));

/** Throws at module load if a curated list references a title that was removed. */
function get(id: string): Media {
    const item = byId.get(id);
    if (!item) throw new Error(`Unknown media id: ${id}`);
    return item;
}

function live(id: string, viewers: number): LiveMedia {
    return { ...get(id), viewers };
}

export const heroSlides: LiveMedia[] = [
    live('mission-impossible', 243),
    live('tron-ares', 422),
    live('pluribus', 307),
    live('greenland-2', 188),
];

export const nowWatching: LiveMedia[] = [
    live('the-night-manager', 123),
    live('tron-ares', 422),
    live('pluribus', 307),
];

export const newReleases: Media[] = [
    'marty-supreme',
    'the-pitt',
    'pillon',
    'the-night-manager',
    'tell-me-lies',
    'fallout',
    'the-internship',
].map(get);

export const trending: Media[] = [
    'pluribus',
    'tron-ares',
    'people-we-meet-on-vacation',
    'his-and-hers',
    'avatar',
    'xxx',
    'greenland-2',
].map(get);

export function isGenre(value: unknown): value is Genre {
    return typeof value === 'string' && value in GENRE_LABELS;
}

/**
 * Titles for a collection page: narrowed to one kind (or all kinds on `/new`),
 * optionally filtered by genre, newest first.
 */
export function collection({
    kind,
    genre,
    maxAgeDays,
}: {
    kind?: MediaKind;
    genre?: Genre;
    /** Keeps only recent additions — how `/new` stays distinct from the catalogue. */
    maxAgeDays?: number;
} = {}): Media[] {
    return catalog
        .filter((item) => (kind ? item.kind === kind : true))
        .filter((item) => (genre ? item.genres.includes(genre) : true))
        .filter((item) =>
            maxAgeDays === undefined ? true : item.addedDaysAgo <= maxAgeDays
        )
        .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
}

/** The genres actually present in a set of titles, with counts, alphabetical. */
export function genresOf(items: Media[]): { genre: Genre; count: number }[] {
    const counts = new Map<Genre, number>();

    for (const item of items) {
        for (const genre of item.genres) {
            counts.set(genre, (counts.get(genre) ?? 0) + 1);
        }
    }

    return [...counts.entries()]
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) =>
            GENRE_LABELS[a.genre].localeCompare(GENRE_LABELS[b.genre])
        );
}
