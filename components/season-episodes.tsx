import Link from 'next/link';
import { CheckIcon } from 'lucide-react';

import { Artwork } from '@/components/artwork';
import { PlayBadge } from '@/components/play-badge';
import type { Season } from '@/lib/media';
import { cn } from '@/lib/utils';

type SeasonEpisodesProps = {
    /** Route the season/episode links point at, e.g. `/watch/severance`. */
    basePath: string;
    seasons: Season[];
    activeSeason: number;
    activeEpisode: number;
    /** Base hue of the series — episode stills are shifted off it. */
    hue: number;
};

export function SeasonEpisodes({
    basePath,
    seasons,
    activeSeason,
    activeEpisode,
    hue,
}: SeasonEpisodesProps) {
    const season =
        seasons.find((entry) => entry.number === activeSeason) ?? seasons[0];

    return (
        <section aria-labelledby="episodes-heading">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2
                    id="episodes-heading"
                    className="font-heading text-2xl font-medium text-white"
                >
                    Episodes
                </h2>

                <nav aria-label="Season" className="flex flex-wrap gap-2">
                    {seasons.map((entry) => {
                        const isActive = entry.number === season.number;

                        return (
                            <Link
                                key={entry.number}
                                href={`${basePath}?season=${entry.number}`}
                                scroll={false}
                                aria-current={isActive ? 'true' : undefined}
                                className={cn(
                                    'focus-visible:ring-ring/40 inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors outline-none focus-visible:ring-3',
                                    isActive
                                        ? 'bg-primary text-primary-foreground border-transparent font-medium'
                                        : 'text-muted-foreground border-white/10 bg-white/5 hover:bg-white/10 hover:text-white'
                                )}
                            >
                                Season {entry.number}
                                <span
                                    className={cn(
                                        'text-xs tabular-nums',
                                        isActive
                                            ? 'text-primary-foreground/70'
                                            : 'text-white/35'
                                    )}
                                >
                                    {entry.episodes.length}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <p className="text-muted-foreground mt-2 text-sm">
                Season {season.number} · {season.year} ·{' '}
                {season.episodes.length} episodes
            </p>

            <ul className="mt-6 divide-y divide-white/8 border-y border-white/8">
                {season.episodes.map((episode) => {
                    const isPlaying =
                        season.number === activeSeason &&
                        episode.number === activeEpisode;
                    const isWatched = episode.progress === 1;
                    const partial =
                        episode.progress !== undefined && episode.progress < 1
                            ? episode.progress
                            : undefined;

                    return (
                        <li key={episode.number}>
                            <Link
                                href={`${basePath}?season=${season.number}&episode=${episode.number}`}
                                scroll={false}
                                aria-current={isPlaying ? 'true' : undefined}
                                className={cn(
                                    'group focus-visible:ring-ring/40 flex gap-4 px-2 py-4 transition-colors outline-none focus-visible:ring-3 sm:gap-5 sm:px-3',
                                    isPlaying
                                        ? 'bg-primary/8'
                                        : 'hover:bg-white/4'
                                )}
                            >
                                <span
                                    className={cn(
                                        'w-6 shrink-0 pt-1 text-sm tabular-nums',
                                        isPlaying
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    {episode.number}
                                </span>

                                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-40">
                                    <Artwork
                                        hue={hue + episode.number * 12}
                                        kind="backdrop"
                                        className="size-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute inset-0 grid place-items-center">
                                        <PlayBadge
                                            size="sm"
                                            className={cn(
                                                'bg-white/20 text-white ring-white/40 transition-opacity',
                                                isPlaying
                                                    ? 'opacity-100'
                                                    : 'opacity-0 group-hover:opacity-100'
                                            )}
                                        />
                                    </span>
                                    {isWatched ? (
                                        <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                                            <CheckIcon
                                                className="size-3"
                                                aria-hidden
                                            />
                                            <span className="sr-only">
                                                Watched
                                            </span>
                                        </span>
                                    ) : null}
                                    {partial !== undefined ? (
                                        <span className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
                                            <span
                                                className="bg-primary block h-full"
                                                style={{
                                                    width: `${Math.round(partial * 100)}%`,
                                                }}
                                            />
                                        </span>
                                    ) : null}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <p
                                            className={cn(
                                                'truncate text-sm font-medium',
                                                isPlaying
                                                    ? 'text-primary'
                                                    : 'text-white'
                                            )}
                                        >
                                            {episode.title}
                                        </p>
                                        <p className="text-muted-foreground shrink-0 text-xs tabular-nums">
                                            {episode.runtime}m
                                        </p>
                                    </div>
                                    <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
                                        {episode.synopsis}
                                    </p>
                                    {isPlaying ? (
                                        <p className="text-primary mt-2 text-xs">
                                            Now playing
                                        </p>
                                    ) : partial !== undefined ? (
                                        <p className="text-muted-foreground mt-2 text-xs">
                                            {Math.round(partial * 100)}% watched
                                        </p>
                                    ) : null}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
