'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Artwork } from '@/components/artwork';
import { MediaMeta } from '@/components/media-meta';
import { NowWatching } from '@/components/now-watching';
import { PlayBadge } from '@/components/play-badge';
import type { LiveMedia } from '@/lib/media';
import { cn } from '@/lib/utils';

const SLIDE_DURATION_MS = 7000;

type HeroShowcaseProps = {
    slides: LiveMedia[];
    nowWatching: LiveMedia[];
};

export function HeroShowcase({ slides, nowWatching }: HeroShowcaseProps) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || slides.length < 2) return;

        const timer = setInterval(
            () => setActive((current) => (current + 1) % slides.length),
            SLIDE_DURATION_MS
        );

        return () => clearInterval(timer);
    }, [paused, slides.length]);

    const slide = slides[active];

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured titles"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative isolate"
        >
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {slides.map((item, index) => (
                    <Artwork
                        key={item.id}
                        hue={item.hue}
                        kind="backdrop"
                        className={cn(
                            'absolute inset-0 transition-opacity duration-1000 ease-out',
                            index === active ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                ))}
                {/* Scrims: darken the left third for the copy, then melt the
                    whole thing into the page background at the bottom. */}
                <div className="from-background/95 via-background/55 absolute inset-0 bg-gradient-to-r to-transparent" />
                <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
            </div>

            {/* Reserves the row the absolutely positioned header sits in. */}
            <div aria-hidden className="h-20" />

            <div className="grid gap-10 px-5 pt-6 pb-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:px-10 lg:pt-10">
                <div className="flex min-h-56 flex-col justify-center sm:min-h-80 lg:min-h-96">
                    <div
                        key={slide.id}
                        className="animate-in fade-in slide-in-from-bottom-4 flex items-center gap-4 duration-700 sm:gap-8"
                    >
                        <Link
                            href={`/watch/${slide.id}`}
                            className="focus-visible:ring-ring/40 rounded-full outline-none focus-visible:ring-3"
                        >
                            <PlayBadge
                                size="lg"
                                className="hover:bg-primary/25 shadow-[0_0_60px_-10px_var(--primary)]"
                            />
                            <span className="sr-only">Play {slide.title}</span>
                        </Link>

                        <div className="min-w-0">
                            <p className="text-sm text-white/70">
                                {slide.year}
                            </p>
                            <h1 className="font-heading mt-1 max-w-[7ch] text-4xl leading-[1.02] font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
                                {slide.title}
                            </h1>
                            <MediaMeta
                                className="mt-5 text-white/70"
                                rating={slide.rating}
                                comments={slide.comments}
                                viewers={slide.viewers}
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2">
                        {slides.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActive(index)}
                                aria-label={`Show ${item.title}`}
                                aria-current={index === active}
                                className={cn(
                                    'focus-visible:ring-ring/40 h-1.5 rounded-full transition-all outline-none focus-visible:ring-3',
                                    index === active
                                        ? 'bg-primary w-6'
                                        : 'w-1.5 bg-white/35 hover:bg-white/60'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <NowWatching items={nowWatching} />
            </div>
        </section>
    );
}
