import Link from 'next/link';

import { Artwork } from '@/components/artwork';
import { MediaMeta } from '@/components/media-meta';
import { PlayBadge } from '@/components/play-badge';
import { Badge } from '@/components/ui/badge';
import { KIND_LABELS, type Media } from '@/lib/media';

type MediaCardProps = {
    item: Media;
    /** Tags the poster Movie/Series — worth it where a list mixes both. */
    showKind?: boolean;
};

export function MediaCard({ item, showKind = false }: MediaCardProps) {
    return (
        <Link
            href={`/watch/${item.id}`}
            className="group focus-visible:ring-ring/40 block rounded-2xl outline-none focus-visible:ring-3"
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-[0_18px_45px_-20px_rgb(0_0_0/0.9)] group-hover:ring-white/25">
                <Artwork
                    hue={item.hue}
                    title={item.title}
                    className="size-full transition-transform duration-500 group-hover:scale-105"
                />
                {showKind ? (
                    <Badge className="absolute top-2 left-2 bg-black/55 text-[10px] text-white backdrop-blur-sm">
                        {KIND_LABELS[item.kind]}
                    </Badge>
                ) : null}
                <span className="absolute inset-0 grid place-items-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <PlayBadge className="bg-white/20 text-white ring-white/40" />
                </span>
            </div>

            <MediaMeta
                className="mt-3"
                rating={item.rating}
                comments={item.comments}
            />
            <p className="mt-1.5 line-clamp-2 text-sm leading-snug font-medium text-white">
                {item.title}
            </p>
        </Link>
    );
}
