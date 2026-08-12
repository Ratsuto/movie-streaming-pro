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
    /** Placeholder blurb. Replace with real copy when the catalogue is wired up. */
    synopsis: string;
    maturity: string;
    /** Minutes. Movies only — series runtimes live on each episode. */
    runtime?: number;
};

export type LiveMedia = Media & {
    /** People watching right now. */
    viewers: number;
};

export type Episode = {
    number: number;
    title: string;
    synopsis: string;
    /** Minutes. */
    runtime: number;
    /** 0–1 of the episode watched. 1 means finished, undefined means unstarted. */
    progress?: number;
};

export type Season = {
    number: number;
    year: number;
    episodes: Episode[];
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
        maturity: '13+',
        runtime: 147,
        synopsis:
            'An impossible brief, a compromised team and a clock that will not stop — the mission runs across three continents.',
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
        maturity: '13+',
        runtime: 119,
        synopsis:
            'A rogue program crosses into the physical world, and the line between user and system stops holding.',
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
        maturity: '16+',
        runtime: 112,
        synopsis:
            'The sky has cleared, but survival above ground turns out to be its own kind of countdown.',
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
        maturity: '16+',
        runtime: 131,
        synopsis:
            'A gifted nobody talks his way into the big leagues and finds out exactly what winning costs.',
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
        maturity: '16+',
        runtime: 104,
        synopsis:
            'A courier with nothing left to lose takes one last job through a city that wants him gone.',
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
        maturity: '13+',
        runtime: 169,
        synopsis:
            'A world of impossible beauty pulls an outsider between the people who made him and the ones who took him in.',
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
        maturity: '16+',
        runtime: 98,
        synopsis:
            'An extreme-sports outlaw is recruited for a job no trained agent would survive.',
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
        maturity: '13+',
        runtime: 108,
        synopsis:
            'Two friends, ten summers and one week that decides whether they were ever only friends.',
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
        maturity: '13+',
        runtime: 119,
        synopsis:
            'Two analogue salesmen bluff their way into a tech internship and out-argue everyone half their age.',
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
        maturity: '18+',
        runtime: 128,
        synopsis:
            'A town wakes to find every child gone but one, and the questions only get worse from there.',
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
        maturity: '18+',
        runtime: 141,
        synopsis:
            'A fading star takes a treatment that promises a better version of herself, and gets exactly that.',
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
        maturity: '18+',
        runtime: 137,
        synopsis:
            'Two brothers come home to open a bar, and open something else entirely.',
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
        maturity: '13+',
        runtime: 165,
        synopsis:
            'Empire, prophecy and sand — the war for the desert finally reaches the throne it was always aimed at.',
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
        maturity: 'PG',
        runtime: 122,
        synopsis:
            'A girl closes doors that should never have opened, and travels the length of a country to shut the last one.',
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
        maturity: 'PG',
        runtime: 111,
        synopsis:
            'A letter arrives forty years late and sends two strangers looking for the same summer.',
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
        maturity: 'PG',
        runtime: 96,
        synopsis:
            'Four years of filming across every ocean, from the sunlit shallows to trenches no light reaches.',
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
        maturity: '13+',
        runtime: 102,
        synopsis:
            'Behind the pit wall of a season that broke records, and among the people who set them.',
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
        maturity: '16+',
        synopsis:
            'One shift, one emergency department, and fifteen hours that never let up.',
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
        maturity: '16+',
        synopsis:
            'A hotel night manager is recruited to get close to an arms dealer, and finds the job easier than the exit.',
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
        maturity: '18+',
        synopsis:
            'Two hundred years after the bombs, a vault dweller walks into a surface nobody prepared her for.',
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
        maturity: '16+',
        synopsis:
            'The happiest people on earth have a problem, and only one woman can see it.',
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
        maturity: '16+',
        synopsis:
            'A relationship told from both ends at once, where every version is a little bit true.',
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
        maturity: '16+',
        synopsis:
            'A student swallows a cursed relic and enrols in the school that exists to contain what happens next.',
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
        maturity: '16+',
        synopsis:
            'A murder in a small town, told twice, and neither telling is innocent.',
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
        maturity: '18+',
        synopsis:
            'A boy in debt to the wrong people fuses with his devil dog and starts hunting for a living.',
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
        maturity: '13+',
        synopsis:
            'An elf mage outlives her adventuring party and finally starts asking who they were.',
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
        maturity: '16+',
        synopsis:
            'The weakest hunter alive is handed a system nobody else can see, and starts climbing.',
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
        maturity: '16+',
        synopsis:
            "A fine-dining chef inherits his brother's sandwich shop, along with its debts, its staff and its ghosts.",
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
        maturity: '18+',
        synopsis:
            "A new priest arrives on the mainland, and the island's miracles follow him.",
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
        maturity: '13+',
        synopsis:
            'Boarding school, a monster in the woods, and a daughter who would much rather investigate than fit in.',
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
        maturity: '13+',
        synopsis:
            'A crew of misfits sails for a treasure that may not exist, chased by everyone who believes it does.',
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
        maturity: '16+',
        synopsis:
            'Employees split their memories between work and home, until one of them starts asking what the other half does.',
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

export function findMedia(id: string): Media | undefined {
    return byId.get(id);
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

/** Same kind, sharing at least one genre, best rated first. */
export function similarTo(item: Media, limit = 7): Media[] {
    return catalog
        .filter(
            (other) =>
                other.id !== item.id &&
                other.kind === item.kind &&
                other.genres.some((genre) => item.genres.includes(genre))
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Seasons and episodes
//
// Placeholder episode data, generated deterministically from the series id so
// the same title always yields the same seasons — no hydration mismatch, and
// no 400 hand-written episodes. Swap `seasonsOf` for a real lookup when the
// catalogue is wired to an API.
// ---------------------------------------------------------------------------

const EPISODE_TITLES = [
    'Cold Open',
    'The Long Way Down',
    'Static',
    'Everything We Buried',
    'Ninety Seconds',
    'Salt and Ash',
    'The Quiet Part',
    'Homecoming',
    'A Door Left Open',
    'Signal Lost',
    'The Understudy',
    'Glass Houses',
    'What the River Took',
    'Hard Reset',
    'The Second Guess',
    'Paper Walls',
    'Nightshift',
    'Two Truths',
    'The Inheritance',
    'Low Tide',
    'Blackout',
    'The Favour',
    'Grace Period',
    'Sleight of Hand',
    'The Last Good Day',
    'Threshold',
    'Dead Air',
    'The Reckoning',
    'Afterimage',
    'No Exit',
    'The Turning',
    'Where It Ends',
];

const EPISODE_SYNOPSES = [
    'An old debt resurfaces at the worst possible moment.',
    'A decision made in seconds takes the rest of the hour to unravel.',
    'Two people finally say the thing everyone else already knew.',
    'The plan works, which turns out to be the problem.',
    'A stranger arrives with an answer nobody asked for.',
    'What looked like an accident starts looking deliberate.',
    'A promise from the first episode comes due.',
    'The team splits, and only one half knows why.',
    'A quiet hour that changes where everything goes next.',
    'The truth gets out, but not to the people who needed it.',
    'An alliance forms out of pure necessity.',
    'Everyone gets exactly what they wanted.',
];

function hashString(value: string): number {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
}

/**
 * Decorrelates adjacent seeds. Without this, `…e1`, `…e2`, `…e3` hash to
 * consecutive numbers and every derived value marches in lockstep — episode
 * runtimes counting 45m, 46m, 47m and synopses cycling the list in order.
 */
function mix(value: number): number {
    let x = value >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d) >>> 0;
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b) >>> 0;
    x ^= x >>> 16;
    return x >>> 0;
}

function seedOf(...parts: (string | number)[]): number {
    return mix(hashString(parts.join(':')));
}

/** Seasons for a series, newest season last. Movies get an empty list. */
export function seasonsOf(item: Media): Season[] {
    if (item.kind !== 'series') return [];

    const seed = seedOf(item.id);
    const seasonCount = 1 + (seed % 3);
    // How far into season 1 this profile has watched.
    const watched = mix(seed) % 5;

    const episodeCounts = Array.from(
        { length: seasonCount },
        (_, seasonIndex) => 6 + (seedOf(item.id, 's', seasonIndex) % 5)
    );
    // Where each season starts in the series-wide episode run.
    const seasonOffsets = episodeCounts.map((_, seasonIndex) =>
        episodeCounts.slice(0, seasonIndex).reduce((sum, n) => sum + n, 0)
    );

    // Titles are drawn across the whole series, not per season: an odd stride
    // is coprime with the 32-title pool, and no series runs past 30 episodes,
    // so a title never repeats within a series. The 12 synopses are far fewer
    // than that, so those only avoid repeating within a season.
    const firstTitle = seed % EPISODE_TITLES.length;
    const titleStride = 1 + 2 * (mix(seed + 17) % 16);

    return Array.from({ length: seasonCount }, (_, seasonIndex) => {
        const seasonSeed = seedOf(item.id, 's', seasonIndex);
        const episodeCount = episodeCounts[seasonIndex];
        const seasonOffset = seasonOffsets[seasonIndex];
        const firstSynopsis = mix(seasonSeed + 977) % EPISODE_SYNOPSES.length;
        const synopsisStride = [1, 5, 7, 11][mix(seasonSeed + 613) % 4];

        return {
            number: seasonIndex + 1,
            year: item.year - (seasonCount - 1 - seasonIndex),
            episodes: Array.from({ length: episodeCount }, (_, index) => {
                const episodeSeed = seedOf(
                    item.id,
                    's',
                    seasonIndex,
                    'e',
                    index
                );

                let progress: number | undefined;
                if (seasonIndex === 0 && index < watched) {
                    progress = 1;
                } else if (seasonIndex === 0 && index === watched) {
                    progress = (15 + (mix(episodeSeed + 31) % 60)) / 100;
                }

                return {
                    number: index + 1,
                    title: EPISODE_TITLES[
                        (firstTitle + (seasonOffset + index) * titleStride) %
                            EPISODE_TITLES.length
                    ],
                    synopsis:
                        EPISODE_SYNOPSES[
                            (firstSynopsis + index * synopsisStride) %
                                EPISODE_SYNOPSES.length
                        ],
                    runtime: 38 + (episodeSeed % 21),
                    progress,
                };
            }),
        };
    });
}

/** The episode a "Play" button should start: the part-watched one, else the first. */
export function resumePoint(seasons: Season[]): {
    season: number;
    episode: number;
} {
    for (const season of seasons) {
        for (const episode of season.episodes) {
            if (episode.progress !== undefined && episode.progress < 1) {
                return { season: season.number, episode: episode.number };
            }
        }
    }

    return { season: 1, episode: 1 };
}
