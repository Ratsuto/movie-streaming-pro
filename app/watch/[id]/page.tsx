import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

import { MediaRow } from '@/components/media-row';
import { SeasonEpisodes } from '@/components/season-episodes';
import { VideoPlayer } from '@/components/video-player';
import { WatchDetails } from '@/components/watch-details';
import {
    findMedia,
    resumePoint,
    seasonsOf,
    similarTo,
    type Season,
} from '@/lib/media';
import { videoSource } from '@/lib/video';

type WatchPageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ season?: string | string[]; episode?: string }>;
};

function toNumber(value: string | string[] | undefined): number | undefined {
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw === undefined) return undefined;
    const parsed = Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
}

/**
 * Resolves which episode the player should show. A `season` in the URL always
 * lands on that season's first episode unless an `episode` is given too, so
 * switching seasons never leaves a stale episode number behind.
 */
function resolveEpisode(
    seasons: Season[],
    requestedSeason: number | undefined,
    requestedEpisode: number | undefined
) {
    const resume = resumePoint(seasons);
    let season = resume.season;
    let episode = resume.episode;

    if (
        requestedSeason !== undefined &&
        seasons.some((entry) => entry.number === requestedSeason)
    ) {
        season = requestedSeason;
        episode = 1;
    }

    if (requestedEpisode !== undefined) {
        const current = seasons.find((entry) => entry.number === season);
        if (current?.episodes.some((e) => e.number === requestedEpisode)) {
            episode = requestedEpisode;
        }
    }

    return { season, episode };
}

export async function generateMetadata({
    params,
}: WatchPageProps): Promise<Metadata> {
    const { id } = await params;
    const item = findMedia(id);

    if (!item) return { title: 'Not found — Movie Gather' };

    return {
        title: `${item.title} — Movie Gather`,
        description: item.synopsis,
    };
}

export default async function WatchPage({
    params,
    searchParams,
}: WatchPageProps) {
    const { id } = await params;
    const item = findMedia(id);

    if (!item) notFound();

    const { season: seasonParam, episode: episodeParam } = await searchParams;
    const seasons = seasonsOf(item);
    const isSeries = item.kind === 'series' && seasons.length > 0;

    const { season: activeSeason, episode: activeEpisode } = resolveEpisode(
        seasons,
        toNumber(seasonParam),
        toNumber(episodeParam)
    );

    const currentEpisode = isSeries
        ? seasons
              .find((entry) => entry.number === activeSeason)
              ?.episodes.find((entry) => entry.number === activeEpisode)
        : undefined;

    const episodeCount = seasons.reduce(
        (total, entry) => total + entry.episodes.length,
        0
    );

    const lengthLabel = isSeries
        ? `${seasons.length} season${seasons.length > 1 ? 's' : ''} · ${episodeCount} episodes`
        : formatRuntime(item.runtime ?? 0);

    const similar = similarTo(item);

    return (
        <>
            {/* Ambient wash behind the player, tinted to the title's artwork. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-144"
                style={{
                    backgroundImage: `radial-gradient(70% 60% at 50% 0%, oklch(0.45 0.12 ${item.hue} / 0.5), transparent 70%)`,
                }}
            />

            <div aria-hidden className="h-20" />

            <main className="px-5 pb-24 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <Link
                        href={item.kind === 'movie' ? '/movies' : '/series'}
                        className="text-muted-foreground focus-visible:ring-ring/40 mb-4 inline-flex items-center gap-1.5 rounded-full text-sm transition-colors outline-none hover:text-white focus-visible:ring-3"
                    >
                        <ChevronLeftIcon className="size-4" aria-hidden />
                        Back to {item.kind === 'movie' ? 'movies' : 'series'}
                    </Link>

                    <VideoPlayer
                        // Remounting per episode resets playback position.
                        key={`${item.id}-${activeSeason}-${activeEpisode}`}
                        title={
                            currentEpisode ? currentEpisode.title : item.title
                        }
                        label={
                            currentEpisode
                                ? `${item.title} · S${activeSeason} E${activeEpisode}`
                                : `${item.year} · ${lengthLabel}`
                        }
                        hue={item.hue}
                        source={videoSource(item.id, currentEpisode?.number)}
                        durationMinutes={
                            currentEpisode?.runtime ?? item.runtime ?? 100
                        }
                        startAt={
                            currentEpisode?.progress !== undefined &&
                            currentEpisode.progress < 1
                                ? currentEpisode.progress
                                : 0
                        }
                    />

                    <div className="mt-10">
                        <WatchDetails item={item} lengthLabel={lengthLabel} />
                    </div>

                    {isSeries ? (
                        <div className="mt-14">
                            <SeasonEpisodes
                                basePath={`/watch/${item.id}`}
                                seasons={seasons}
                                activeSeason={activeSeason}
                                activeEpisode={activeEpisode}
                                hue={item.hue}
                            />
                        </div>
                    ) : null}

                    {similar.length > 0 ? (
                        <div className="mt-16">
                            <MediaRow title="More like this" items={similar} />
                        </div>
                    ) : null}
                </div>
            </main>
        </>
    );
}
