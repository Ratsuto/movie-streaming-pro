import Link from 'next/link';
import {
    DownloadIcon,
    PlusIcon,
    Share2Icon,
    StarIcon,
    ThumbsUpIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GENRE_LABELS, KIND_LABELS, type Media } from '@/lib/media';

type WatchDetailsProps = {
    item: Media;
    /** e.g. "3 seasons · 24 episodes" for series, "2h 27m" for movies. */
    lengthLabel: string;
};

function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-muted-foreground text-xs">{label}</dt>
            <dd className="mt-1 text-sm text-white">{value}</dd>
        </div>
    );
}

export function WatchDetails({ item, lengthLabel }: WatchDetailsProps) {
    const collectionPath = item.kind === 'movie' ? '/movies' : '/series';

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/15 text-primary border-primary/25">
                    {KIND_LABELS[item.kind]}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                    {item.maturity}
                </Badge>
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                    <StarIcon className="size-3.5" aria-hidden />
                    {item.rating.toFixed(1)}
                    <span className="sr-only">out of 10 on</span> iMDB
                </span>
                <span aria-hidden className="size-1 rounded-full bg-white/25" />
                <span className="text-muted-foreground text-xs">
                    {item.year}
                </span>
                <span aria-hidden className="size-1 rounded-full bg-white/25" />
                <span className="text-muted-foreground text-xs">
                    {lengthLabel}
                </span>
            </div>

            <h1 className="font-heading mt-4 text-3xl leading-tight font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                {item.title}
            </h1>

            <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                {item.synopsis}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Button className="rounded-full">
                    <PlusIcon />
                    My list
                </Button>
                <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                    <ThumbsUpIcon />
                    Like
                </Button>
                <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                    <Share2Icon />
                    Share
                </Button>
                <Button
                    variant="ghost"
                    className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <DownloadIcon />
                    Download
                </Button>
            </div>

            <Separator className="my-8 bg-white/10" />

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                <Fact label="Type" value={KIND_LABELS[item.kind]} />
                <Fact label="Released" value={String(item.year)} />
                <Fact
                    label={item.kind === 'movie' ? 'Runtime' : 'Length'}
                    value={lengthLabel}
                />
                <Fact label="Rated" value={item.maturity} />
            </dl>

            <div className="mt-6">
                <p className="text-muted-foreground text-xs">Categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {item.genres.map((genre) => (
                        <Link
                            key={genre}
                            href={`${collectionPath}?genre=${genre}`}
                            className="focus-visible:ring-ring/40 text-muted-foreground inline-flex h-8 items-center rounded-full border border-white/10 bg-white/5 px-3 text-xs transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3"
                        >
                            {GENRE_LABELS[genre]}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
