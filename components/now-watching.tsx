import Link from 'next/link';
import { FlameIcon } from 'lucide-react';

import { Artwork } from '@/components/artwork';
import { MediaMeta } from '@/components/media-meta';
import { PlayBadge } from '@/components/play-badge';
import { Badge } from '@/components/ui/badge';
import type { LiveMedia } from '@/lib/media';

export function NowWatching({ items }: { items: LiveMedia[] }) {
    return (
        <section aria-labelledby="now-watching-heading">
            <h2
                id="now-watching-heading"
                className="font-heading text-xl font-medium text-white"
            >
                Now watching
            </h2>

            <ul className="mt-4 space-y-4">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={`/watch/${item.id}`}
                            className="group focus-visible:ring-ring/40 flex gap-4 rounded-2xl outline-none focus-visible:ring-3"
                        >
                            <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-32">
                                <Artwork
                                    hue={item.hue}
                                    kind="backdrop"
                                    className="size-full transition-transform duration-500 group-hover:scale-105"
                                />
                                <Badge className="absolute top-1.5 right-1.5 gap-1 bg-black/55 px-1.5 text-[10px] text-white backdrop-blur-sm">
                                    <FlameIcon aria-hidden />
                                    <span className="sr-only">
                                        Watching now:
                                    </span>
                                    {item.viewers}
                                </Badge>
                                <span className="absolute inset-0 grid place-items-center">
                                    <PlayBadge
                                        size="sm"
                                        className="bg-white/20 text-white ring-white/40 group-hover:bg-white/30"
                                    />
                                </span>
                            </div>

                            <div className="min-w-0 py-0.5">
                                <p className="text-muted-foreground text-xs">
                                    {item.year}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-medium text-white">
                                    {item.title}
                                </p>
                                <MediaMeta
                                    className="mt-2"
                                    rating={item.rating}
                                    comments={item.comments}
                                />
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
