import type { Metadata } from 'next';
import Link from 'next/link';
import {
    BellIcon,
    ChevronRightIcon,
    CreditCardIcon,
    DownloadIcon,
    LogOutIcon,
    PlayIcon,
    SettingsIcon,
    UserIcon,
} from 'lucide-react';

import { Artwork } from '@/components/artwork';
import { MediaMeta } from '@/components/media-meta';
import { PlayBadge } from '@/components/play-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { nowWatching } from '@/lib/media';

export const metadata: Metadata = {
    title: 'Profile — Movie Gather',
    description: 'Your Movie Gather account, viewing history and settings.',
};

const stats = [
    { label: 'Titles watched', value: '128' },
    { label: 'Hours streamed', value: '241' },
    { label: 'In my list', value: '17' },
];

const settings = [
    {
        label: 'Account',
        description: 'Name, email and password',
        icon: UserIcon,
    },
    {
        label: 'Subscription',
        description: 'Premium · renews 12 September',
        icon: CreditCardIcon,
    },
    {
        label: 'Playback',
        description: 'Quality, autoplay and subtitles',
        icon: SettingsIcon,
    },
    {
        label: 'Downloads',
        description: 'Wi-Fi only · 4 titles stored',
        icon: DownloadIcon,
    },
    {
        label: 'Notifications',
        description: 'New episodes and recommendations',
        icon: BellIcon,
    },
];

export default function ProfilePage() {
    return (
        <>
            {/* Ambient wash so the page opens with colour behind the header,
                the same way every other route does. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96"
                style={{
                    backgroundImage:
                        'radial-gradient(70% 60% at 50% 0%, oklch(0.45 0.1 175 / 0.45), transparent 70%)',
                }}
            />

            <div aria-hidden className="h-20" />

            <main className="px-5 pb-24 lg:px-10">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <Avatar className="size-16 ring-1 ring-white/15 sm:size-20">
                            <AvatarFallback className="bg-white/10 text-lg font-medium text-white">
                                LP
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <h1 className="font-heading text-2xl leading-tight font-light tracking-tight text-white sm:text-3xl">
                                Lee Phang
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge className="bg-primary/15 text-primary border-primary/25">
                                    Premium
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                    Member since 2024
                                </span>
                            </div>
                        </div>
                    </div>

                    <dl className="mt-8 grid grid-cols-3 gap-3">
                        {stats.map(({ label, value }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-center"
                            >
                                <dt className="text-muted-foreground text-xs">
                                    {label}
                                </dt>
                                <dd className="font-heading mt-1 text-2xl font-light text-white">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <section
                        aria-labelledby="continue-heading"
                        className="mt-12"
                    >
                        <h2
                            id="continue-heading"
                            className="font-heading text-xl font-medium text-white"
                        >
                            Continue watching
                        </h2>

                        <ul className="mt-4 space-y-3">
                            {nowWatching.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/watch/${item.id}`}
                                        className="group focus-visible:ring-ring/40 flex items-center gap-4 rounded-2xl p-2 transition-colors outline-none hover:bg-white/5 focus-visible:ring-3"
                                    >
                                        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-32">
                                            <Artwork
                                                hue={item.hue}
                                                kind="backdrop"
                                                className="size-full"
                                            />
                                            <span className="absolute inset-0 grid place-items-center">
                                                <PlayBadge
                                                    size="sm"
                                                    className="bg-white/20 text-white ring-white/40"
                                                />
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-white">
                                                {item.title}
                                            </p>
                                            <MediaMeta
                                                className="mt-1.5"
                                                rating={item.rating}
                                                comments={item.comments}
                                            />
                                        </div>

                                        <PlayIcon
                                            aria-hidden
                                            className="text-muted-foreground size-4 shrink-0 transition-colors group-hover:text-white"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section
                        aria-labelledby="settings-heading"
                        className="mt-12"
                    >
                        <h2
                            id="settings-heading"
                            className="font-heading text-xl font-medium text-white"
                        >
                            Settings
                        </h2>

                        <div className="mt-4 space-y-1">
                            {settings.map(
                                ({ label, description, icon: Icon }) => (
                                    <Item
                                        key={label}
                                        render={<button type="button" />}
                                        className="text-left hover:bg-white/5"
                                    >
                                        <ItemMedia
                                            variant="icon"
                                            className="text-primary bg-primary/10 size-9 rounded-full"
                                        >
                                            <Icon />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle className="text-white">
                                                {label}
                                            </ItemTitle>
                                            <ItemDescription>
                                                {description}
                                            </ItemDescription>
                                        </ItemContent>
                                        <ChevronRightIcon
                                            aria-hidden
                                            className="text-muted-foreground size-4 shrink-0"
                                        />
                                    </Item>
                                )
                            )}
                        </div>

                        <Separator className="my-6 bg-white/10" />

                        <Item
                            render={<button type="button" />}
                            className="text-destructive text-left hover:bg-white/5"
                        >
                            <ItemMedia
                                variant="icon"
                                className="bg-destructive/10 text-destructive size-9 rounded-full"
                            >
                                <LogOutIcon />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-destructive">
                                    Sign out
                                </ItemTitle>
                            </ItemContent>
                        </Item>
                    </section>
                </div>
            </main>
        </>
    );
}
