import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { Artwork } from '@/components/artwork';
import { Wordmark } from '@/components/wordmark';

type AuthShellProps = {
    /** Base hue for the panel artwork, so the two pages don't look identical. */
    hue: number;
    title: string;
    description: string;
    /** The form itself. */
    children: ReactNode;
    /** The cross-link to the other auth page. */
    footer: ReactNode;
};

const highlights = [
    'Thousands of movies and series, no ads mid-scene.',
    'Pick up any episode exactly where you stopped.',
    'Download for the flight, watch without a signal.',
];

/**
 * Two-panel frame for `/login` and `/register`: key art and copy on the left,
 * the form on the right, collapsing to just the form below `lg`.
 *
 * The site header and tab bar hide themselves on these routes (see
 * `CHROMELESS_ROUTES` in lib/navigation.ts), so this owns its own wordmark and
 * the way back into the app.
 */
export function AuthShell({
    hue,
    title,
    description,
    children,
    footer,
}: AuthShellProps) {
    return (
        <main className="flex flex-1 flex-col lg:flex-row">
            <aside className="relative hidden overflow-hidden lg:flex lg:w-[45%] lg:flex-col lg:justify-between lg:p-12">
                <Artwork
                    hue={hue}
                    kind="backdrop"
                    className="absolute inset-0"
                />
                {/* Darkens the art enough for the copy to hold contrast. */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-black/35"
                    style={{
                        backgroundImage:
                            'linear-gradient(to top right, oklch(0.14 0.012 175 / 0.85), transparent 65%)',
                    }}
                />

                <div className="relative">
                    <Wordmark />
                </div>

                <div className="relative max-w-md">
                    <p className="font-heading text-4xl leading-[1.1] font-light tracking-tight text-white">
                        Every story, gathered in one place.
                    </p>

                    <ul className="mt-8 space-y-3">
                        {highlights.map((highlight) => (
                            <li
                                key={highlight}
                                className="flex items-start gap-3 text-sm text-white/70"
                            >
                                <span
                                    aria-hidden
                                    className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                                />
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <div className="relative flex flex-1 items-center justify-center px-5 py-14 lg:px-12">
                {/* Mobile gets the same ambient wash every other route opens
                    with, since the art panel is hidden at this width. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-80 lg:hidden"
                    style={{
                        backgroundImage: `radial-gradient(70% 60% at 50% 0%, oklch(0.45 0.1 ${hue} / 0.45), transparent 70%)`,
                    }}
                />

                <div className="relative w-full max-w-sm">
                    <div className="lg:hidden">
                        <Wordmark />
                    </div>

                    <h1 className="font-heading mt-10 text-3xl leading-tight font-light tracking-tight text-white lg:mt-0">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {description}
                    </p>

                    <div className="mt-8">{children}</div>

                    <div className="mt-8 space-y-4 text-sm">
                        {footer}

                        <Link
                            href="/home"
                            className="focus-visible:ring-ring/40 text-muted-foreground inline-flex items-center gap-2 rounded-full transition-colors outline-none hover:text-white focus-visible:ring-3"
                        >
                            <ArrowLeftIcon aria-hidden className="size-4" />
                            Keep browsing without an account
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
